export interface SubStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  details?: string;
  subSteps: SubStep[];
  completed: boolean;
  completedAt?: number;
}

export interface Container {
  id: string;
  name: string;
  size: 'big' | 'medium';
  items: TodoItem[];
}
