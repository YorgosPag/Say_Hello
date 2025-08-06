export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface Project {
  id: number;
  name: string;
  title: string;
  status: ProjectStatus;
  company: string;
  address: string;
  city: string;
  progress: number;
  totalValue: number;
  startDate?: string;
  completionDate?: string;
  lastUpdate: string;
  totalArea: number;
}

export type ProjectSortKey = 'name' | 'progress' | 'totalValue' | 'status' | 'area';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    planning: 'Σχεδιασμός',
    in_progress: 'Σε εξέλιξη',
    completed: 'Ολοκληρωμένο',
    on_hold: 'Σε αναμονή',
    cancelled: 'Ακυρωμένο'
};
