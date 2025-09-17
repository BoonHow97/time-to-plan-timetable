import { CheckSquare } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Activity } from '@/types';
import { DraggableTodoItem } from './DraggableTodoItem';

interface TodoSectionProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onReorder: (reorderedTodos: Activity[]) => void;
  currentDate: string;
}

export function TodoSection({
  activities,
  onEdit,
  onDelete,
  onToggleComplete,
  onReorder,
  currentDate,
}: TodoSectionProps) {
  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = activities.findIndex((item) => item.id === active.id);
      const newIndex = activities.findIndex((item) => item.id === over?.id);

      const reorderedActivities = arrayMove(activities, oldIndex, newIndex);
      onReorder(reorderedActivities);
    }
  };

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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activities.map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {activities.map((activity) => (
                <DraggableTodoItem
                  key={activity.id}
                  activity={activity}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  currentDate={currentDate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
