import React from 'react';
import { Clock, TrendingUp, AlertTriangle, ListOrdered, Calendar, Flag } from 'lucide-react';
import { Task } from '../types/project';
import { formatDateToDisplay } from '../utils/dateUtils';

interface KpiSummaryProps {
  tasks: Task[];
  totalWeeks: number;
  startDate?: string;
  endDateDisplay?: string;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({ 
  tasks, 
  totalWeeks,
  startDate = '2026-10-05',
  endDateDisplay = '29-03-2027'
}) => {
  // Calculate average progress
  const totalTasks = tasks.length;
  const averageProgress = Math.round(
    tasks.reduce((sum, t) => sum + t.progress, 0) / (totalTasks || 1)
  );

  // Critical tasks count
  const criticalTasksCount = tasks.filter((t) => t.isCritical).length;

  // Completed tasks count
  const completedTasksCount = tasks.filter((t) => t.progress === 100).length;
  const inProgressTasksCount = tasks.filter((t) => t.progress > 0 && t.progress < 100).length;
  const pendingTasksCount = tasks.filter((t) => t.progress === 0).length;

  // Unique assignees count
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Metric 1: Plazo Total del Proyecto con Fecha Fin Dinámica */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            Horizonte &amp; Plazos
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-semibold">
            {totalWeeks} SEMANAS
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalWeeks}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-1.5">semanas</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Fin Estimado</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
              <Flag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {endDateDisplay}
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            Inicio: <strong className="text-slate-700 dark:text-slate-200">{formatDateToDisplay(startDate)}</strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">S1 a S{totalWeeks}</span>
        </div>

        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Metric 2: Progreso Real de Puesta en Servicio */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            Avance Ponderado
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Semana 3 / {totalWeeks}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {averageProgress}%
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            ({completedTasksCount} compl. · {inProgressTasksCount} en proc.)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${averageProgress}%` }}
          ></div>
        </div>

        <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{completedTasksCount} tareas listas</span>
          <span>{pendingTasksCount} pendientes</span>
        </div>
      </div>

      {/* Metric 3: Ruta Crítica (CPM) */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Ruta Crítica (CPM)
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            {criticalTasksCount}
          </span>
          <span className="text-sm font-mono text-slate-500 dark:text-slate-400">tareas prioritarias</span>
        </div>

        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Metric 4: Equipo y Responsables */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-500 dark:text-purple-400" />
            Equipo Asignado
          </span>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-purple-400">
            {totalTasks} actividades
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {uniqueAssignees.length}
          </span>
          <span className="text-sm font-mono text-slate-500 dark:text-slate-400">responsables activos</span>
        </div>

        <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate border-t border-slate-100 dark:border-slate-800/60 pt-2">
          <span className="text-indigo-600 dark:text-purple-300 font-semibold truncate">
            {uniqueAssignees.slice(0, 3).join(', ')}
            {uniqueAssignees.length > 3 ? ` +${uniqueAssignees.length - 3}` : ''}
          </span>
        </div>

        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
};
