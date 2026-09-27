import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { GanttChart } from './components/GanttChart';
import { FactoryPixelIntro } from './components/FactoryPixelIntro';
import { SyncShareModal } from './components/SyncShareModal';
import { INITIAL_TASKS, PHASES, TEAM_MEMBERS, PROJECT_METADATA } from './data/projectData';
import { Task, Phase, TeamMember } from './types/project';
import { calculateEndDate } from './utils/dateUtils';
import { loadSharedProjectData, saveSharedProjectData, SavedProjectState } from './utils/projectPersistence';
import { RotateCcw, Edit2, Check, X } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [phases, setPhases] = useState<Phase[]>(PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [totalWeeks, setTotalWeeks] = useState<number>(PROJECT_METADATA.totalWeeksOriginal || 24);
  const [startDate, setStartDate] = useState<string>('2026-10-05');

  // Theme Management (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [sectionTitle, setSectionTitle] = useState<string>('Cronograma de Puesta en Servicio');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>(sectionTitle);

  // Persistence & Shared state management
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const isInitialMount = useRef<boolean>(true);

  // Load shared project data on initial mount from server/localStorage
  useEffect(() => {
    loadSharedProjectData().then((saved) => {
      if (saved && saved.tasks && saved.tasks.length > 0) {
        setTasks(saved.tasks);
        if (saved.phases) setPhases(saved.phases);
        if (saved.teamMembers) setTeamMembers(saved.teamMembers);
        if (saved.totalWeeks) setTotalWeeks(saved.totalWeeks);
        if (saved.startDate) setStartDate(saved.startDate);
        if (saved.sectionTitle) {
          setSectionTitle(saved.sectionTitle);
          setTempTitle(saved.sectionTitle);
        }
        setLastSavedTime(saved.lastUpdated);
      }
    });
  }, []);

  // Auto-save changes to the server/file so teammates and professor see updates
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setIsSaving(true);
    const timer = setTimeout(async () => {
      const ok = await saveSharedProjectData({
        tasks,
        phases,
        teamMembers,
        totalWeeks,
        startDate,
        sectionTitle,
      });
      setIsSaving(false);
      if (ok) {
        setLastSavedTime(new Date().toISOString());
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [tasks, phases, teamMembers, totalWeeks, startDate, sectionTitle]);

  const handleManualSave = async () => {
    setIsSaving(true);
    const ok = await saveSharedProjectData({
      tasks,
      phases,
      teamMembers,
      totalWeeks,
      startDate,
      sectionTitle,
    });
    setIsSaving(false);
    if (ok) {
      setLastSavedTime(new Date().toISOString());
    }
    return ok;
  };

  // Requirement 3: Dynamically calculated End Date updated when totalWeeks or startDate changes
  const computedEndDate = calculateEndDate(startDate, totalWeeks);

  // Save editable title
  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setSectionTitle(tempTitle.trim());
    } else {
      setTempTitle(sectionTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTempTitle(sectionTitle);
    setIsEditingTitle(false);
  };

  // Update an existing task (progress, reassignment, phase, etc.)
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Add a newly created task
  const handleAddTask = (newTask: Omit<Task, 'id'> & { id?: string }) => {
    const finalId = newTask.id || `F${newTask.phaseId}.${tasks.filter(t => t.phaseId === newTask.phaseId).length + 1}`;
    const taskWithId: Task = {
      ...newTask,
      id: finalId,
    };
    setTasks((prev) => [...prev, taskWithId]);
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Reorder tasks via Drag and Drop
  const handleReorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  // Add a new project phase / section
  const handleAddPhase = (newPhase: Phase) => {
    setPhases((prev) => [...prev, newPhase]);
  };

  // Add a new team member / assignee
  const handleAddTeamMember = (newMember: TeamMember) => {
    setTeamMembers((prev) => {
      if (prev.some(m => m.name.toLowerCase() === newMember.name.toLowerCase())) {
        return prev;
      }
      return [...prev, newMember];
    });
  };

  // Reset to original data
  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setPhases(PHASES);
    setTeamMembers(TEAM_MEMBERS);
    setTotalWeeks(24);
    setStartDate('2026-10-05');
    setSectionTitle('Cronograma de Puesta en Servicio');
    setTempTitle('Cronograma de Puesta en Servicio');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Factory Pixel Art Intro Animation (Random 7-10s) */}
      {showIntro && (
        <FactoryPixelIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Header with official Jabón ZOTE Logo, Editable Start Date, Horizon, Dynamic End Date, Sync & Sun/Moon Switch */}
      <Header
        totalWeeks={totalWeeks}
        onUpdateTotalWeeks={(weeks) => setTotalWeeks(weeks)}
        startDate={startDate}
        onUpdateStartDate={(date) => setStartDate(date)}
        endDateDisplay={computedEndDate.displayStr}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isSaving={isSaving}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Global KPI Summary Strip with dynamic horizon and end date */}
        <KpiSummary 
          tasks={tasks} 
          totalWeeks={totalWeeks}
          startDate={startDate}
          endDateDisplay={computedEndDate.displayStr}
        />

        {/* Main Section: Gantt & Cronograma */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {/* Requirement 2: Editable Section Title */}
            <div className="flex-1 min-w-[280px]">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 max-w-xl">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelTitle();
                    }}
                    autoFocus
                    className="flex-1 bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-lg px-3 py-1.5 text-base font-extrabold text-slate-900 dark:text-white focus:outline-none shadow-sm"
                    placeholder="Título del cronograma..."
                  />
                  <button
                    onClick={handleSaveTitle}
                    title="Guardar título"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1 text-xs cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={handleCancelTitle}
                    title="Cancelar"
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="group flex items-center gap-2.5">
                  <h2 
                    onClick={() => {
                      setTempTitle(sectionTitle);
                      setIsEditingTitle(true);
                    }}
                    title="Haz clic para editar este título"
                    className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 cursor-pointer hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                  >
                    <span>{sectionTitle}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTempTitle(sectionTitle);
                        setIsEditingTitle(true);
                      }}
                      title="Editar título de la sección"
                      className="p-1 rounded bg-slate-100 dark:bg-slate-900 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-rose-600 dark:text-slate-400 dark:group-hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h2>

                  <span className="text-xs font-mono px-2 py-0.5 rounded border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-semibold">
                    {tasks.length} ACTIVIDADES · {totalWeeks} SEMANAS
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetData}
                title="Restablecer actividades, fechas y avances originales del PDF"
                className="px-2.5 py-1 text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar Valores</span>
              </button>
            </div>
          </div>

          <GanttChart
            tasks={tasks}
            phases={phases}
            teamMembers={teamMembers}
            totalWeeks={totalWeeks}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
            onAddPhase={handleAddPhase}
            onAddTeamMember={handleAddTeamMember}
          />
        </div>
      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 text-xs font-mono text-slate-500 py-6 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-700 dark:text-slate-400 font-bold uppercase">
              Pablo &amp; Co. Jabón ZOTE Automation
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Clase: {PROJECT_METADATA.academicSubject}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold tracking-wide border border-slate-300/80 dark:border-slate-700/80 opacity-85 hover:opacity-100 shadow-2xs backdrop-blur-xs transition-all">
              Developed by <strong className="text-rose-600 dark:text-rose-400 font-extrabold">Los CHUCHES_Soft</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Sync and Share Modal */}
      <SyncShareModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentState={{
          tasks,
          phases,
          teamMembers,
          totalWeeks,
          startDate,
          sectionTitle,
          lastUpdated: lastSavedTime || new Date().toISOString(),
        }}
        onManualSave={handleManualSave}
        onResetToDefaults={handleResetData}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
      />
    </div>
  );
}
