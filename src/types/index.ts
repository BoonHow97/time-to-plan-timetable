export type Category = 'Work' | 'Leisure' | 'Event';
export type ViewMode = 'day' | 'month' | 'year';

export interface Activity {
  id: string;
  name: string;
  category: Category;
  time?: string; // Optional time for timeline items
  endTime?: string; // Optional end time
  endDate?: string; // Optional end date (YYYY-MM-DD format)
  completed?: boolean; // For to-do items
  date: string; // YYYY-MM-DD format
  description?: string; // Optional description
}

export type FilterCategory = 'All' | Category;