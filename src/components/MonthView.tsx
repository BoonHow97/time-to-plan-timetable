import { motion } from 'framer-motion';
import { CalendarGrid } from './CalendarGrid';
import { useCalendarData } from '@/hooks/useCalendarData';

interface MonthViewProps {
  selectedDate: string;
  onDateClick: (date: string) => void;
  onViewChange: (view: 'day') => void;
}

export function MonthView({ selectedDate, onDateClick, onViewChange }: MonthViewProps) {
  const { getActivitiesForMonth } = useCalendarData();
  const selectedDateObj = new Date(selectedDate);
  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth();
  
  const monthActivities = getActivitiesForMonth(year, month);

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
        activities={monthActivities}
        onDateClick={handleDateClick}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
}