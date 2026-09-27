import React, { useState, useEffect, useRef } from 'react';
import { Task, Phase, TeamMember } from '../types/project';
import { PHASE_COLOR_OPTIONS, getPhaseTheme } from '../utils/phaseColors';
import { 
  Filter, 
  Search, 
  AlertCircle, 
  User, 
  X,
  Plus,
  GripVertical,
  Edit3,
  Trash2,
  Save,
  Check,
  UserPlus,
  FolderPlus
} from 'lucide-react';

interface GanttChartProps {
  tasks: Task[];
  phases: Phase[];
  teamMembers: TeamMember[];
  totalWeeks: number;
  onUpdateTask: (task: Task) => void;
  onAddTask: (newTask: Omit<Task, 'id'> & { id?: string }) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks: (reorderedTasks: Task[]) => void;
  onAddPhase: (newPhase: Phase) => void;
  onAddTeamMember: (newMember: TeamMember) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  phases,
  teamMembers,
  totalWeeks,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onReorderTasks,
  onAddPhase,
  onAddTeamMember,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [activeTaskModal, setActiveTaskModal] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  
  // New task modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [newTaskForm, setNewTaskForm] = useState({
    name: '',
    phaseId: phases[0]?.id || 1,
    assignee: teamMembers[0]?.name || 'Pablo',
    startWeek: 1,
    duration: 1,
    endWeek: 1,
    dependency: '-',
    progress: 0,
    deliverable: '',
    isCritical: false,
    description: '',
  });

  // Inline "Nueva Fase" and "Nuevo Miembro" toggles inside the modal
  const [showAddPhaseForm, setShowAddPhaseForm] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseColor, setNewPhaseColor] = useState('bg-purple-500');

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Drag and Drop reordering state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Excel-style week column selection state (clicking S1, S2, ..., Sn highlights the entire column down)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [filterOnlySelectedWeek, setFilterOnlySelectedWeek] = useState<boolean>(false);

  // Table horizontal scroll container ref for keyboard arrow navigation
  const tableScrollRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation: use directional arrow keys (←, →, ↑, ↓) to move the Gantt chart in all directions at ANY time
  useEffect(() => {
    // Automatically claim keyboard focus to the app window on mount
    if (typeof window !== 'undefined') {
      window.focus();
    }

    const handleArrowNavigation = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas, or when a modal is open
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      );
      if (isInput || activeTaskModal || isNewTaskModalOpen) return;

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const scrollStepX = 110;
        const scrollStepY = 90;

        const container = tableScrollRef.current || (document.querySelector('.gantt-scroll-container') as HTMLDivElement | null);

        if (e.key === 'ArrowRight') {
          container?.scrollBy({ left: scrollStepX, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
          container?.scrollBy({ left: -scrollStepX, behavior: 'smooth' });
        } else if (e.key === 'ArrowDown') {
          window.scrollBy({ top: scrollStepY, behavior: 'smooth' });
          document.documentElement.scrollBy({ top: scrollStepY, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
          window.scrollBy({ top: -scrollStepY, behavior: 'smooth' });
          document.documentElement.scrollBy({ top: -scrollStepY, behavior: 'smooth' });
        }
      }
    };

    // Global listeners in capture phase so arrow keys respond immediately from anywhere in the document
    window.addEventListener('keydown', handleArrowNavigation, { capture: true });
    document.addEventListener('keydown', handleArrowNavigation, { capture: true });

    // Ensure window retains focus when user moves mouse or interacts
    const handleEnsureWindowFocus = () => {
      if (document.activeElement === document.body || !document.activeElement) {
        window.focus();
      }
    };
    window.addEventListener('pointerdown', handleEnsureWindowFocus);

    return () => {
      window.removeEventListener('keydown', handleArrowNavigation, { capture: true });
      document.removeEventListener('keydown', handleArrowNavigation, { capture: true });
      window.removeEventListener('pointerdown', handleEnsureWindowFocus);
    };
  }, [activeTaskModal, isNewTaskModalOpen]);

  // Close week column selection with Escape key if no modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedWeek !== null && !activeTaskModal && !isNewTaskModalOpen) {
        setSelectedWeek(null);
        setFilterOnlySelectedWeek(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWeek, activeTaskModal, isNewTaskModalOpen]);

  // Active tasks in the selected week across the full project
  const activeTasksInSelectedWeek = tasks.filter((t) => {
    if (selectedWeek === null) return false;
    const validStart = Math.max(1, Math.min(t.startWeek, totalWeeks));
    const targetEnd = t.endWeek && t.endWeek >= validStart ? t.endWeek : validStart + Math.max(1, t.duration) - 1;
    const validEnd = Math.max(validStart, Math.min(targetEnd, totalWeeks));
    return validStart <= selectedWeek && selectedWeek <= validEnd;
  });

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (selectedPhase !== 'all' && task.phaseId !== selectedPhase) return false;
    if (selectedAssignee !== 'all' && task.assignee !== selectedAssignee) return false;
    if (showCriticalOnly && !task.isCritical) return false;
    
    // Optional filter to show only tasks running during selected week
    if (filterOnlySelectedWeek && selectedWeek !== null) {
      const validStart = Math.max(1, Math.min(task.startWeek, totalWeeks));
      const targetEnd = task.endWeek && task.endWeek >= validStart ? task.endWeek : validStart + Math.max(1, task.duration) - 1;
      const validEnd = Math.max(validStart, Math.min(targetEnd, totalWeeks));
      if (!(validStart <= selectedWeek && selectedWeek <= validEnd)) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = task.name.toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      const matchDeliverable = task.deliverable.toLowerCase().includes(q);
      const matchAssignee = task.assignee.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchDeliverable && !matchAssignee) return false;
    }
    return true;
  });

  // Open task detail/edit modal
  const handleOpenTaskModal = (task: Task) => {
    setActiveTaskModal(task);
    setEditedTask({ ...task });
    setIsEditMode(false);
  };

  // Quick toggle critical path for a task with immediate save
  const handleToggleCritical = (taskToToggle: Task) => {
    const newCritical = !taskToToggle.isCritical;
    const updated: Task = {
      ...taskToToggle,
      isCritical: newCritical,
    };
    onUpdateTask(updated);
    setActiveTaskModal(updated);
    if (editedTask && editedTask.id === taskToToggle.id) {
      setEditedTask({ ...editedTask, isCritical: newCritical });
    }
  };

  // Quick update progress percentage with validation and immediate save
  const handleQuickUpdateProgress = (taskToUpdate: Task, newProgress: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(newProgress) ? 0 : Math.round(newProgress)));
    const updated: Task = {
      ...taskToUpdate,
      progress: clamped,
    };
    onUpdateTask(updated);
    setActiveTaskModal(updated);
    if (editedTask && editedTask.id === taskToUpdate.id) {
      setEditedTask({ ...editedTask, progress: clamped });
    }
  };

  // Save edited task
  const handleSaveEditedTask = () => {
    if (editedTask) {
      const computedEndWeek = editedTask.startWeek + editedTask.duration - 1;
      const phase = phases.find(p => p.id === editedTask.phaseId);
      const member = teamMembers.find(m => m.name === editedTask.assignee);
      const updated: Task = {
        ...editedTask,
        progress: Math.max(0, Math.min(100, isNaN(editedTask.progress) ? 0 : Math.round(editedTask.progress))),
        endWeek: computedEndWeek,
        phaseName: phase ? phase.name : editedTask.phaseName,
        assigneeRole: member ? member.role : editedTask.assigneeRole,
      };
      onUpdateTask(updated);
      setActiveTaskModal(updated);
      setIsEditMode(false);
    }
  };

  // Handle adding new phase
  const handleCreateNewPhase = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;

    const theme = getPhaseTheme(newPhaseColor);
    const nextId = phases.length > 0 ? Math.max(...phases.map(p => p.id)) + 1 : 1;
    const newPhase: Phase = {
      id: nextId,
      name: newPhaseName.trim(),
      shortName: `Fase ${nextId}: ${newPhaseName.trim()}`,
      color: theme.colorClass,
      borderColor: theme.mutedBorder,
      badgeBg: theme.badgeBg,
    };

    onAddPhase(newPhase);
    setNewTaskForm(prev => ({ ...prev, phaseId: nextId }));
    if (editedTask) {
      setEditedTask(prev => prev ? { ...prev, phaseId: nextId, phaseName: newPhase.name } : null);
    }
    setNewPhaseName('');
    setShowAddPhaseForm(false);
  };

  // Handle adding new team member
  const handleCreateNewMember = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: TeamMember = {
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Ingeniero de Proyecto',
      avatarColor: 'from-purple-600 to-pink-600',
    };

    onAddTeamMember(newMember);
    setNewTaskForm(prev => ({ ...prev, assignee: newMember.name }));
    if (editedTask) {
      setEditedTask(prev => prev ? { ...prev, assignee: newMember.name, assigneeRole: newMember.role } : null);
    }
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddMemberForm(false);
  };

  // Create new task
  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.name.trim()) return;

    const phase = phases.find(p => p.id === Number(newTaskForm.phaseId));
    const member = teamMembers.find(m => m.name === newTaskForm.assignee);
    const startW = Number(newTaskForm.startWeek);
    const durW = Number(newTaskForm.duration);
    const computedEndWeek = startW + durW - 1;
    
    // Generate next ID like F{phaseId}.{count+1}
    const phaseTasks = tasks.filter(t => t.phaseId === Number(newTaskForm.phaseId));
    const nextSubId = phaseTasks.length + 1;
    const newId = `F${newTaskForm.phaseId}.${nextSubId}`;

    const taskToAdd: Task = {
      id: newId,
      phaseId: Number(newTaskForm.phaseId),
      phaseName: phase ? phase.name : `Fase ${newTaskForm.phaseId}`,
      name: newTaskForm.name.trim(),
      assignee: newTaskForm.assignee,
      assigneeRole: member ? member.role : 'Especialista de Proyecto',
      startWeek: startW,
      duration: durW,
      endWeek: computedEndWeek,
      dependency: newTaskForm.dependency.trim() || '-',
      progress: Number(newTaskForm.progress) || 0,
      deliverable: newTaskForm.deliverable.trim() || 'Entregable pendiente',
      isCritical: newTaskForm.isCritical,
      category: 'automation',
      description: newTaskForm.description.trim() || 'Actividad incorporada en la línea de puesta en servicio.',
    };

    onAddTask(taskToAdd);
    setIsNewTaskModalOpen(false);
    // Reset form
    setNewTaskForm({
      name: '',
      phaseId: phases[0]?.id || 1,
      assignee: teamMembers[0]?.name || 'Pablo',
      startWeek: 1,
      duration: 1,
      endWeek: 1,
      dependency: '-',
      progress: 0,
      deliverable: '',
      isCritical: false,
      description: '',
    });
  };

  // Drag and drop reordering handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedTaskId && draggedTaskId !== id) {
      setDragOverTaskId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const currentIdx = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIdx = tasks.findIndex(t => t.id === targetId);

    if (currentIdx !== -1 && targetIdx !== -1) {
      const updated = [...tasks];
      const [draggedItem] = updated.splice(currentIdx, 1);
      updated.splice(targetIdx, 0, draggedItem);
      onReorderTasks(updated);
    }

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs dark:shadow-xl mb-8 transition-colors duration-200">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Fase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Filtrar por fase del proyecto"
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-rose-500 max-w-[200px] shadow-2xs"
            >
              <option value="all">Todas las fases ({phases.length})</option>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Responsable:</span>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              aria-label="Filtrar por responsable"
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-rose-500 max-w-[200px] shadow-2xs"
            >
              <option value="all">Todos ({teamMembers.length})</option>
              {teamMembers.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Critical Path Toggle */}
          <button
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showCriticalOnly
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 font-semibold shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${showCriticalOnly ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <span>Sólo Ruta Crítica (CPM)</span>
          </button>
        </div>

        {/* Search & Add New Task Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tarea, entregable o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 w-48 sm:w-56 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Button to create a new task */}
          <button
            onClick={() => {
              setIsNewTaskModalOpen(true);
              setShowAddPhaseForm(false);
              setShowAddMemberForm(false);
            }}
            className="px-3.5 py-1 text-xs font-mono font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {phases.slice(0, 7).map((p) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <span className={`w-3 h-2 rounded-xs ${p.color}`}></span> {p.shortName.split(':')[0]}
            </span>
          ))}
          {phases.length > 7 && (
            <span className="text-slate-400 dark:text-slate-500">+{phases.length - 7} fases más</span>
          )}
        </div>
      </div>

      {/* Excel Column Selection Banner */}
      {selectedWeek !== null && (
        <div className="px-4 py-2 bg-blue-50/90 dark:bg-blue-950/60 border-b border-blue-200 dark:border-blue-800 text-xs font-mono text-blue-900 dark:text-blue-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
            <span>
              Columna <strong>Semana S{selectedWeek}</strong> seleccionada:
              {' '}<strong>{activeTasksInSelectedWeek.length}</strong> {activeTasksInSelectedWeek.length === 1 ? 'actividad activa' : 'actividades activas'} en esta semana
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOnlySelectedWeek(!filterOnlySelectedWeek)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${
                filterOnlySelectedWeek
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40'
              }`}
            >
              {filterOnlySelectedWeek ? '✓ Mostrando sólo activas' : `Aislar sólo activas en S${selectedWeek}`}
            </button>
            <button
              onClick={() => { setSelectedWeek(null); setFilterOnlySelectedWeek(false); }}
              className="px-2.5 py-1 rounded-md bg-blue-200/70 hover:bg-blue-200 dark:bg-blue-900/80 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Quitar selección de columna (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              Deseleccionar (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Gantt Interactive Table with Clean Horizontal Scroll & Arrow Key Navigation */}
      <div 
        ref={tableScrollRef}
        tabIndex={0}
        className="gantt-scroll-container overflow-x-auto w-full focus:outline-none rounded-b-xl"
      >
        {(() => {
          const TASK_COL_WIDTH = 400;
          const WEEK_COL_WIDTH = 54;
          const totalTableWidth = TASK_COL_WIDTH + totalWeeks * WEEK_COL_WIDTH;

          return (
            <div style={{ width: `${totalTableWidth}px`, minWidth: `${totalTableWidth}px` }}>
              {/* Header Row: Task Name Column (400px) + totalWeeks Columns */}
              <div 
                className="bg-slate-100/90 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 sticky top-0 z-30 shadow-xs flex items-stretch"
                style={{ width: `${totalTableWidth}px` }}
              >
                <div 
                  className="p-3 font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between sticky left-0 z-40 bg-slate-100 dark:bg-slate-950 shadow-[4px_0_8px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_8px_rgba(0,0,0,0.5)] flex-shrink-0"
                  style={{ width: `${TASK_COL_WIDTH}px` }}
                >
                  <span>Tarea / Actividad ({filteredTasks.length})</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Reordenar · Editar</span>
                </div>

                {/* Dynamic Week Columns from 1 to totalWeeks (Clickable Excel Header) */}
                <div className="flex flex-1">
                  {Array.from({ length: totalWeeks }).map((_, idx) => {
                    const weekNum = idx + 1;
                    const isSelected = selectedWeek === weekNum;
                    
                    return (
                      <button
                        type="button"
                        key={weekNum}
                        onClick={() => setSelectedWeek((prev) => (prev === weekNum ? null : weekNum))}
                        style={{ width: `${WEEK_COL_WIDTH}px` }}
                        title={
                          isSelected 
                            ? `Columna S${weekNum} seleccionada (como en Excel). Clic para deseleccionar.` 
                            : `Clic para seleccionar toda la columna de la Semana S${weekNum} (estilo Excel)`
                        }
                        className={`p-2 text-center border-r border-slate-200 dark:border-slate-800/60 font-semibold relative flex-shrink-0 transition-all cursor-pointer select-none group flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-md ring-2 ring-blue-400 z-30 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300'
                        }`}
                      >
                        <span className="text-xs">S{weekNum}</span>
                        {/* Downward indicator arrow when column is selected like Excel */}
                        {isSelected ? (
                          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-white mt-0.5" />
                        ) : (
                          <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-blue-400 mt-0.5"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Task Rows: Support Drag and Drop & Multi-line wrapping */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 font-mono text-sm">
                    No hay tareas que coincidan con los filtros seleccionados.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const phase = phases.find((p) => p.id === task.phaseId);
                    const phaseTheme = getPhaseTheme(phase?.color);
                    
                    // Precise startWeek and span calculation bounded by totalWeeks
                    const validStart = Math.max(1, Math.min(task.startWeek, totalWeeks));
                    const targetEnd = task.endWeek && task.endWeek >= validStart ? task.endWeek : validStart + Math.max(1, task.duration) - 1;
                    const validEnd = Math.max(validStart, Math.min(targetEnd, totalWeeks));

                    // Pixel-perfect positioning within timeline canvas
                    const barLeft = (validStart - 1) * WEEK_COL_WIDTH + 3;
                    const barWidth = Math.max(16, (validEnd - validStart + 1) * WEEK_COL_WIDTH - 6);

                    const isDragging = draggedTaskId === task.id;
                    const isOver = dragOverTaskId === task.id;

                    const isTaskActiveInSelectedWeek = selectedWeek !== null && validStart <= selectedWeek && selectedWeek <= validEnd;
                    const isDimmed = selectedWeek !== null && !isTaskActiveInSelectedWeek;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={(e) => handleDragOver(e, task.id)}
                        onDrop={(e) => handleDrop(e, task.id)}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-xs relative flex items-stretch ${
                          isDragging ? 'opacity-40 bg-slate-200 dark:bg-slate-800/80' : ''
                        } ${
                          isOver ? 'border-t-2 border-rose-500 bg-rose-50 dark:bg-rose-500/10' : ''
                        } ${
                          isDimmed ? 'opacity-35 hover:opacity-95 transition-opacity duration-200' : ''
                        }`}
                        style={{ width: `${totalTableWidth}px` }}
                      >
                        {/* Left Column: Task Info with Phase Color matching badge and border */}
                        <div 
                          onClick={() => handleOpenTaskModal(task)}
                          className={`p-3 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center min-w-0 pr-3 cursor-pointer group sticky left-0 z-20 shadow-[4px_0_8px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_8px_rgba(0,0,0,0.5)] flex-shrink-0 transition-colors border-l-4 ${phaseTheme.leftBorder} ${
                            isTaskActiveInSelectedWeek
                              ? 'bg-blue-50/90 dark:bg-blue-950/40'
                              : 'bg-white dark:bg-slate-900'
                          }`}
                          style={{ width: `${TASK_COL_WIDTH}px` }}
                        >
                          <div className="flex items-start gap-2">
                            {/* Drag Handle Icon */}
                            <div 
                              className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 p-0.5 mt-0.5 flex-shrink-0"
                              title="Arrastra para cambiar el orden de esta actividad"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>

                            {/* Task ID Badge with Phase-matching color */}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 border ${
                              task.progress > 0 
                                ? `${phaseTheme.badgeActive} shadow-2xs`
                                : `${phaseTheme.badgeBg}`
                            }`}>
                              {task.id}
                            </span>

                            {isTaskActiveInSelectedWeek && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-600 text-white dark:bg-blue-500 flex-shrink-0 mt-0.5 shadow-2xs">
                                Activa S{selectedWeek}
                              </span>
                            )}

                            {/* Title with automatic multi-line wrapping */}
                            <div className="flex-1 min-w-0">
                              <span
                                className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors whitespace-normal break-words leading-snug block"
                                title={task.name}
                              >
                                {task.name}
                              </span>
                            </div>

                            {task.isCritical && (
                              <span
                                title="Tarea en Ruta Crítica (holgura cero)"
                                className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0 mt-1 shadow-xs ring-2 ring-amber-400/40"
                              ></span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2 gap-x-2 gap-y-0.5 pl-5">
                            <span className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${phaseTheme.colorClass}`}></span>
                                <span className={`text-[10px] font-bold ${phaseTheme.textLuminous}`}>{phase?.shortName?.split(':')[0] || `F${task.phaseId}`}</span>
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">·</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{task.assignee}</span>
                              <span className="text-slate-400 dark:text-slate-500">· S{validStart}–S{validEnd}</span>
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 whitespace-normal break-words truncate max-w-[150px]" title={task.deliverable}>
                              {task.deliverable}
                            </span>
                          </div>
                        </div>

                        {/* Timeline Canvas: totalWeeks columns with grid lines */}
                        <div 
                          onClick={() => handleOpenTaskModal(task)}
                          className="relative flex items-center cursor-pointer h-full min-h-[48px] overflow-hidden flex-1"
                          style={{ width: `${totalWeeks * WEEK_COL_WIDTH}px` }}
                        >
                          {/* Vertical week column separators with Excel-style column selection highlight */}
                          <div className="absolute inset-0 flex pointer-events-none">
                            {Array.from({ length: totalWeeks }).map((_, wIdx) => {
                              const weekNum = wIdx + 1;
                              const isColSelected = selectedWeek === weekNum;
                              return (
                                <div
                                  key={wIdx}
                                  style={{ width: `${WEEK_COL_WIDTH}px` }}
                                  className={`h-full border-r border-slate-100 dark:border-slate-800/30 flex-shrink-0 transition-colors ${
                                    isColSelected
                                      ? 'bg-blue-500/20 dark:bg-blue-500/25 border-l-2 border-r-2 border-blue-500 dark:border-blue-400 shadow-[inset_0_0_8px_rgba(59,130,246,0.12)] z-0'
                                      : ''
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {/* Gantt Bar spanning exactly from validStart to validEnd with dynamic gradients */}
                          <div
                            style={{
                              left: `${barLeft}px`,
                              width: `${barWidth}px`,
                            }}
                            className={`absolute top-1/2 -translate-y-1/2 py-1 transition-all ${
                              isTaskActiveInSelectedWeek ? 'z-20 scale-[1.01]' : 'z-10'
                            }`}
                          >
                            <div
                              className={`h-7 rounded-md relative flex items-center overflow-hidden transition-all duration-300 group shadow-xs border ${
                                isTaskActiveInSelectedWeek
                                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/20'
                                  : ''
                              } ${
                                task.isCritical
                                  ? 'border-amber-500 dark:border-amber-400/90 shadow-amber-950/20 ring-1 ring-amber-400/50'
                                  : task.progress === 0
                                  ? phaseTheme.mutedBorder
                                  : phaseTheme.activeBorder
                              } ${
                                task.progress === 0 
                                  ? `${phaseTheme.mutedGradient} opacity-80 hover:opacity-100` 
                                  : `${phaseTheme.mutedGradient}`
                              }`}
                            >
                              {/* Completed portion with luminous vibrant phase gradient */}
                              {task.progress > 0 && (
                                <div
                                  className={`h-full ${phaseTheme.activeGradient} flex items-center justify-start pl-2 transition-all duration-500 relative shadow-xs`}
                                  style={{ width: `${task.progress}%` }}
                                >
                                  {task.progress >= 20 && (
                                    <span className="text-[11px] font-mono font-bold text-white drop-shadow-xs whitespace-nowrap">
                                      {task.progress}%
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Progress text for small progress (1% - 19%) */}
                              {task.progress > 0 && task.progress < 20 && (
                                <span className={`text-[10px] font-mono font-bold ${phaseTheme.textLuminous} pl-1.5 whitespace-nowrap`}>
                                  {task.progress}%
                                </span>
                              )}

                              {/* 0% progress: soft, opaque/dimmed phase-colored text */}
                              {task.progress === 0 && (
                                <span className={`text-[10px] font-mono font-bold ${phaseTheme.textMuted} pl-2 whitespace-nowrap`}>
                                  0%
                                </span>
                              )}

                              {/* Critical task indicator pulse */}
                              {task.isCritical && (
                                <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Task Detail & Edit Modal */}
      {activeTaskModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 transition-colors"
          onClick={() => setActiveTaskModal(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${getPhaseTheme(phases.find(p => p.id === activeTaskModal.phaseId)?.color).badgeBg}`}>
                  {activeTaskModal.id}
                </span>
                <span className={`text-xs font-mono font-bold ${getPhaseTheme(phases.find(p => p.id === activeTaskModal.phaseId)?.color).textLuminous}`}>
                  {phases.find(p => p.id === activeTaskModal.phaseId)?.shortName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Quick Toggle for Critical Path */}
                <button
                  type="button"
                  onClick={() => handleToggleCritical(activeTaskModal)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    activeTaskModal.isCritical
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-2xs hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200'
                  }`}
                  title={activeTaskModal.isCritical ? "Clic para desactivar Ruta Crítica" : "Clic para activar Ruta Crítica"}
                >
                  <AlertCircle className={`w-3.5 h-3.5 ${activeTaskModal.isCritical ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <span>{activeTaskModal.isCritical ? 'Ruta Crítica: ACTIVA' : 'Ruta Crítica: NO'}</span>
                </button>

                {!isEditMode && (
                  <button
                    onClick={() => {
                      setEditedTask({ ...activeTaskModal });
                      setIsEditMode(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer border border-slate-200 dark:border-slate-700"
                    title="Editar campos y reasignar miembros"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar / Reasignar</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTaskModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {isEditMode && editedTask ? (
              /* Edit Mode Form */
              <div className="py-4 space-y-3.5 text-xs font-mono">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Nombre de la Actividad:</label>
                  <input
                    type="text"
                    value={editedTask.name}
                    onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Reassign Team Member */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-600 dark:text-slate-400">Reasignar Responsable:</label>
                      <button
                        type="button"
                        onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                        className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <UserPlus className="w-2.5 h-2.5" /> + Nuevo
                      </button>
                    </div>

                    <select
                      value={editedTask.assignee}
                      onChange={(e) => {
                        const m = teamMembers.find(mem => mem.name === e.target.value);
                        setEditedTask({
                          ...editedTask,
                          assignee: e.target.value,
                          assigneeRole: m ? m.role : editedTask.assigneeRole,
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>

                    {showAddMemberForm && (
                      <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-950/80 rounded border border-purple-300 dark:border-purple-500/40 space-y-1.5">
                        <input
                          type="text"
                          placeholder="Nombre del nuevo miembro"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Rol / Cargo"
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleCreateNewMember}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 rounded text-xs cursor-pointer"
                        >
                          Guardar Miembro
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reassign Project Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-600 dark:text-slate-400">Fase del Proyecto:</label>
                      <button
                        type="button"
                        onClick={() => setShowAddPhaseForm(!showAddPhaseForm)}
                        className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <FolderPlus className="w-2.5 h-2.5" /> + Nueva
                      </button>
                    </div>

                    <select
                      value={editedTask.phaseId}
                      onChange={(e) => {
                        const pid = Number(e.target.value);
                        const p = phases.find(ph => ph.id === pid);
                        setEditedTask({
                          ...editedTask,
                          phaseId: pid,
                          phaseName: p ? p.name : editedTask.phaseName,
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    >
                      {phases.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.shortName}
                        </option>
                      ))}
                    </select>

                    {showAddPhaseForm && (
                      <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-rose-300 dark:border-rose-500/40 space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                          Nueva Fase del Proyecto:
                        </span>
                        <input
                          type="text"
                          placeholder="Nombre de la nueva fase (Ej: Fase 8: Control de Calidad)"
                          value={newPhaseName}
                          onChange={(e) => setNewPhaseName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                        {/* 14 Color Palette Selector with Visual Swatches */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] text-slate-500 dark:text-slate-400">Color de la Fase:</label>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              {PHASE_COLOR_OPTIONS.find(c => c.colorClass === newPhaseColor)?.name || 'Seleccionado'}
                            </span>
                          </div>
                          <div className="grid grid-cols-7 gap-1.5 mb-2 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                            {PHASE_COLOR_OPTIONS.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setNewPhaseColor(c.colorClass)}
                                title={c.name}
                                className={`h-6 rounded-md ${c.colorClass} transition-all cursor-pointer flex items-center justify-center ${
                                  newPhaseColor === c.colorClass 
                                    ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-105 shadow-sm' 
                                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                              >
                                {newPhaseColor === c.colorClass && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></span>
                                )}
                              </button>
                            ))}
                          </div>
                          <select
                            value={newPhaseColor}
                            onChange={(e) => setNewPhaseColor(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                          >
                            {PHASE_COLOR_OPTIONS.map((c) => (
                              <option key={c.id} value={c.colorClass}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={handleCreateNewPhase}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Guardar Fase
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Semana Inicio:</label>
                    <input
                      type="number"
                      min={1}
                      max={totalWeeks}
                      value={editedTask.startWeek}
                      onChange={(e) => setEditedTask({ ...editedTask, startWeek: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Duración (sem):</label>
                    <input
                      type="number"
                      min={1}
                      max={totalWeeks}
                      value={editedTask.duration}
                      onChange={(e) => setEditedTask({ ...editedTask, duration: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-600 dark:text-slate-400">Progreso (%):</label>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{editedTask.progress}%</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editedTask.progress}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setEditedTask({ ...editedTask, progress: Math.max(0, Math.min(100, val)) });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                    />
                  </div>
                </div>

                {/* Edit Mode quick progress slider */}
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Ajuste rápido de porcentaje de avance:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{editedTask.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={editedTask.progress}
                    onChange={(e) => setEditedTask({ ...editedTask, progress: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1">
                      {[0, 25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setEditedTask({ ...editedTask, progress: pct })}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border cursor-pointer ${
                            editedTask.progress === pct
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Entregable Técnico:</label>
                  <input
                    type="text"
                    value={editedTask.deliverable}
                    onChange={(e) => setEditedTask({ ...editedTask, deliverable: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editIsCritical"
                    checked={editedTask.isCritical}
                    onChange={(e) => setEditedTask({ ...editedTask, isCritical: e.target.checked })}
                    className="rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <label htmlFor="editIsCritical" className="text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
                    Marcar como Tarea de Ruta Crítica (CPM - Holgura cero)
                  </label>
                </div>

                {/* Modal Footer with Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar la tarea ${editedTask.id}?`)) {
                        onDeleteTask(editedTask.id);
                        setActiveTaskModal(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Tarea</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditedTask}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="py-4 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeTaskModal.name}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                  {activeTaskModal.description || 'Actividad operativa dentro del plan de puesta en servicio de la línea automatizada de jabones.'}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Responsable Actual:</span>
                    <strong className="text-rose-600 dark:text-rose-400 text-sm">{activeTaskModal.assignee}</strong>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{activeTaskModal.assigneeRole}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Cronograma en Gantt:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">
                      Semana {activeTaskModal.startWeek} a {activeTaskModal.endWeek}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Duración: {activeTaskModal.duration} semana(s)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Dependencia Previa:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{activeTaskModal.dependency || 'Ninguna'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">Ruta Crítica (CPM):</span>
                    <button
                      type="button"
                      onClick={() => handleToggleCritical(activeTaskModal)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer border ${
                        activeTaskModal.isCritical
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-2xs hover:bg-amber-200'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                      title={activeTaskModal.isCritical ? "Clic para desactivar Ruta Crítica" : "Clic para activar Ruta Crítica"}
                    >
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className={`w-3.5 h-3.5 ${activeTaskModal.isCritical ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                        {activeTaskModal.isCritical ? 'Sí (Holgura = 0)' : 'No (Holgura > 0)'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 underline decoration-dotted">
                        {activeTaskModal.isCritical ? 'Desactivar' : 'Activar'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <span className="text-slate-500 block mb-1">Entregable Técnico:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{activeTaskModal.deliverable}</span>
                </div>

                {/* Interactive Progress Controller (Immediate modification) */}
                <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                        Avance de la Actividad:
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        activeTaskModal.progress === 100
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                          : activeTaskModal.progress > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {activeTaskModal.progress === 100 ? '100% Completada' : activeTaskModal.progress === 0 ? '0% Pendiente' : `${activeTaskModal.progress}% En Curso`}
                      </span>
                    </div>

                    {/* Direct numerical input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={activeTaskModal.progress}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          handleQuickUpdateProgress(activeTaskModal, val);
                        }}
                        className="w-16 px-2 py-1 text-right text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 shadow-2xs"
                      />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
                    </div>
                  </div>

                  {/* Interactive Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={activeTaskModal.progress}
                      onChange={(e) => handleQuickUpdateProgress(activeTaskModal, Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons (1 click to modify percentage) */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 mr-1">Rápido:</span>
                      {[0, 25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleQuickUpdateProgress(activeTaskModal, pct)}
                          className={`px-2 py-0.5 text-[11px] font-mono rounded-md border transition-all cursor-pointer font-bold ${
                            activeTaskModal.progress === pct
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateProgress(activeTaskModal, activeTaskModal.progress - 10)}
                        className="px-2 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                        title="Restar 10%"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateProgress(activeTaskModal, activeTaskModal.progress + 10)}
                        className="px-2 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                        title="Sumar 10%"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTask({ ...activeTaskModal });
                      setIsEditMode(true);
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Modificar o Reasignar Miembro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateTask(activeTaskModal);
                      setActiveTaskModal(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35"
                    title="Aplicar cambios y cerrar ventana"
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </span>
                    <span>Aplicar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to Create a New Task */}
      {isNewTaskModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 transition-colors"
          onClick={() => setIsNewTaskModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-rose-500" />
                  <span>Crear Nueva Tarea en el Gantt</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Asigna la nueva actividad a una fase activa o crea una nueva fase / responsable.
                </p>
              </div>

              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="py-4 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Nombre de la Nueva Actividad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Calibración final de dosificadores y sensores..."
                  value={newTaskForm.name}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Select or Add Phase */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 dark:text-slate-300 font-medium">Grupo / Fase del Proyecto *</label>
                    <button
                      type="button"
                      onClick={() => setShowAddPhaseForm(!showAddPhaseForm)}
                      className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <FolderPlus className="w-3 h-3" /> + Nueva Fase
                    </button>
                  </div>

                  <select
                    value={newTaskForm.phaseId}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, phaseId: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.shortName}
                      </option>
                    ))}
                  </select>

                  {/* Inline Create New Phase Box */}
                  {showAddPhaseForm && (
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-rose-300 dark:border-rose-500/40 space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                        Añadir Nueva Fase al Proyecto:
                      </span>
                      <input
                        type="text"
                        placeholder="Nombre de la nueva fase (Ej: Fase 8: Certificación Industrial)"
                        value={newPhaseName}
                        onChange={(e) => setNewPhaseName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                      />

                      {/* 14 Color Palette Selector with Visual Swatches */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-500 dark:text-slate-400">Color de la Fase:</label>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {PHASE_COLOR_OPTIONS.find(c => c.colorClass === newPhaseColor)?.name || 'Seleccionado'}
                          </span>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 mb-2 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          {PHASE_COLOR_OPTIONS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setNewPhaseColor(c.colorClass)}
                              title={c.name}
                              className={`h-6 rounded-md ${c.colorClass} transition-all cursor-pointer flex items-center justify-center ${
                                newPhaseColor === c.colorClass 
                                  ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-105 shadow-sm' 
                                  : 'opacity-80 hover:opacity-100 hover:scale-105'
                              }`}
                            >
                              {newPhaseColor === c.colorClass && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></span>
                              )}
                            </button>
                          ))}
                        </div>
                        <select
                          value={newPhaseColor}
                          onChange={(e) => setNewPhaseColor(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                        >
                          {PHASE_COLOR_OPTIONS.map((c) => (
                            <option key={c.id} value={c.colorClass}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateNewPhase}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Crear Fase
                      </button>
                    </div>
                  )}
                </div>

                {/* Select or Add Team Member */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 dark:text-slate-300 font-medium">Responsable Asignado *</label>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                      className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" /> + Nuevo Miembro
                    </button>
                  </div>

                  <select
                    value={newTaskForm.assignee}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignee: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>

                  {/* Inline Create New Member Box */}
                  {showAddMemberForm && (
                    <div className="mt-2 p-2.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-purple-300 dark:border-purple-500/40 space-y-2">
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">Registrar Nuevo Responsable:</span>
                      <input
                        type="text"
                        placeholder="Nombre completo o alias"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Rol / Especialidad en el proyecto"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleCreateNewMember}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 rounded text-xs transition-colors cursor-pointer"
                      >
                        Añadir Miembro
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Semana Inicio:</label>
                  <input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={newTaskForm.startWeek}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, startWeek: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Duración (sem):</label>
                  <input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={newTaskForm.duration}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, duration: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Avance Inicial (%):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newTaskForm.progress}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, progress: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Entregable Técnico:</label>
                <input
                  type="text"
                  placeholder="Ej: Protocolo de prueba SAT firmado..."
                  value={newTaskForm.deliverable}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, deliverable: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newIsCritical"
                  checked={newTaskForm.isCritical}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, isCritical: e.target.checked })}
                  className="rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-0"
                />
                <label htmlFor="newIsCritical" className="text-slate-700 dark:text-slate-300 font-bold">
                  Marcar como Tarea Crítica (Holgura cero en CPM)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insertar en Gantt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
