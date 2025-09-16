export type Category = 'Work' | 'Leisure' | 'Event';
export type ViewMode = 'day' | 'month' | 'year';

export interface Activity {
  id: string;
  name: string;
  category: Category;
  time?: string; // Optional time for timeline items
  completed?: boolean; // For to-do items
  date: string; // YYYY-MM-DD format
}

export type FilterCategory = 'All' | Category;