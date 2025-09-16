import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Activity, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AddActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id' | 'date'>) => void;
  onUpdate?: (id: string, activity: Partial<Activity>) => void;
  editingActivity?: Activity;
  onCancelEdit?: () => void;
  selectedDate: string;
}

export function AddActivityForm({
  onAdd,
  onUpdate,
  editingActivity,
  onCancelEdit,
  selectedDate,
}: AddActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(undefined);
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<Category>('Work');
  const [description, setDescription] = useState('');
  // Track whether user explicitly selected a date in the calendars
  const [startUserSelected, setStartUserSelected] = useState(false);
  const [endUserSelected, setEndUserSelected] = useState(false);

  useEffect(() => {
    if (editingActivity) {
      setIsOpen(true);
      setName(editingActivity.name);
      setDescription(editingActivity.description || '');
      
      // Parse start date/time
      if (editingActivity.time) {
        const startDate = new Date(editingActivity.date);
        const [hours, minutes] = editingActivity.time.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes));
        setStartDateTime(startDate);
      } else {
        setStartDateTime(undefined);
      }
      
      // Parse end date/time
      if (editingActivity.endDate) {
        const endDate = new Date(editingActivity.endDate);
        if (editingActivity.endTime) {
          const [hours, minutes] = editingActivity.endTime.split(':');
          endDate.setHours(parseInt(hours), parseInt(minutes));
        }
        setEndDateTime(endDate);
      } else if (editingActivity.endTime && startDateTime) {
        const endDate = new Date(editingActivity.date);
        const [hours, minutes] = editingActivity.endTime.split(':');
        endDate.setHours(parseInt(hours), parseInt(minutes));
        setEndDateTime(endDate);
      } else {
        setEndDateTime(undefined);
      }
      
      setCategory(editingActivity.category);
      // Mark as user-selected when editing existing times/dates
      setStartUserSelected(!!editingActivity.time);
      setEndUserSelected(!!editingActivity.endDate || !!editingActivity.endTime);
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const activityData = {
      name: name.trim(),
      category,
      time: startDateTime ? format(startDateTime, 'HH:mm') : undefined,
      endTime: endDateTime ? format(endDateTime, 'HH:mm') : undefined,
      endDate: endDateTime ? format(endDateTime, 'yyyy-MM-dd') : undefined,
      completed: startDateTime ? undefined : false,
      description: description.trim() || undefined,
    };

    if (editingActivity && onUpdate) {
      onUpdate(editingActivity.id, activityData);
      onCancelEdit?.();
    } else {
      onAdd(activityData);
    }

    // Reset form
    setName('');
    setStartDateTime(undefined);
    setEndDateTime(undefined);
    setCategory('Work');
    setDescription('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setName('');
    setStartDateTime(undefined);
    setEndDateTime(undefined);
    setCategory('Work');
    setDescription('');
    setIsOpen(false);
    onCancelEdit?.();
  };

  // Round a Date object to the nearest 5-minute mark
  const roundToNearestFiveMinutes = (date: Date) => {
    const d = new Date(date);
    const minutes = d.getMinutes();
    const roundedMinutes = Math.round(minutes / 5) * 5;
    d.setMinutes(roundedMinutes, 0, 0);
    return d;
  };

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];


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
                    <Label htmlFor="activity-category">Category</Label>
                    <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="top">
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Leisure">Leisure</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label>Start Date & Time (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDateTime && "text-muted-foreground"
                          )}
                          onClick={() => {
                            if (!startDateTime) {
                              const d = new Date(selectedDate);
                              d.setHours(0, 0, 0, 0);
                              setStartDateTime(d);
                              setStartUserSelected(false);
                            }
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDateTime ? (
                            format(startDateTime, "PPP 'at' HH:mm")
                          ) : (
                            <span>Pick start date and time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="top" sideOffset={5} avoidCollisions={false}>
                        <Calendar
                          mode="single"
                          selected={startUserSelected ? startDateTime : undefined}
                          defaultMonth={new Date(selectedDate)}
                              onSelect={(date) => {
                                if (date) {
                                  // If there's an existing time, preserve it
                                  if (startDateTime) {
                                    const newDate = new Date(date);
                                    newDate.setHours(startDateTime.getHours(), startDateTime.getMinutes());
                                    setStartDateTime(roundToNearestFiveMinutes(newDate));
                                   } else {
                                     // Default to selected date with current time
                                     const selectedDateObj = new Date(selectedDate);
                                     const now = new Date();
                                     selectedDateObj.setHours(now.getHours(), now.getMinutes());
                                     setStartDateTime(roundToNearestFiveMinutes(selectedDateObj));
                                   }
                                } else {
                                  setStartDateTime(undefined);
                                }
                              }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                        {startDateTime && (
                          <div className="p-3 border-t space-y-3">
                            <Label className="text-sm font-medium">Time</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label htmlFor="start-hour" className="text-xs text-muted-foreground">
                                  Hour
                                </Label>
                                <Select
                                  value={format(startDateTime, 'HH')}
                                  onValueChange={(hour) => {
                                    if (hour && startDateTime) {
                                      const newDateTime = new Date(startDateTime);
                                      newDateTime.setHours(parseInt(hour));
                                      setStartDateTime(newDateTime);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent side="top" avoidCollisions={false}>
                                    {hourOptions.map((hour) => (
                                      <SelectItem key={hour} value={hour}>
                                        {hour}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Label htmlFor="start-minute" className="text-xs text-muted-foreground">
                                  Minute
                                </Label>
                                <Select
                                  value={format(startDateTime, 'mm')}
                                  onValueChange={(minute) => {
                                    if (minute && startDateTime) {
                                      const newDateTime = new Date(startDateTime);
                                      newDateTime.setMinutes(parseInt(minute));
                                      setStartDateTime(newDateTime);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent side="top" avoidCollisions={false}>
                                    {minuteOptions.map((minute) => (
                                      <SelectItem key={minute} value={minute}>
                                        {minute}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date & Time (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDateTime && "text-muted-foreground"
                          )}
                          onClick={() => {
                            if (!endDateTime) {
                              const d = new Date(selectedDate);
                              d.setHours(0, 0, 0, 0);
                              setEndDateTime(d);
                              setEndUserSelected(false);
                            }
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDateTime ? (
                            format(endDateTime, "PPP 'at' HH:mm")
                          ) : (
                            <span>Pick end date and time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="top" sideOffset={5} avoidCollisions={false}>
                        <Calendar
                          mode="single"
                          selected={endUserSelected ? endDateTime : undefined}
                          defaultMonth={new Date(selectedDate)}
                              onSelect={(date) => {
                                if (date) {
                                  // If there's an existing time, preserve it
                                  if (endDateTime) {
                                    const newDate = new Date(date);
                                    newDate.setHours(endDateTime.getHours(), endDateTime.getMinutes());
                                    setEndDateTime(roundToNearestFiveMinutes(newDate));
                                   } else {
                                     // Default to 1 hour after start time, or selected date + 1 hour
                                     const baseTime = startDateTime || (() => {
                                       const selectedDateObj = new Date(selectedDate);
                                       const now = new Date();
                                       selectedDateObj.setHours(now.getHours(), now.getMinutes());
                                       return selectedDateObj;
                                     })();
                                     date.setHours(baseTime.getHours() + 1, baseTime.getMinutes());
                                     setEndDateTime(roundToNearestFiveMinutes(date));
                                   }
                                } else {
                                  setEndDateTime(undefined);
                                }
                              }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                        {endDateTime && (
                          <div className="p-3 border-t space-y-3">
                            <Label className="text-sm font-medium">Time</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label htmlFor="end-hour" className="text-xs text-muted-foreground">
                                  Hour
                                </Label>
                                <Select
                                  value={format(endDateTime, 'HH')}
                                  onValueChange={(hour) => {
                                    if (hour && endDateTime) {
                                      const newDateTime = new Date(endDateTime);
                                      newDateTime.setHours(parseInt(hour));
                                      setEndDateTime(newDateTime);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent side="top" avoidCollisions={false}>
                                    {hourOptions.map((hour) => (
                                      <SelectItem key={hour} value={hour}>
                                        {hour}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Label htmlFor="end-minute" className="text-xs text-muted-foreground">
                                  Minute
                                </Label>
                                <Select
                                  value={format(endDateTime, 'mm')}
                                  onValueChange={(minute) => {
                                    if (minute && endDateTime) {
                                      const newDateTime = new Date(endDateTime);
                                      newDateTime.setMinutes(parseInt(minute));
                                      setEndDateTime(newDateTime);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent side="top" avoidCollisions={false}>
                                    {minuteOptions.map((minute) => (
                                      <SelectItem key={minute} value={minute}>
                                        {minute}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Leave start time empty to add to to-do list
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-description">Description (Optional)</Label>
                    <Textarea
                      id="activity-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description for your activity..."
                      className="min-h-[80px] resize-none"
                    />
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