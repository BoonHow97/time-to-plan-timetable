import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityItem } from './ActivityItem';

interface TimelineSectionProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  currentDate: string;
}

export function TimelineSection({ activities, onEdit, onDelete, currentDate }: TimelineSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Timeline</h2>
        {activities.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({activities.length} {activities.length === 1 ? 'event' : 'events'})
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No scheduled activities today.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add an activity with a time to see it here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showTime={true}
                  currentDate={currentDate}
                />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}