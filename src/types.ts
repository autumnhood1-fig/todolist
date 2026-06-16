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
  evan?: boolean;
}

export interface SectionItem {
  id: string;
  text: string;
}

export interface ContainerSection {
  id: string;
  label: string;
  items: SectionItem[];
}

export interface Container {
  id: string;
  name: string;
  size: 'big' | 'medium';
  items: TodoItem[];
  sections?: ContainerSection[];
  dividerIndex?: number;
}
