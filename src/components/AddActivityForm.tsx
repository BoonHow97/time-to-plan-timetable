import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Activity, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id' | 'date'>) => void;
  onUpdate?: (id: string, activity: Partial<Activity>) => void;
  editingActivity?: Activity;
  onCancelEdit?: () => void;
}

export function AddActivityForm({
  onAdd,
  onUpdate,
  editingActivity,
  onCancelEdit,
}: AddActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<Category>('Work');

  useEffect(() => {
    if (editingActivity) {
      setIsOpen(true);
      setName(editingActivity.name);
      setTime(editingActivity.time || '');
      setEndTime(editingActivity.endTime || '');
      setEndDate(editingActivity.endDate || '');
      setCategory(editingActivity.category);
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const activityData = {
      name: name.trim(),
      category,
      time: time || undefined,
      endTime: endTime || undefined,
      endDate: endDate || undefined,
      completed: time ? undefined : false,
    };

    if (editingActivity && onUpdate) {
      onUpdate(editingActivity.id, activityData);
      onCancelEdit?.();
    } else {
      onAdd(activityData);
    }

    // Reset form
    setName('');
    setTime('');
    setEndTime('');
    setEndDate('');
    setCategory('Work');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setName('');
    setTime('');
    setEndTime('');
    setEndDate('');
    setCategory('Work');
    setIsOpen(false);
    onCancelEdit?.();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-card-hover">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-card-foreground">
                      {editingActivity ? 'Edit Activity' : 'Add Activity'}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-name">Activity Name</Label>
                    <Input
                      id="activity-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter activity name..."
                      className="w-full"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-time">Start Time (Optional)</Label>
                    <Input
                      id="activity-time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-end-time">End Time (Optional)</Label>
                    <Input
                      id="activity-end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-end-date">End Date (Optional)</Label>
                    <Input
                      id="activity-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave start time empty to add to to-do list
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-category">Category</Label>
                    <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Leisure">Leisure</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={!name.trim()}>
                      {editingActivity ? 'Update' : 'Add'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-card-hover bg-gradient-primary hover:shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}