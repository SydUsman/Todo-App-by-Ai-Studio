
export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  category: string;
}

export type ThemeMode = 'light' | 'dark';

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  OTHER = 'Other'
}
