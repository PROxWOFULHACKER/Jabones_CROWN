import { Task, Phase, TeamMember } from '../types/project';
import { INITIAL_TASKS, PHASES, TEAM_MEMBERS, PROJECT_METADATA } from '../data/projectData';

export interface SavedProjectState {
  tasks: Task[];
  phases: Phase[];
  teamMembers: TeamMember[];
  totalWeeks: number;
  startDate: string;
  sectionTitle: string;
  lastUpdated: string;
  updatedBy?: string;
}

const LOCAL_STORAGE_KEY = 'zote_project_saved_state_v1';

/**
 * Encodes the project state into a compact URL string so it can be shared
 * across any static host (Netlify, GitHub Pages, Vercel) without requiring a backend database.
 */
export function generateShareableLink(state: SavedProjectState): string {
  try {
    const compact = {
      t: state.tasks.map(task => ({
        id: task.id,
        name: task.name,
        phaseId: task.phaseId,
        startWeek: task.startWeek,
        duration: task.duration,
        assignee: task.assignee,
        progress: task.progress,
        isCritical: task.isCritical,
        dependency: task.dependency,
      })),
      w: state.totalWeeks,
      s: state.startDate,
      title: state.sectionTitle,
    };
    const json = JSON.stringify(compact);
    // Base64 encode safe for URL
    const b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
    const url = new URL(window.location.href);
    url.searchParams.set('cronograma', b64);
    return url.toString();
  } catch (err) {
    console.error('Failed to generate shareable link:', err);
    return window.location.href;
  }
}

/**
 * Loads state from the URL query parameter if present.
 */
export function loadStateFromUrl(): SavedProjectState | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('cronograma');
    if (!encoded) return null;

    const json = decodeURIComponent(
      Array.prototype.map.call(atob(encoded), (c: string) => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    const parsed = JSON.parse(json);
    if (!parsed || !Array.isArray(parsed.t)) return null;

    // Expand compact representation
    const fullTasks: Task[] = parsed.t.map((item: any) => {
      const orig = INITIAL_TASKS.find(x => x.id === item.id);
      const phase = PHASES.find(p => p.id === (item.phaseId || (orig ? orig.phaseId : 1)));
      const startW = item.startWeek || (orig ? orig.startWeek : 1);
      const dur = item.duration || (orig ? orig.duration : 2);
      return {
        id: item.id,
        name: item.name || (orig ? orig.name : item.id),
        phaseId: item.phaseId || (orig ? orig.phaseId : 1),
        phaseName: phase ? phase.name : (orig ? orig.phaseName : 'Fase'),
        assignee: item.assignee || (orig ? orig.assignee : 'Equipo'),
        assigneeRole: orig ? orig.assigneeRole : 'Ingeniería',
        startWeek: startW,
        duration: dur,
        endWeek: startW + dur - 1,
        dependency: item.dependency || (orig ? orig.dependency : '-'),
        progress: item.progress ?? 0,
        isCritical: item.isCritical ?? false,
        category: orig ? orig.category : 'engineering',
        deliverable: orig ? orig.deliverable : '',
        description: orig ? orig.description : '',
      };
    });

    return {
      tasks: fullTasks,
      phases: PHASES,
      teamMembers: TEAM_MEMBERS,
      totalWeeks: parsed.w || 24,
      startDate: parsed.s || '2026-10-05',
      sectionTitle: parsed.title || 'Cronograma de Puesta en Servicio',
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Could not parse state from URL:', err);
    return null;
  }
}

/**
 * Loads shared project data from URL, server, or localStorage.
 */
export async function loadSharedProjectData(): Promise<SavedProjectState> {
  // 1. Try URL parameters first (allows sharing exact schedule link to professor on Netlify/Vercel)
  const fromUrl = loadStateFromUrl();
  if (fromUrl) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // ignore
    }
    return fromUrl;
  }

  // 2. Try server endpoint (shared between all teammates & professor if deployed on Node.js / Render / Cloud Run)
  try {
    const res = await fetch('/api/project-data', { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.found && json.data) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
        } catch {
          // ignore
        }
        return json.data as SavedProjectState;
      }
    }
  } catch (err) {
    console.warn('Could not connect to /api/project-data, attempting local fallback:', err);
  }

  // 3. Try localStorage fallback
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.tasks)) {
        return parsed as SavedProjectState;
      }
    }
  } catch {
    // ignore
  }

  // 4. Fallback to initial seed data
  return {
    tasks: INITIAL_TASKS,
    phases: PHASES,
    teamMembers: TEAM_MEMBERS,
    totalWeeks: PROJECT_METADATA.totalWeeksOriginal || 24,
    startDate: '2026-10-05',
    sectionTitle: 'Cronograma de Puesta en Servicio',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Saves project data to the server endpoint and localStorage.
 */
export async function saveSharedProjectData(state: Omit<SavedProjectState, 'lastUpdated'>): Promise<boolean> {
  const fullState: SavedProjectState = {
    ...state,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Save to localStorage immediately
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fullState));
  } catch (e) {
    console.warn('Failed saving to localStorage', e);
  }

  // 2. Save to server file
  try {
    const res = await fetch('/api/project-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullState),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not post to /api/project-data:', err);
    return false;
  }
}

/**
 * Generates and downloads the updated TypeScript code file (projectData.ts)
 * so the user or teammates can commit or replace it in their local codebase.
 */
export function downloadUpdatedProjectCode(state: SavedProjectState) {
  const fileContent = `/**
 * PROYECTO: Automatización de la Línea de Producción de Jabón ZOTE
 * Archivo exportado con los cambios realizados en línea por el equipo
 * Fecha de última actualización: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}
 */

import { Task, Phase, TeamMember, ProjectMetadata } from '../types/project';

export const PROJECT_METADATA: ProjectMetadata = {
  name: "Automatización de la Línea de Producción de Jabón ZOTE",
  company: "Fábrica La Corona",
  totalWeeksOriginal: ${state.totalWeeks},
  currentWeek: 1,
  totalBudget: 450000,
  currency: "USD",
  targetEfficiencyIncrease: "40%",
  qualityTarget: "99.8%",
  reductionDowntime: "35%",
};

export const TEAM_MEMBERS: TeamMember[] = ${JSON.stringify(state.teamMembers, null, 2)};

export const PHASES: Phase[] = ${JSON.stringify(state.phases, null, 2)};

export const INITIAL_TASKS: Task[] = ${JSON.stringify(state.tasks, null, 2)};
`;

  const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'projectData.ts';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads the JSON backup file
 */
export function downloadUpdatedProjectJson(state: SavedProjectState) {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cronograma-zote-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
