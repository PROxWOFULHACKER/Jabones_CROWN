import React, { useState, useEffect } from 'react';
import { LogoZote } from './LogoZote';
import { PROJECT_METADATA } from '../data/projectData';
import { formatDateToDisplay, formatDateToInput } from '../utils/dateUtils';
import { Calendar, Plus, Minus, Edit2, Check, Flag, X, Sun, Moon, Cloud, Save } from 'lucide-react';

interface HeaderProps {
  totalWeeks: number;
  onUpdateTotalWeeks: (weeks: number) => void;
  startDate: string;
  onUpdateStartDate: (newStartDate: string) => void;
  endDateDisplay: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSyncModal?: () => void;
  isSaving?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalWeeks,
  onUpdateTotalWeeks,
  startDate,
  onUpdateStartDate,
  endDateDisplay,
  theme,
  onToggleTheme,
  onOpenSyncModal,
  isSaving,
}) => {
  // State for editing horizon (weeks)
  const [isEditingHorizon, setIsEditingHorizon] = useState(false);
  const [horizonInput, setHorizonInput] = useState(totalWeeks.toString());

  // State for editing start date
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [startDateInput, setStartDateInput] = useState(formatDateToInput(startDate));

  // Keep internal states in sync with props
  useEffect(() => {
    setHorizonInput(totalWeeks.toString());
  }, [totalWeeks]);

  useEffect(() => {
    setStartDateInput(formatDateToInput(startDate));
  }, [startDate]);

  // Apply horizon change
  const handleApplyHorizon = () => {
    const val = parseInt(horizonInput, 10);
    if (!isNaN(val) && val >= 4 && val <= 52) {
      onUpdateTotalWeeks(val);
    } else {
      setHorizonInput(totalWeeks.toString());
    }
    setIsEditingHorizon(false);
  };

  // Increment or decrement horizon
  const handleIncrementHorizon = (delta: number) => {
    const newVal = Math.max(4, Math.min(52, totalWeeks + delta));
    onUpdateTotalWeeks(newVal);
    setHorizonInput(newVal.toString());
  };

  // Apply start date change
  const handleApplyStartDate = () => {
    if (startDateInput) {
      onUpdateStartDate(startDateInput);
    }
    setIsEditingStartDate(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      {/* Top micro status bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/40 px-4 py-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-800 dark:text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SISTEMA ACTIVO
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Asignatura: <strong className="text-slate-800 dark:text-slate-200">{PROJECT_METADATA.academicSubject}</strong></span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Empresa: <strong className="text-rose-600 dark:text-rose-300">{PROJECT_METADATA.company}</strong></span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px]">
          <span>Gerencia: <strong className="text-slate-700 dark:text-slate-300">{PROJECT_METADATA.management}</strong></span>
          <span>Operaciones: <strong className="text-slate-700 dark:text-slate-300">{PROJECT_METADATA.operationsHead}</strong></span>
          <span>Soporte: <strong className="text-slate-700 dark:text-slate-300">{PROJECT_METADATA.techSupport}</strong></span>
        </div>
      </div>

      {/* Main bar: Logo on top left alongside company name, Project Timeline Boxes & Theme Switch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and company identity (Top left: logo next to company name) */}
        <div className="flex items-center gap-3">
          <LogoZote size="md" />
        </div>

        {/* Right side: Project Timeline Control Panel + Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Recuadro 1: Fecha de Inicio (Modificable) */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/90 p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 leading-none">Inicio</span>
              {isEditingStartDate ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="date"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleApplyStartDate();
                      if (e.key === 'Escape') setIsEditingStartDate(false);
                    }}
                    autoFocus
                    className="bg-white dark:bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={handleApplyStartDate}
                    title="Guardar fecha de inicio"
                    className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsEditingStartDate(false)}
                    title="Cancelar"
                    className="p-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setStartDateInput(formatDateToInput(startDate));
                    setIsEditingStartDate(true);
                  }}
                  title="Clic para modificar la fecha de inicio del proyecto"
                  className="group flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  <strong className="text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 text-xs font-bold font-mono">
                    {formatDateToDisplay(startDate)}
                  </strong>
                  <Edit2 className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500" />
                </button>
              )}
            </div>
          </div>

          {/* Recuadro 2: Horizonte de Semanas (Modificable) */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/90 p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 leading-none">Horizonte</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isEditingHorizon ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={4}
                      max={52}
                      value={horizonInput}
                      onChange={(e) => setHorizonInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyHorizon();
                        if (e.key === 'Escape') {
                          setHorizonInput(totalWeeks.toString());
                          setIsEditingHorizon(false);
                        }
                      }}
                      autoFocus
                      className="w-14 bg-white dark:bg-slate-950 border border-rose-500 rounded px-1.5 py-0.5 text-xs font-bold text-slate-900 dark:text-white font-mono text-center focus:outline-none"
                    />
                    <button
                      onClick={handleApplyHorizon}
                      title="Aplicar semanas"
                      className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleIncrementHorizon(-1)}
                      disabled={totalWeeks <= 4}
                      title="Disminuir 1 semana"
                      className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>

                    <div
                      onClick={() => {
                        setHorizonInput(totalWeeks.toString());
                        setIsEditingHorizon(true);
                      }}
                      title="Clic para escribir semanas personalizadas"
                      className="cursor-pointer group flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-rose-500 transition-colors shadow-2xs"
                    >
                      <strong className="text-slate-900 dark:text-white text-xs font-bold font-mono">
                        {totalWeeks}
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">sem</span>
                      <Edit2 className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-500" />
                    </div>

                    <button
                      onClick={() => handleIncrementHorizon(1)}
                      disabled={totalWeeks >= 52}
                      title="Aumentar 1 semana"
                      className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recuadro 3: Fecha de Fin del Proyecto (Se actualiza dinámicamente con el horizonte y fecha inicio) */}
          <div className="flex items-center gap-2 bg-emerald-50/70 dark:bg-emerald-950/20 p-1.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 shadow-xs">
            <Flag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Fin Proyecto</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                  Auto
                </span>
              </div>
              <strong className="text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono mt-0.5 flex items-center gap-1" title="Esta fecha se calcula automáticamente sumando el número de semanas a la fecha de inicio">
                {endDateDisplay}
              </strong>
            </div>
          </div>

          {/* Sync / Save in Code Button */}
          {onOpenSyncModal && (
            <button
              type="button"
              onClick={onOpenSyncModal}
              title="Sincronización compartida en vivo y exportación del código fuente"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 transition-all shadow-2xs cursor-pointer text-xs font-mono font-bold active:scale-95"
            >
              <Cloud className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isSaving ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">Guardar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* Theme Toggle Button (On/Off Switch with Sun & Moon) */}
          <div className="pl-1">
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Tema activo: Oscuro · Clic para encender tema Claro' : 'Tema activo: Claro · Clic para encender tema Oscuro'}
              aria-label="Alternar tema claro y oscuro"
              className="flex items-center gap-1 p-1 rounded-xl border transition-all duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200/80 border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 shadow-2xs"
            >
              {/* Sun indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white text-amber-600 shadow-xs border border-amber-200 font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}>
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
                <span className="text-[11px] font-mono leading-none">Claro</span>
              </div>

              {/* Moon indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-300 shadow-xs border border-indigo-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}>
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : ''}`} />
                <span className="text-[11px] font-mono leading-none">Oscuro</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
