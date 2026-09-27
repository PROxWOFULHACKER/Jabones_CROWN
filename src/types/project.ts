export interface Task {
  id: string; // e.g. "F1.1"
  phaseId: number; // 1, 2, ...
  phaseName: string;
  name: string;
  assignee: string; // dynamically extensible to new members
  assigneeRole: string;
  startWeek: number; // 1-indexed
  duration: number; // in weeks
  endWeek: number;
  dependency: string; // e.g. "F1.1" or "-"
  progress: number; // 0 to 100
  deliverable: string;
  isCritical: boolean;
  category: 'legal' | 'engineering' | 'mechanical' | 'electrical' | 'automation' | 'commissioning' | 'documentation';
  description?: string;
  
  // Schedule properties
  optimizedStartWeek?: number;
  optimizedDuration?: number;
  optimizedEndWeek?: number;
  optimizedNotes?: string;
}

export interface Phase {
  id: number;
  name: string;
  shortName: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  startWeekOriginal?: number;
  endWeekOriginal?: number;
  startWeekOptimized?: number;
  endWeekOptimized?: number;
}

export interface TeamMember {
  name: string;
  nickname?: string;
  role: string;
  avatarColor?: string;
  taskCount?: number;
  completedTasks?: number;
}

export interface OptimizationProposal {
  id: string;
  title: string;
  method: 'Fast-Tracking' | 'Concurrencia (Overlap)' | 'Virtual Commissioning' | 'Modular SAT';
  affectedTasks: string[];
  weeksSaved: number;
  description: string;
  technicalDetails: string;
  riskMitigation: string;
  academicJustification: string;
}

export interface SoapLineStation {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  equipment: string;
  automationLevel: string;
  status: 'Completado' | 'En Proceso' | 'Pendiente de SAT' | 'Pendiente de Montaje';
  associatedTasks: string[];
  keySignals: string[];
}
