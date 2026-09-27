import React, { useState, useEffect, useRef } from 'react';

interface FactoryPixelIntroProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
}

export const FactoryPixelIntro: React.FC<FactoryPixelIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Iniciando entorno de gestión...');
  const [isExiting, setIsExiting] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const statusMessages = [
    'Conectando con la base de datos de producción...',
    'Inicializando parámetros de la Línea Jabón ZOTE...',
    'Calculando holguras y ruta crítica (CPM)...',
    'Cargando cronograma maestro y horizonte de semanas...',
    'Sincronizando actividades de ingeniería y automatización...',
    'Verificando asignaciones y entregables del equipo...',
    'Entorno preparado. Entrando al cronograma...',
  ];

  // Random duration between 7 and 10 seconds
  useEffect(() => {
    const randomSec = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
    setTotalSeconds(randomSec);
    const duration = randomSec * 1000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      const messageIndex = Math.min(
        statusMessages.length - 1,
        Math.floor((currentPct / 100) * statusMessages.length)
      );
      setStatusText(statusMessages[messageIndex]);
      setProgress(currentPct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setStatusText(statusMessages[statusMessages.length - 1]);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 350);
        }, 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Handle skip via Escape / Space / Enter
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        setIsExiting(true);
        setTimeout(onComplete, 150);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  // Canvas particle animation with app's color palette (Rose / Coral / Indigo / White)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle palette matching the app
    const palette = [
      '#f43f5e', // rose-500 (ZOTE pink)
      '#fb7185', // rose-400
      '#fda4af', // rose-300
      '#6366f1', // indigo-500
      '#38bdf8', // sky-400
      '#ffffff', // white
    ];

    const particleCount = 45;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const maxOp = Math.random() * 0.6 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * maxOp,
        maxOpacity: maxOp,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset if goes off top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = p.radius > 2.5 ? 10 : 0;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none transition-opacity duration-350 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      {/* Subtle radial ambient glow behind the loading card */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-3xl -top-20 -left-20 pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onComplete, 150);
        }}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium transition-all cursor-pointer z-50 flex items-center gap-2 shadow-lg backdrop-blur-xs active:scale-95 group"
        title="Saltar animación de carga (Espacio / Esc)"
      >
        <span className="group-hover:text-white transition-colors">Saltar</span>
        <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
          ESC
        </span>
      </button>

      {/* Central Clean Loading Box */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
          <span className="text-xs font-mono font-semibold tracking-wider text-rose-300 uppercase">
            Fábrica La Corona · Línea ZOTE
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
          Automatización de Línea de Producción
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-8">
          Cronograma de Puesta en Servicio · Sistema de Gestión
        </p>

        {/* Clean Progress Bar Container */}
        <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          {/* Progress Header: Status text & Percentage */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-medium truncate pr-2 text-left flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="font-mono font-extrabold text-rose-400 text-sm shrink-0">
              {progress}%
            </span>
          </div>

          {/* Simple, Elegant Loading Bar */}
          <div className="w-full h-3 bg-slate-950/90 border border-slate-800 rounded-full p-0.5 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400 rounded-full transition-all duration-100 ease-out relative shadow-[0_0_12px_rgba(244,63,94,0.4)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light sweep animation */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>

          {/* Sub-details */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Ruta Crítica (CPM)</span>
            <span className="text-slate-400">{totalSeconds}s · Carga en progreso</span>
          </div>
        </div>

      </div>
    </div>
  );
};
