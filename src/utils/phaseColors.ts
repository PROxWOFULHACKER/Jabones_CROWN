export interface PhaseColorOption {
  id: string;
  name: string;
  colorClass: string;
  hex: string;
  activeGradient: string;
  mutedGradient: string;
  mutedBorder: string;
  activeBorder: string;
  leftBorder: string;
  badgeBg: string;
  badgeActive: string;
  textMuted: string;
  textLuminous: string;
}

export const PHASE_COLOR_OPTIONS: PhaseColorOption[] = [
  {
    id: 'bg-blue-500',
    name: 'Azul Zafiro',
    colorClass: 'bg-blue-500',
    hex: '#3b82f6',
    activeGradient: 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400',
    mutedGradient: 'bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-blue-500/5 dark:from-blue-500/30 dark:via-blue-900/20 dark:to-blue-950/30',
    mutedBorder: 'border-blue-400/40 dark:border-blue-600/40',
    activeBorder: 'border-blue-500/80 dark:border-blue-400/80',
    leftBorder: 'border-l-blue-500',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40',
    badgeActive: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400/50',
    textMuted: 'text-blue-600/80 dark:text-blue-300/80',
    textLuminous: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'bg-indigo-500',
    name: 'Índigo Profundo',
    colorClass: 'bg-indigo-500',
    hex: '#6366f1',
    activeGradient: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-400',
    mutedGradient: 'bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/30 dark:via-indigo-900/20 dark:to-indigo-950/30',
    mutedBorder: 'border-indigo-400/40 dark:border-indigo-600/40',
    activeBorder: 'border-indigo-500/80 dark:border-indigo-400/80',
    leftBorder: 'border-l-indigo-500',
    badgeBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-400/40',
    badgeActive: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400/50',
    textMuted: 'text-indigo-600/80 dark:text-indigo-300/80',
    textLuminous: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'bg-cyan-500',
    name: 'Cian Tecnológico',
    colorClass: 'bg-cyan-500',
    hex: '#06b6d4',
    activeGradient: 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-400',
    mutedGradient: 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-cyan-500/5 dark:from-cyan-500/30 dark:via-cyan-900/20 dark:to-cyan-950/30',
    mutedBorder: 'border-cyan-400/40 dark:border-cyan-600/40',
    activeBorder: 'border-cyan-500/80 dark:border-cyan-400/80',
    leftBorder: 'border-l-cyan-500',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/40',
    badgeActive: 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-cyan-400/50',
    textMuted: 'text-cyan-600/80 dark:text-cyan-300/80',
    textLuminous: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'bg-teal-500',
    name: 'Turquesa Menta',
    colorClass: 'bg-teal-500',
    hex: '#14b8a6',
    activeGradient: 'bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400',
    mutedGradient: 'bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-teal-500/5 dark:from-teal-500/30 dark:via-teal-900/20 dark:to-teal-950/30',
    mutedBorder: 'border-teal-400/40 dark:border-teal-600/40',
    activeBorder: 'border-teal-500/80 dark:border-teal-400/80',
    leftBorder: 'border-l-teal-500',
    badgeBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-400/40',
    badgeActive: 'bg-gradient-to-r from-teal-600 to-teal-500 text-white border-teal-400/50',
    textMuted: 'text-teal-600/80 dark:text-teal-300/80',
    textLuminous: 'text-teal-600 dark:text-teal-400',
  },
  {
    id: 'bg-emerald-500',
    name: 'Verde Esmeralda',
    colorClass: 'bg-emerald-500',
    hex: '#10b981',
    activeGradient: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400',
    mutedGradient: 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/30 dark:via-emerald-900/20 dark:to-emerald-950/30',
    mutedBorder: 'border-emerald-400/40 dark:border-emerald-600/40',
    activeBorder: 'border-emerald-500/80 dark:border-emerald-400/80',
    leftBorder: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
    badgeActive: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400/50',
    textMuted: 'text-emerald-600/80 dark:text-emerald-300/80',
    textLuminous: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'bg-lime-500',
    name: 'Verde Lima',
    colorClass: 'bg-lime-500',
    hex: '#84cc16',
    activeGradient: 'bg-gradient-to-r from-lime-600 via-lime-500 to-emerald-400',
    mutedGradient: 'bg-gradient-to-r from-lime-500/20 via-lime-500/10 to-lime-500/5 dark:from-lime-500/30 dark:via-lime-900/20 dark:to-lime-950/30',
    mutedBorder: 'border-lime-400/40 dark:border-lime-600/40',
    activeBorder: 'border-lime-500/80 dark:border-lime-400/80',
    leftBorder: 'border-l-lime-500',
    badgeBg: 'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-400/40',
    badgeActive: 'bg-gradient-to-r from-lime-600 to-lime-500 text-white border-lime-400/50',
    textMuted: 'text-lime-600/80 dark:text-lime-300/80',
    textLuminous: 'text-lime-600 dark:text-lime-400',
  },
  {
    id: 'bg-amber-500',
    name: 'Ámbar Dorado',
    colorClass: 'bg-amber-500',
    hex: '#f59e0b',
    activeGradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400',
    mutedGradient: 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/5 dark:from-amber-500/30 dark:via-amber-900/20 dark:to-amber-950/30',
    mutedBorder: 'border-amber-400/40 dark:border-amber-600/40',
    activeBorder: 'border-amber-500/80 dark:border-amber-400/80',
    leftBorder: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
    badgeActive: 'bg-gradient-to-r from-amber-600 to-amber-500 text-white border-amber-400/50',
    textMuted: 'text-amber-600/80 dark:text-amber-300/80',
    textLuminous: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'bg-yellow-500',
    name: 'Amarillo Canario',
    colorClass: 'bg-yellow-500',
    hex: '#eab308',
    activeGradient: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-300 text-slate-900',
    mutedGradient: 'bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/5 dark:from-yellow-500/30 dark:via-yellow-900/20 dark:to-yellow-950/30',
    mutedBorder: 'border-yellow-400/40 dark:border-yellow-600/40',
    activeBorder: 'border-yellow-500/80 dark:border-yellow-400/80',
    leftBorder: 'border-l-yellow-500',
    badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-400/40',
    badgeActive: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 font-bold border-yellow-400/50',
    textMuted: 'text-yellow-700/80 dark:text-yellow-300/80',
    textLuminous: 'text-yellow-700 dark:text-yellow-400',
  },
  {
    id: 'bg-orange-500',
    name: 'Naranja Intenso',
    colorClass: 'bg-orange-500',
    hex: '#f97316',
    activeGradient: 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400',
    mutedGradient: 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-orange-500/5 dark:from-orange-500/30 dark:via-orange-900/20 dark:to-orange-950/30',
    mutedBorder: 'border-orange-400/40 dark:border-orange-600/40',
    activeBorder: 'border-orange-500/80 dark:border-orange-400/80',
    leftBorder: 'border-l-orange-500',
    badgeBg: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-400/40',
    badgeActive: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border-orange-400/50',
    textMuted: 'text-orange-600/80 dark:text-orange-300/80',
    textLuminous: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 'bg-red-500',
    name: 'Rojo Industrial',
    colorClass: 'bg-red-500',
    hex: '#ef4444',
    activeGradient: 'bg-gradient-to-r from-red-600 via-red-500 to-rose-400',
    mutedGradient: 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/5 dark:from-red-500/30 dark:via-red-900/20 dark:to-red-950/30',
    mutedBorder: 'border-red-400/40 dark:border-red-600/40',
    activeBorder: 'border-red-500/80 dark:border-red-400/80',
    leftBorder: 'border-l-red-500',
    badgeBg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-400/40',
    badgeActive: 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-400/50',
    textMuted: 'text-red-600/80 dark:text-red-300/80',
    textLuminous: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'bg-rose-500',
    name: 'Rosa ZOTE Corporativo',
    colorClass: 'bg-rose-500',
    hex: '#f43f5e',
    activeGradient: 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400',
    mutedGradient: 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-rose-500/5 dark:from-rose-500/30 dark:via-rose-900/20 dark:to-rose-950/30',
    mutedBorder: 'border-rose-400/40 dark:border-rose-600/40',
    activeBorder: 'border-rose-500/80 dark:border-rose-400/80',
    leftBorder: 'border-l-rose-500',
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40',
    badgeActive: 'bg-gradient-to-r from-rose-600 to-rose-500 text-white border-rose-400/50',
    textMuted: 'text-rose-600/80 dark:text-rose-300/80',
    textLuminous: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'bg-pink-500',
    name: 'Fucsia Magenta',
    colorClass: 'bg-pink-500',
    hex: '#ec4899',
    activeGradient: 'bg-gradient-to-r from-pink-600 via-pink-500 to-rose-400',
    mutedGradient: 'bg-gradient-to-r from-pink-500/20 via-pink-500/10 to-pink-500/5 dark:from-pink-500/30 dark:via-pink-900/20 dark:to-pink-950/30',
    mutedBorder: 'border-pink-400/40 dark:border-pink-600/40',
    activeBorder: 'border-pink-500/80 dark:border-pink-400/80',
    leftBorder: 'border-l-pink-500',
    badgeBg: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-400/40',
    badgeActive: 'bg-gradient-to-r from-pink-600 to-pink-500 text-white border-pink-400/50',
    textMuted: 'text-pink-600/80 dark:text-pink-300/80',
    textLuminous: 'text-pink-600 dark:text-pink-400',
  },
  {
    id: 'bg-purple-500',
    name: 'Púrpura Vibrante',
    colorClass: 'bg-purple-500',
    hex: '#a855f7',
    activeGradient: 'bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-400',
    mutedGradient: 'bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/5 dark:from-purple-500/30 dark:via-purple-900/20 dark:to-purple-950/30',
    mutedBorder: 'border-purple-400/40 dark:border-purple-600/40',
    activeBorder: 'border-purple-500/80 dark:border-purple-400/80',
    leftBorder: 'border-l-purple-500',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/40',
    badgeActive: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400/50',
    textMuted: 'text-purple-600/80 dark:text-purple-300/80',
    textLuminous: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'bg-violet-600',
    name: 'Violeta Eléctrico',
    colorClass: 'bg-violet-600',
    hex: '#7c3aed',
    activeGradient: 'bg-gradient-to-r from-violet-700 via-violet-600 to-purple-400',
    mutedGradient: 'bg-gradient-to-r from-violet-500/20 via-violet-500/10 to-violet-500/5 dark:from-violet-500/30 dark:via-violet-900/20 dark:to-violet-950/30',
    mutedBorder: 'border-violet-400/40 dark:border-violet-600/40',
    activeBorder: 'border-violet-500/80 dark:border-violet-400/80',
    leftBorder: 'border-l-violet-600',
    badgeBg: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-400/40',
    badgeActive: 'bg-gradient-to-r from-violet-700 to-violet-600 text-white border-violet-400/50',
    textMuted: 'text-violet-600/80 dark:text-violet-300/80',
    textLuminous: 'text-violet-600 dark:text-violet-400',
  },
];

/**
 * Helper to get the full color theme based on any phase's color class
 */
export function getPhaseTheme(colorClass?: string): PhaseColorOption {
  if (!colorClass) return PHASE_COLOR_OPTIONS[0];

  const found = PHASE_COLOR_OPTIONS.find(opt => 
    opt.colorClass === colorClass || 
    opt.id === colorClass ||
    colorClass.includes(opt.id.replace('bg-', ''))
  );

  if (found) return found;

  // Keyword-based fallback
  const c = colorClass.toLowerCase();
  if (c.includes('blue')) return PHASE_COLOR_OPTIONS[0];
  if (c.includes('indigo')) return PHASE_COLOR_OPTIONS[1];
  if (c.includes('cyan')) return PHASE_COLOR_OPTIONS[2];
  if (c.includes('teal')) return PHASE_COLOR_OPTIONS[3];
  if (c.includes('emerald') || c.includes('green')) return PHASE_COLOR_OPTIONS[4];
  if (c.includes('lime')) return PHASE_COLOR_OPTIONS[5];
  if (c.includes('amber')) return PHASE_COLOR_OPTIONS[6];
  if (c.includes('yellow')) return PHASE_COLOR_OPTIONS[7];
  if (c.includes('orange')) return PHASE_COLOR_OPTIONS[8];
  if (c.includes('red')) return PHASE_COLOR_OPTIONS[9];
  if (c.includes('rose')) return PHASE_COLOR_OPTIONS[10];
  if (c.includes('pink')) return PHASE_COLOR_OPTIONS[11];
  if (c.includes('purple')) return PHASE_COLOR_OPTIONS[12];
  if (c.includes('violet')) return PHASE_COLOR_OPTIONS[13];

  return PHASE_COLOR_OPTIONS[0];
}
