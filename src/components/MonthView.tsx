import { motion } from 'framer-motion';
import { CalendarGrid } from './CalendarGrid';
import { useCalendarData } from '@/hooks/useCalendarData';
import { FilterCategory, Activity } from '@/types';

interface MonthViewProps {
  selectedDate: string;
  onDateClick: (date: string) => void;
  onViewChange: (view: 'day') => void;
  searchQuery: string;
  categoryFilter: FilterCategory;
}

export function MonthView({ selectedDate, onDateClick, onViewChange, searchQuery, categoryFilter }: MonthViewProps) {
  const { getActivitiesForMonth } = useCalendarData();
  const selectedDateObj = new Date(selectedDate);
  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth();
  
  const monthActivities = getActivitiesForMonth(year, month);
  
  // Filter activities based on search and category
  const filteredMonthActivities: Record<string, Activity[]> = {};
  Object.entries(monthActivities).forEach(([date, activities]) => {
    const filtered = activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    if (filtered.length > 0) {
      filteredMonthActivities[date] = filtered;
    }
  });

  const handleDateClick = (date: string) => {
    onDateClick(date);
    onViewChange('day');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {selectedDateObj.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h1>
        <p className="text-muted-foreground">
          Click on any date to view details
        </p>
      </div>

      <CalendarGrid
        year={year}
        month={month}
        activities={filteredMonthActivities}
        onDateClick={handleDateClick}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
}