export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  company: string;
  city: string;
  progress: number;
  totalValue: number;
  lastUpdate: string;
}

export type ProjectSortKey = keyof Project;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    planning: 'Σχεδιασμός',
    in_progress: 'Σε εξέλιξη',
    completed: 'Ολοκληρωμένο',
    on_hold: 'Σε αναμονή',
    cancelled: 'Ακυρωμένο'
};
