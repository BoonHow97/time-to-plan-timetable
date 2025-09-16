import { motion } from 'framer-motion';
import { Edit, Trash2, Check } from 'lucide-react';
import { Activity } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  showTime?: boolean;
}

export function ActivityItem({
  activity,
  onEdit,
  onDelete,
  onToggleComplete,
  showTime = false,
}: ActivityItemProps) {
  const isCompleted = activity.completed === true;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200',
        'border border-border/50',
        isCompleted && 'opacity-60'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {!showTime && (
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete?.(activity.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          )}
          
          {showTime && activity.time && (
            <div className="text-sm font-bold text-foreground min-w-[60px]">
              {new Date(`2000-01-01T${activity.time}`).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
          )}
          
          <div className="flex-1">
            <div className={cn(
              'font-medium text-card-foreground',
              isCompleted && 'line-through'
            )}>
              {activity.name}
            </div>
          </div>
          
          <CategoryBadge category={activity.category} />
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(activity)}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(activity.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}