import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { cn, formatLocalDate } from '@/lib/utils';

interface CalendarGridProps {
  year: number;
  month: number;
  activities: Record<string, Activity[]>;
  onDateClick: (date: string) => void;
  selectedDate?: string;
}

export function CalendarGrid({ 
  year, 
  month, 
  activities, 
  onDateClick, 
  selectedDate 
}: CalendarGridProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDate = new Date(startDate);
  
  // Generate 6 weeks (42 days) to ensure full calendar grid
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const today = new Date();
  const todayString = formatLocalDate(today);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Month Header */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
        <h3 className="font-semibold text-card-foreground">
          {firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/20"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateString = formatLocalDate(day);
          const dayActivities = activities[dateString] || [];
          const isCurrentMonth = day.getMonth() === month;
          const isToday = dateString === todayString;
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateClick(dateString)}
              className={cn(
                'min-h-[80px] p-2 border-r border-b border-border/30 text-left hover:bg-accent/50 transition-colors',
                !isCurrentMonth && 'text-muted-foreground/50 bg-muted/10',
                isToday && 'bg-primary/10 border-primary/30',
                'last-in-row:border-r-0 last-row:border-b-0'
              )}
              style={{
                borderRightWidth: (index + 1) % 7 === 0 ? 0 : undefined,
                borderBottomWidth: index >= 35 ? 0 : undefined,
              }}
            >
              <div className="flex flex-col h-full">
                <div className={cn(
                  'text-sm font-medium mb-1',
                  isToday && 'text-primary font-bold'
                )}>
                  {day.getDate()}
                </div>
                
                <div className="flex-1 space-y-1">
                  {dayActivities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="text-xs p-1 rounded bg-category-work/20 text-category-work-foreground truncate"
                      style={{
                        backgroundColor: activity.category === 'Work' 
                          ? 'hsl(var(--category-work))' 
                          : activity.category === 'Leisure'
                          ? 'hsl(var(--category-leisure))'
                          : 'hsl(var(--category-event))',
                        color: activity.category === 'Work' 
                          ? 'hsl(var(--category-work-foreground))' 
                          : activity.category === 'Leisure'
                          ? 'hsl(var(--category-leisure-foreground))'
                          : 'hsl(var(--category-event-foreground))',
                      }}
                    >
                      {activity.time && (
                        <span className="font-medium">
                          {activity.time}
                        </span>
                      )}
                      {activity.time && ' '}
                      <span>{activity.name}</span>
                    </div>
                  ))}
                  {dayActivities.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayActivities.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}