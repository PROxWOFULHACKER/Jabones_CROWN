import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  TrendingDown, 
  ShieldAlert, 
  GraduationCap, 
  ArrowRight,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { OPTIMIZATION_PROPOSALS, PROJECT_METADATA, PHASES } from '../data/projectData';

interface OptimizationsViewProps {
  isOptimizedMode: boolean;
  onToggleOptimized: () => void;
}

export const OptimizationsView: React.FC<OptimizationsViewProps> = ({
  isOptimizedMode,
  onToggleOptimized,
}) => {
  // State for toggling individual optimization proposals in interactive simulator
  const [activeOptIds, setActiveOptIds] = useState<string[]>([
    'OPT-1',
    'OPT-2',
    'OPT-3',
    'OPT-4',
  ]);

  const toggleOptimization = (id: string) => {
    if (activeOptIds.includes(id)) {
      setActiveOptIds(activeOptIds.filter((item) => item !== id));
    } else {
      setActiveOptIds([...activeOptIds, id]);
    }
  };

  // Calculate dynamic weeks saved based on active proposals
  const currentSavings = activeOptIds.reduce((sum, id) => {
    const prop = OPTIMIZATION_PROPOSALS.find((p) => p.id === id);
    return sum + (prop ? prop.weeksSaved : 0);
  }, 0);

  const simulatedTotalWeeks = PROJECT_METADATA.totalWeeksOriginal - currentSavings;

  return (
    <div className="space-y-8 mb-8">
      {/* SECTION 1: Extracción de Plazos Clave del Diagrama de Gantt */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Extracción de Plazos Clave y Cronología Oficial
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Análisis cuantitativo de los plazos del PDF de Pablo & Co para la línea de Jabón ZOTE
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 px-2">Inicio: <strong className="text-slate-200">05-10-2026</strong></span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-400 px-2">Fin Original: <strong className="text-rose-400">29-03-2027</strong></span>
          </div>
        </div>

        {/* Phase Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                FASE 1 (4 sem)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Sem 1–4</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">Legalización & Compras</h4>
            <ul className="mt-2 space-y-1 text-[11px] text-slate-400 font-sans">
              <li>· <strong className="text-slate-300">Sem 1:</strong> Kick-off y Aprobación de Presupuesto.</li>
              <li>· <strong className="text-slate-300">Sem 2:</strong> Pliego Técnico (Freddy) y Licencias (Pablo).</li>
              <li>· <strong className="text-slate-300">Sem 3–4:</strong> Adjudicación de Compras (Iván).</li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                FASE 2 (3 sem)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Sem 5–7</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">Ingeniería CAD & ePLAN</h4>
            <ul className="mt-2 space-y-1 text-[11px] text-slate-400 font-sans">
              <li>· <strong className="text-slate-300">Sem 5–6:</strong> Planos ePLAN trifásicos y Layout CAD 3D.</li>
              <li>· <strong className="text-slate-300">Sem 6:</strong> Matriz causa-efecto SIL (Iván).</li>
              <li>· <strong className="text-slate-300">Sem 7:</strong> Plan de Seguridad Directiva CE (Freddy).</li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                FASES 3 & 4 (7 sem)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Sem 8–14</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">Montaje Mecánico & Eléctrico</h4>
            <ul className="mt-2 space-y-1 text-[11px] text-slate-400 font-sans">
              <li>· <strong className="text-slate-300">Sem 8–9:</strong> Obra civil y bancadas (Pablo).</li>
              <li>· <strong className="text-slate-300">Sem 10–12:</strong> Tolvas, extrusora, túnel y robots.</li>
              <li>· <strong className="text-slate-300">Sem 12–14:</strong> Canalizaciones, armarios y sensores.</li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                FASES 5, 6 & 7 (10 sem)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Sem 15–24</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">Automatización, SAT & CE</h4>
            <ul className="mt-2 space-y-1 text-[11px] text-slate-400 font-sans">
              <li>· <strong className="text-slate-300">Sem 15–18:</strong> Profinet, PLC, SCADA y FAT taller.</li>
              <li>· <strong className="text-slate-300">Sem 19–22:</strong> SAT en frío, vacío, seguridad y químico.</li>
              <li>· <strong className="text-slate-300">Sem 23–24:</strong> Formación, manuales y Marcado CE.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: Simulador Interactivo de Reducción de Plazos */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/30 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Simulador Dinámico de Optimización de Tiempos
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Integración Automática
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Activa o desactiva las 4 técnicas de aceleración mecatrónica para evaluar el impacto en el cronograma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeOptIds.length === 4) {
                  setActiveOptIds([]);
                } else {
                  setActiveOptIds(['OPT-1', 'OPT-2', 'OPT-3', 'OPT-4']);
                }
              }}
              className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {activeOptIds.length === 4 ? 'Desactivar todas' : 'Activar las 4 propuestas'}
            </button>

            <button
              onClick={onToggleOptimized}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                isOptimizedMode
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Aplicar al Gantt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Simulation KPI Banner */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Duración Simulada</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">
                {simulatedTotalWeeks}
              </span>
              <span className="text-xs font-mono text-slate-400">semanas</span>
              <span className="text-xs font-mono text-slate-500 line-through">24 sem</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Ahorro de Tiempo Total</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-emerald-400">
                -{currentSavings}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                semanas ({Math.round((currentSavings / 24) * 100)}% reducción)
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Nueva Fecha de Entrega CE</span>
            <div className="mt-1">
              <span className="text-lg font-bold text-rose-300 font-mono block">
                {currentSavings >= 5
                  ? '22 Febrero 2027'
                  : currentSavings > 0
                  ? `Mediados de Marzo 2027 (-${currentSavings}w)`
                  : '29 Marzo 2027'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {currentSavings > 0 ? 'Adelanto sustancial para pruebas piloto' : 'Sin optimización activa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Detalle de las 4 Propuestas de Optimización */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Propuestas de Optimización Justificadas Técnicamente</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              (Para la asignatura de Integración de Sistemas)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIMIZATION_PROPOSALS.map((opt, index) => {
            const isActive = activeOptIds.includes(opt.id);

            return (
              <div
                key={opt.id}
                className={`bg-slate-900/90 border rounded-xl p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : 'border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        {opt.id}
                      </span>
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {opt.method}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleOptimization(opt.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title={isActive ? 'Desactivar esta optimización' : 'Activar esta optimización'}
                    >
                      {isActive ? (
                        <ToggleRight className="w-7 h-7 text-rose-500" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-600" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2.5 leading-snug">
                    {opt.title}
                  </h4>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Ahorro: -{opt.weeksSaved} {opt.weeksSaved === 1 ? 'semana' : 'semanas'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Tareas: {opt.affectedTasks.join(', ')}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
                    {opt.description}
                  </p>

                  <div className="mt-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-[11px] space-y-2">
                    <div>
                      <strong className="text-slate-200 font-mono block">Mecanismo Técnico:</strong>
                      <span className="text-slate-400">{opt.technicalDetails}</span>
                    </div>
                    <div>
                      <strong className="text-amber-300 font-mono block flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        Mitigación de Riesgos:
                      </strong>
                      <span className="text-slate-400">{opt.riskMitigation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-mono text-rose-400">
                  <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="italic">{opt.academicJustification}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Resumen de Ganancias y Cuadro Comparativo */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
          Tabla Comparativa: Cronograma Base vs. Optimizado
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Hito / Fase</th>
                <th className="py-2 px-3">Semana Base (Original)</th>
                <th className="py-2 px-3 text-emerald-400">Semana Optimizada</th>
                <th className="py-2 px-3">Ganancia / Delta</th>
                <th className="py-2 px-3">Palanca de Mejora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Cierre de Compras Críticas (F1.5)</td>
                <td className="py-2.5 px-3">Semana 4</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Semana 3</td>
                <td className="py-2.5 px-3 text-emerald-400">-1 semana</td>
                <td className="py-2.5 px-3 text-slate-400">Fast-tracking de equipos de largo plazo</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Inicio Obra Civil y Cimentación (F3.1)</td>
                <td className="py-2.5 px-3">Semana 8</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Semana 6</td>
                <td className="py-2.5 px-3 text-emerald-400">-2 semanas</td>
                <td className="py-2.5 px-3 text-slate-400">Eliminación de holgura muerta post-CAD</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Tendido Eléctrico y Canalizaciones (F4.1)</td>
                <td className="py-2.5 px-3">Semana 12</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Semana 9</td>
                <td className="py-2.5 px-3 text-emerald-400">-3 semanas</td>
                <td className="py-2.5 px-3 text-slate-400">Solapamiento con tolvas y perfilería</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Pruebas FAT Armarios & Software (F5.5)</td>
                <td className="py-2.5 px-3">Semana 18</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Semana 14</td>
                <td className="py-2.5 px-3 text-emerald-400">-4 semanas</td>
                <td className="py-2.5 px-3 text-slate-400">Comisionamiento Virtual (Digital Twin)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Puesta en Marcha Quimica / Ramp-up (F6.4)</td>
                <td className="py-2.5 px-3">Semana 21</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Semana 17</td>
                <td className="py-2.5 px-3 text-emerald-400">-4 semanas</td>
                <td className="py-2.5 px-3 text-slate-400">SAT modular por subsistemas</td>
              </tr>
              <tr className="bg-rose-500/10 font-bold">
                <td className="py-2.5 px-3 text-white">Marcado CE y Entrega al Cliente (F7.3)</td>
                <td className="py-2.5 px-3 text-slate-300">Semana 24 (29-03-27)</td>
                <td className="py-2.5 px-3 text-emerald-400">Semana 19 (22-02-27)</td>
                <td className="py-2.5 px-3 text-emerald-400">-5 semanas (-20.8%)</td>
                <td className="py-2.5 px-3 text-rose-300 font-sans text-[11px]">Dossier y formación en paralelo al ramp-up</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
