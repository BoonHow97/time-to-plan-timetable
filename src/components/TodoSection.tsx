import { CheckSquare } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityItem } from './ActivityItem';

interface TodoSectionProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  currentDate: string;
}

export function TodoSection({
  activities,
  onEdit,
  onDelete,
  onToggleComplete,
  currentDate,
}: TodoSectionProps) {
  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">To-Do</h2>
        {totalCount > 0 && (
          <span className="text-sm text-muted-foreground">
            ({completedCount}/{totalCount} completed)
          </span>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tasks for today.</p>
          <p className="text-sm text-muted-foreground mt-1">Add an activity without a time to create a task.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              showTime={false}
              currentDate={currentDate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
