import React, { useState } from 'react';
import { Task } from '../types/project';
import { PHASES } from '../data/projectData';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';

interface TaskMatrixViewProps {
  tasks: Task[];
  isOptimizedMode: boolean;
  onUpdateTaskProgress: (taskId: string, newProgress: number) => void;
}

export const TaskMatrixView: React.FC<TaskMatrixViewProps> = ({
  tasks,
  isOptimizedMode,
  onUpdateTaskProgress,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'id' | 'startWeek' | 'duration' | 'progress'>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedPhase !== 'all' && t.phaseId !== selectedPhase) return false;
    if (selectedAssignee !== 'all' && t.assignee !== selectedAssignee) return false;
    if (selectedStatus === 'completed' && t.progress !== 100) return false;
    if (selectedStatus === 'in_progress' && (t.progress === 0 || t.progress === 100)) return false;
    if (selectedStatus === 'pending' && t.progress !== 0) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.deliverable.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'id') {
      comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
    } else if (sortField === 'startWeek') {
      const aW = isOptimizedMode && a.optimizedStartWeek ? a.optimizedStartWeek : a.startWeek;
      const bW = isOptimizedMode && b.optimizedStartWeek ? b.optimizedStartWeek : b.startWeek;
      comparison = aW - bW;
    } else if (sortField === 'duration') {
      const aD = isOptimizedMode && a.optimizedDuration ? a.optimizedDuration : a.duration;
      const bD = isOptimizedMode && b.optimizedDuration ? b.optimizedDuration : b.duration;
      comparison = aD - bD;
    } else if (sortField === 'progress') {
      comparison = a.progress - b.progress;
    }
    return sortAsc ? comparison : -comparison;
  });

  const handleSort = (field: 'id' | 'startWeek' | 'duration' | 'progress') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Fase',
      'Tarea',
      'Responsable',
      'Semana Inicio',
      'Duracion (Semanas)',
      'Semana Fin',
      'Dependencia',
      'Progreso (%)',
      'Entregable Clave',
      'Ruta Critica',
    ];

    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.phaseName}"`,
      `"${t.name}"`,
      `"${t.assignee}"`,
      isOptimizedMode && t.optimizedStartWeek ? t.optimizedStartWeek : t.startWeek,
      isOptimizedMode && t.optimizedDuration ? t.optimizedDuration : t.duration,
      isOptimizedMode && t.optimizedEndWeek ? t.optimizedEndWeek : t.endWeek,
      `"${t.dependency}"`,
      `${t.progress}%`,
      `"${t.deliverable}"`,
      t.isCritical ? 'SI' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Pablo_and_Co_Jabon_ZOTE_Gantt_${isOptimizedMode ? 'Optimizado' : 'Original'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl mb-8">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Fase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Filtrar matriz por fase"
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="all">Todas las Fases (1–7)</option>
              {PHASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Responsable:</span>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              aria-label="Filtrar matriz por responsable"
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="all">Todos los miembros</option>
              <option value="Pablo">Pablo</option>
              <option value="Iván García">Iván García</option>
              <option value="Freddy">Freddy</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filtrar matriz por estado de avance"
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completada (100%)</option>
              <option value="in_progress">En Progreso (1–99%)</option>
              <option value="pending">Pendiente (0%)</option>
            </select>
          </div>
        </div>

        {/* Search & Export Action */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en la tabla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 w-48 sm:w-56"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 select-none">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Fase / Etapa</th>
              <th className="py-3 px-3">Tarea / Actividad</th>
              <th className="py-3 px-3">Responsable</th>
              <th
                onClick={() => handleSort('startWeek')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Inicio</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('duration')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Duración</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-2 text-center">Fin</th>
              <th className="py-3 px-2 text-center">Dep.</th>
              <th
                onClick={() => handleSort('progress')}
                className="py-3 px-3 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Estado / Progreso</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Entregable / Hito Clave</th>
              <th className="py-3 px-2 text-center">CPM</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500 font-mono">
                  No se encontraron tareas con los filtros actuales.
                </td>
              </tr>
            ) : (
              sortedTasks.map((t) => {
                const phase = PHASES.find((p) => p.id === t.phaseId);
                const startW = isOptimizedMode && t.optimizedStartWeek ? t.optimizedStartWeek : t.startWeek;
                const durW = isOptimizedMode && t.optimizedDuration ? t.optimizedDuration : t.duration;
                const endW = isOptimizedMode && t.optimizedEndWeek ? t.optimizedEndWeek : t.endWeek;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-rose-400">
                      {t.id}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${phase?.badgeBg || 'bg-slate-800 text-slate-400'}`}>
                        {phase?.shortName || t.phaseName}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      <span className="text-xs font-semibold">{t.name}</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-300">{t.assignee}</span>
                    </td>

                    <td className="py-2.5 px-2 text-center font-bold text-slate-200">
                      S{startW}
                    </td>

                    <td className="py-2.5 px-2 text-center text-slate-400">
                      {durW} {durW === 1 ? 'sem' : 'sem'}
                    </td>

                    <td className="py-2.5 px-2 text-center text-slate-400">
                      S{endW}
                    </td>

                    <td className="py-2.5 px-2 text-center text-slate-400">
                      {t.dependency}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${
                          t.progress === 100 
                            ? 'text-emerald-400' 
                            : t.progress > 0 
                            ? 'text-blue-400' 
                            : 'text-slate-500'
                        }`}>
                          {t.progress}%
                        </span>
                        
                        {/* Quick toggle progress in demo */}
                        <button
                          onClick={() => {
                            const next = t.progress === 100 ? 0 : t.progress === 50 ? 100 : t.progress === 25 ? 50 : 25;
                            onUpdateTaskProgress(t.id, next);
                          }}
                          title="Clic para avanzar progreso en la demostración"
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-200 font-medium">
                      {t.deliverable}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      {t.isCritical ? (
                        <span
                          title="Ruta Crítica (Holgura = 0)"
                          className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"
                        ></span>
                      ) : (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
