import React, { useState } from 'react';
import { SOAP_LINE_STATIONS } from '../data/projectData';
import { SoapLineStation } from '../types/project';
import { 
  Flame, 
  Sparkles, 
  Scissors, 
  Wind, 
  Eye, 
  Bot, 
  ArrowRight, 
  Activity, 
  Gauge, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProductionLineViewProps {
  onSelectTaskFilter?: (taskIds: string[]) => void;
}

export const ProductionLineView: React.FC<ProductionLineViewProps> = ({ onSelectTaskFilter }) => {
  const [selectedStation, setSelectedStation] = useState<SoapLineStation>(SOAP_LINE_STATIONS[0]);

  // Icons for stations
  const stationIcons: Record<string, React.ElementType> = {
    'ST-01': Flame,
    'ST-02': Sparkles,
    'ST-03': Scissors,
    'ST-04': Wind,
    'ST-05': Eye,
    'ST-06': Bot,
  };

  // Live simulated values for realistic industrial SCADA feel
  const stationMetrics: Record<string, { label: string; value: string; unit: string; ok: boolean }[]> = {
    'ST-01': [
      { label: 'Temp. Caldera', value: '94.8', unit: '°C', ok: true },
      { label: 'Presión Vapor', value: '3.2', unit: 'bar', ok: true },
      { label: 'Nivel Masa', value: '78.5', unit: '%', ok: true },
      { label: 'pH Saponif.', value: '9.2', unit: 'pH', ok: true },
    ],
    'ST-02': [
      { label: 'Caudal Citronela', value: '12.4', unit: 'L/min', ok: true },
      { label: 'Pigmento Rosa', value: '2.8', unit: 'kg/h', ok: true },
      { label: 'Vel. Batidor', value: '145', unit: 'RPM', ok: true },
      { label: 'Viscosidad', value: '450', unit: 'cP', ok: true },
    ],
    'ST-03': [
      { label: 'Presión Vacío', value: '-0.85', unit: 'bar', ok: true },
      { label: 'Cadencia Corte', value: '180', unit: 'past/min', ok: true },
      { label: 'Vel. Extrusora', value: '14.2', unit: 'm/min', ok: true },
      { label: 'Temp. Boquilla', value: '42.0', unit: '°C', ok: true },
    ],
    'ST-04': [
      { label: 'Temp. Refrigeración', value: '11.8', unit: '°C', ok: true },
      { label: 'Humedad Relativa', value: '41.5', unit: '%', ok: true },
      { label: 'Tiempo Residencia', value: '8.5', unit: 'min', ok: true },
      { label: 'Flujo Aire Seco', value: '3,200', unit: 'm³/h', ok: true },
    ],
    'ST-05': [
      { label: 'Inspección Visión', value: '100', unit: '% pastillas', ok: true },
      { label: 'Tasa Conformidad', value: '99.4', unit: '% OK', ok: true },
      { label: 'Peso Promedio', value: '400.2', unit: 'g (±1.5g)', ok: true },
      { label: 'Descartes Soplado', value: '0.6', unit: '% descarte', ok: true },
    ],
    'ST-06': [
      { label: 'Tiempo Ciclo Robot', value: '1.8', unit: 's / caja', ok: true },
      { label: 'Vacío Garra', value: '-0.78', unit: 'bar', ok: true },
      { label: 'Cajas por Palet', value: '48', unit: 'cajas/pal', ok: true },
      { label: 'Seguridad PROFIsafe', value: 'ACTIVA', unit: 'SIL 3', ok: true },
    ],
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Sinóptico de la Línea Automatizada (Jabón ZOTE)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Arquitectura del proceso de fabricación, instrumentación de campo y estado mecatrónico
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cadencia Nominal: <strong>180 pastillas/min (10,800 past/h)</strong></span>
          </div>
        </div>

        {/* Horizontal Process Flow Pipeline */}
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex items-stretch gap-2 min-w-[920px]">
            {SOAP_LINE_STATIONS.map((station, index) => {
              const Icon = stationIcons[station.id] || Activity;
              const isSelected = selectedStation.id === station.id;

              return (
                <React.Fragment key={station.id}>
                  <div
                    onClick={() => setSelectedStation(station)}
                    className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {station.shortCode}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          Paso {index + 1}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-rose-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold leading-tight">
                          {station.name.split('&')[0]}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 truncate max-w-[90px]">
                        {station.equipment.split(',')[0]}
                      </span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        OK
                      </span>
                    </div>
                  </div>

                  {index < SOAP_LINE_STATIONS.length - 1 && (
                    <div className="flex items-center justify-center text-slate-600 px-0.5">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Station Deep-Dive Inspector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Station Specs & Description */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {selectedStation.shortCode}
              </span>
              <h3 className="text-lg font-bold text-white">
                {selectedStation.name}
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Estado: {selectedStation.status}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedStation.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-slate-400 text-[10px] uppercase block mb-1">
                Equipamiento Físico & Mecánica
              </strong>
              <span className="text-slate-200">{selectedStation.equipment}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-slate-400 text-[10px] uppercase block mb-1">
                Nivel de Automatización & Control
              </strong>
              <span className="text-slate-200">{selectedStation.automationLevel}</span>
            </div>
          </div>

          {/* Key SCADA & PLC Signals */}
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Señales de Campo I/O (Profinet / 4-20mA)
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedStation.keySignals.map((signal, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded font-mono text-xs text-rose-300 flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-rose-400" />
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Gantt Tasks */}
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Tareas vinculadas del Gantt:</span>
            {selectedStation.associatedTasks.map((tId) => (
              <span
                key={tId}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-bold border border-slate-700"
              >
                {tId}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Live Industrial SCADA Telemetry Preview */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-rose-400" />
                Telemetría SCADA en Tiempo Real
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(stationMetrics[selectedStation.id] || []).map((m, idx) => (
                <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block truncate" title={m.label}>
                    {m.label}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white font-mono">{m.value}</span>
                    <span className="text-[10px] font-mono text-slate-400">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Red: Profinet MRP Anillo</span>
            <span className="text-emerald-400">Latencia: &lt; 2ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
