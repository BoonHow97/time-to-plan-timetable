import { motion } from 'framer-motion';
import { useRef } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Button } from './ui/button';

interface YearViewProps {
  selectedDate: string;
  onDateClick: (date: string) => void;
  onViewChange: (view: 'day') => void;
}

export function YearView({ selectedDate, onDateClick, onViewChange }: YearViewProps) {
  const { getActivitiesForYear } = useCalendarData();
  const selectedDateObj = new Date(selectedDate);
  const year = selectedDateObj.getFullYear();
  const monthRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const yearActivities = getActivitiesForYear(year);

  const handleDateClick = (date: string) => {
    onDateClick(date);
    onViewChange('day');
  };

  const scrollToToday = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const monthElement = monthRefs.current[currentMonth];
    
    if (monthElement) {
      monthElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);
    return {
      month: i,
      name: monthDate.toLocaleDateString('en-US', { month: 'long' }),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {year}
        </h1>
        <Button 
          onClick={scrollToToday}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          Go to Today
        </Button>
        <p className="text-muted-foreground">
          Click on any date to view details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map(({ month }) => (
          <motion.div
            key={month}
            ref={(el) => (monthRefs.current[month] = el)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: month * 0.05 }}
          >
            <CalendarGrid
              year={year}
              month={month}
              activities={yearActivities}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}