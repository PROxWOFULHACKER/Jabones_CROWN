import React, { useState } from 'react';
import { 
  GraduationCap, 
  Presentation, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Copy,
  Printer,
  Users,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { PROJECT_METADATA } from '../data/projectData';

export const PresentationMode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const slides = [
    {
      step: 1,
      title: '1. Introducción & Alcance del Proyecto',
      subtitle: 'Compañía Pablo & Co · Línea Automatizada de Jabones ZOTE',
      badge: 'Contexto Académico',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            El presente proyecto aborda la planificación integral, ingeniería y puesta en marcha de una línea de producción continua de jabón tradicional para la compañía ficticia <strong>Pablo & Co</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Capacidad Nominal</span>
              <strong className="text-white text-sm">180 pastillas/min</strong>
              <span className="text-slate-400 block text-[10px]">10.800 unidades/hora</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Horizonte Temporal</span>
              <strong className="text-rose-400 text-sm">24 semanas (Original)</strong>
              <span className="text-slate-400 block text-[10px]">05 Octubre 2026 – 29 Marzo 2027</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Grado de Automatización</span>
              <strong className="text-emerald-400 text-sm">Nivel 3 ISA-95</strong>
              <span className="text-slate-400 block text-[10px]">PLC S7-1500 + SCADA + Robots</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <strong className="text-slate-200 block mb-1">Reparto Operativo del Equipo:</strong>
            <ul className="space-y-1 text-slate-400">
              <li>· <strong className="text-slate-200">Pablo ("Líder Supremo"):</strong> Gerencia, layout CAD, SCADA central y acta de recepción final.</li>
              <li>· <strong className="text-slate-200">Iván García ("Jefe de Operaciones"):</strong> Presupuesto, compras, instrumentación, PLC y pruebas FAT.</li>
              <li>· <strong className="text-slate-200">Fredd_CROWN ("Ingeniería y Soporte"):</strong> Pliego técnico, esquemas ePLAN, seguridad CE, robots y SAT.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: '2. Arquitectura de las 7 Fases de Integración',
      subtitle: 'Secuencia estándar en Integración de Sistemas Automáticos',
      badge: 'Metodología Técnica',
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-blue-400 font-bold block">Fase 1: Viabilidad & Compras (Sem 1–4)</span>
              <span className="text-slate-400 text-[11px]">Kick-off, pliego técnico y pedidos de maquinaria química y robótica.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-indigo-400 font-bold block">Fase 2: Ingeniería de Detalle (Sem 5–7)</span>
              <span className="text-slate-400 text-[11px]">Planos ePLAN, layout 3D en CAD, matrices causa-efecto SIL y seguridad CE.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-amber-400 font-bold block">Fase 3: Montaje Mecánico (Sem 8–12)</span>
              <span className="text-slate-400 text-[11px]">Bancadas antivibratorias, tolvas, mezcladoras, extrusora, túnel y robots.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-yellow-400 font-bold block">Fase 4: Eléctrica & Instrumentación (Sem 12–14)</span>
              <span className="text-slate-400 text-[11px]">Canalizaciones, cableado de armarios PLC/CCM, sensores de nivel y setas.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-emerald-400 font-bold block">Fase 5: Automatización & SCADA (Sem 15–18)</span>
              <span className="text-slate-400 text-[11px]">Redes Profinet, programación TIA Portal, teach-in robot y pruebas FAT.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
              <span className="text-rose-400 font-bold block">Fase 6: SAT & Validación en Planta (Sem 19–22)</span>
              <span className="text-slate-400 text-[11px]">I/O check en frío, ensayos en vacío, pruebas de seguridad y saponificación piloto.</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg sm:col-span-2">
              <span className="text-teal-400 font-bold block">Fase 7: Formación Técnica & Marcado CE (Sem 23–24)</span>
              <span className="text-slate-400 text-[11px]">Capacitación de operadores, manuales as-built y Declaración de Conformidad CE.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: '3. Diagnóstico de Cuellos de Botella en el Plan Base',
      subtitle: 'Por qué el cronograma original de 24 semanas es subóptimo',
      badge: 'Análisis Crítico',
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <span>Cuello de Botella 1: Holgura muerta entre F2 y F3</span>
            </div>
            <p className="text-slate-300 text-[11px] font-sans">
              El layout CAD finaliza en Semana 6, pero la obra civil de la nave no arranca hasta la Semana 8. Existe una semana vacía sin justificación técnica de secado o fraguado.
            </p>
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <span>Cuello de Botella 2: Dependencias estrictamente en cascada (Waterfall)</span>
            </div>
            <p className="text-slate-300 text-[11px] font-sans">
              El tendido eléctrico (F4.1) espera hasta la Semana 12 a pesar de que los planos ePLAN están listos desde la Semana 6. La programación del PLC se demora hasta que el armario físico está completamente montado.
            </p>
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <span>Cuello de Botella 3: SAT secuencial de 4 semanas en planta</span>
            </div>
            <p className="text-slate-300 text-[11px] font-sans">
              El I/O check, los ensayos en vacío y las pruebas con jabón caliente se realizan celda por celda de forma secuencial, prolongando innecesariamente la estancia del equipo técnico en campo.
            </p>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      title: '4. Estrategia de Optimización Mecatrónica (-5 Semanas)',
      subtitle: 'Reducción de 24 a 19 semanas (-20.8%) sin aumentar costes ni riesgos',
      badge: 'Solución de Ingeniería',
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <strong className="text-emerald-300 block mb-1">1. Fast-Tracking en Compras (-1 sem)</strong>
              <span className="text-slate-300 text-[11px] font-sans">
                Emisión de órdenes de compra preliminares con especificaciones congeladas en Semana 2 para robots y PLC.
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <strong className="text-emerald-300 block mb-1">2. Concurrencia Obra / Mecánica (-2 sem)</strong>
              <span className="text-slate-300 text-[11px] font-sans">
                Arranque de obra civil en Semana 6 inmediatamente tras validar el layout CAD, y tendido de bandejas en Semana 9.
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <strong className="text-emerald-300 block mb-1">3. Virtual Commissioning / Digital Twin (-1 sem)</strong>
              <span className="text-slate-300 text-[11px] font-sans">
                Simulación del código PLC y cinemática de robots en software 3D antes de llegar al taller, reduciendo el FAT a la mitad.
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <strong className="text-emerald-300 block mb-1">4. SAT Modular & Formación Concurrente (-1 sem)</strong>
              <span className="text-slate-300 text-[11px] font-sans">
                Pruebas escalonadas por zonas (saponificación, corte, empaque) y redacción de manuales as-built en paralelo al ramp-up.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">Resultado Final Obtenido:</span>
            <span className="text-lg font-bold text-white">
              Entrega adelantada del 29 de Marzo de 2027 al <strong className="text-emerald-400">22 de Febrero de 2027</strong>
            </span>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: '5. Conclusiones para la Clase de Integración',
      subtitle: 'Principales lecciones aprendidas aplicables a la industria real',
      badge: 'Defensa Académica',
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">La Ruta Crítica determina la supervivencia del proyecto:</strong>
              <span className="text-slate-400 text-[11px] font-sans">
                En una línea automatizada de jabones, cualquier retraso en el layout CAD o en el anclaje de tolvas retrasa directamente el Marcado CE.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">El Gemelo Digital (Digital Twin) no es opcional:</strong>
              <span className="text-slate-400 text-[11px] font-sans">
                Depurar la cinemática de robots y la lógica de seguridad SIL en simulación previa al montaje ahorra semanas de costosa depuración en planta química.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Arquitectura 100% Frontend y Portable:</strong>
              <span className="text-slate-400 text-[11px] font-sans">
                Esta aplicación corre íntegramente en el navegador web (React SPA + Tailwind), permitiendo desplegar la demostración en Netlify o en cualquier equipo sin configurar bases de datos o servidores backend.
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlideData = slides[currentSlide - 1];

  // Speech script generator for the student
  const speechScript = `Buenas tardes profesor y compañeros. Presento el Plan de Puesta en Servicio de la Línea Automatizada de Jabón ZOTE para la empresa Pablo & Co.
El cronograma original extraído del pliego técnico contempla 24 semanas de duración, comenzando el 5 de octubre de 2026 y finalizando el 29 de marzo de 2027.
Tras analizar detalladamente la ruta crítica mediante el método CPM, identificamos 11 tareas críticas y varios cuellos de botella: holgura muerta entre el diseño CAD y la obra civil, compras de largo plazo no anticipadas, y pruebas SAT estrictamente secuenciales.
Nuestra propuesta de optimización mecatrónica combina 4 técnicas:
1) Fast-tracking en la compra de robots y PLC (-1 semana).
2) Eliminación de holguras y concurrencia de gremios en montaje mecánico y canalizaciones (-2 semanas).
3) Comisionamiento virtual con gemelo digital antes de las pruebas FAT (-1 semana).
4) SAT modular por celdas y elaboración de manuales as-built en paralelo al ramp-up de saponificación (-1 semana).
Como resultado, reducimos el plazo de 24 a 19 semanas, logrando un ahorro neto del 20.8% (más de un mes), adelantando la entrega y marcado CE al 22 de febrero de 2027.
La aplicación desarrollada es 100% frontend y se ejecuta en Netlify sin requerir backend. Muchas gracias.`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(speechScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Slide Presentation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
        {/* Slide Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Presentation className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {currentSlideData.title}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                  {currentSlideData.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentSlideData.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Diapositiva {currentSlide} de {slides.length}</span>
          </div>
        </div>

        {/* Slide Body */}
        <div className="py-6 min-h-[300px]">
          {currentSlideData.content}
        </div>

        {/* Slide Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
            disabled={currentSlide === 1}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentSlide(s.step)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === s.step ? 'bg-rose-500 w-6' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Ir a diapositiva ${s.step}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))}
            disabled={currentSlide === slides.length}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Defense Speech & Talking Points Box */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Guión de Exposición para la Clase (Defensa Oral ante el Profesor)
            </h3>
          </div>

          <button
            onClick={copyScriptToClipboard}
            className="px-3 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-rose-400" />
            <span>{copiedScript ? '¡Copiado al Portapapeles!' : 'Copiar Guión Completo'}</span>
          </button>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {speechScript}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span>Tiempo estimado de exposición: <strong>2 a 3 minutos</strong></span>
          <span className="text-emerald-400">Totalmente optimizado para demostración en vivo</span>
        </div>
      </div>
    </div>
  );
};
