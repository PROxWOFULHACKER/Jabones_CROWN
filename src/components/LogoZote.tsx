import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X } from 'lucide-react';

interface LogoZoteProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const LogoZote: React.FC<LogoZoteProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const sizeMap = {
    sm: { img: 'h-9 w-auto', text: 'text-base', sub: 'text-[10px]' },
    md: { img: 'h-13 w-auto', text: 'text-xl', sub: 'text-xs' },
    lg: { img: 'h-16 w-auto', text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <>
      <div className={`flex items-center gap-3.5 select-none ${className}`}>
        {/* Official Jabón ZOTE Company Logo Image (Clickable to Expand for Classroom Presentation) */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative flex-shrink-0 group cursor-pointer"
          title="Clic sobre el logo para ampliarlo en pantalla completa y presentarlo en clase"
        >
          <img
            src="/logo-zote.svg"
            alt="Logo Jabón ZOTE"
            className={`${currentSize.img} object-contain rounded-md shadow-md border border-slate-700/60 bg-[#fdfbf1] p-0.5 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:border-rose-500/60`}
          />
          {/* Subtle zoom indicator overlay on hover */}
          <div className="absolute inset-0 bg-slate-950/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[0.5px]">
            <ZoomIn className="w-4 h-4 drop-shadow-md" />
          </div>
        </div>

        {/* Company Name & Operational Unit */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${currentSize.text} leading-none`}>
              Pablo &amp; Co.
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 rounded">
              Jabón ZOTE
            </span>
          </div>
          {showSubtitle && (
            <span className={`${currentSize.sub} font-mono text-slate-500 dark:text-slate-400 tracking-tight flex items-center gap-1.5 mt-1`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Línea Automatizada · Puesta en Servicio
            </span>
          )}
        </div>
      </div>

      {/* Lightbox Modal: ONLY the enlarged image, centered, with no text */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md cursor-pointer select-none"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Discreet close button in top right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/90 text-white/90 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-white/20 z-20 shadow-2xl"
            title="Cerrar imagen (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Centered Image Container with NO text whatsoever */}
          <div 
            className="relative flex items-center justify-center max-w-3xl w-full cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src="/logo-zote.svg" 
              alt="Logo Jabón ZOTE" 
              width={1024}
              height={768}
              className="w-full h-auto max-h-[82vh] object-contain rounded-2xl shadow-2xl drop-shadow-2xl border border-slate-700/60 bg-[#fefdf5]"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

