import { useState, useEffect } from 'react';
import { Activity } from '@/types';
import { formatLocalDate } from '@/lib/utils';

// Example data
const getExampleActivities = (date: string): Activity[] => [
  {
    id: '1',
    name: 'Team Standup Meeting',
    category: 'Work',
    time: '08:30',
    date,
  },
  {
    id: '2',
    name: 'Doctor Appointment',
    category: 'Event',
    time: '11:00',
    date,
  },
  {
    id: '3',
    name: 'Gym Session',
    category: 'Leisure',
    time: '15:00',
    date,
  },
  {
    id: '4',
    name: 'Finish CS Assignment',
    category: 'Work',
    completed: false,
    date,
  },
  {
    id: '5',
    name: 'Call Mom',
    category: 'Event',
    completed: false,
    date,
  },
  {
    id: '6',
    name: 'Read 10 pages of a book',
    category: 'Leisure',
    completed: false,
    date,
  },
];

export function useActivities(selectedDate: string) {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load activities from localStorage or use example data
  useEffect(() => {
    const storageKey = `activities-${selectedDate}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setActivities(JSON.parse(saved));
    } else {
      // Load example data for today only
      const today = formatLocalDate(new Date());
      if (selectedDate === today) {
        const exampleData = getExampleActivities(selectedDate);
        setActivities(exampleData);
        localStorage.setItem(storageKey, JSON.stringify(exampleData));
      } else {
        setActivities([]);
      }
    }
  }, [selectedDate]);

  // Save to localStorage whenever activities change
  const saveActivities = (newActivities: Activity[]) => {
    const storageKey = `activities-${selectedDate}`;
    setActivities(newActivities);
    localStorage.setItem(storageKey, JSON.stringify(newActivities));
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const activityId = Date.now().toString();
    const newActivity: Activity = {
      ...activity,
      id: activityId,
      date: selectedDate,
      startDate: selectedDate,
    };
    
    // If activity has an end date, create copies for each day in the range
    if (activity.endDate && activity.endDate !== selectedDate) {
      const startDate = new Date(selectedDate);
      const endDate = new Date(activity.endDate);
      
      // Store on all days between start and end (inclusive)
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const storageKey = `activities-${dateKey}`;
        const existingActivities = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const activityForDate = {
          ...newActivity,
          date: dateKey,
        };
        
        // Update activities for this date
        const updatedActivities = [...existingActivities, activityForDate];
        localStorage.setItem(storageKey, JSON.stringify(updatedActivities));
        
        // If this is the selected date, update state too
        if (dateKey === selectedDate) {
          setActivities(updatedActivities);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Single day activity
      saveActivities([...activities, newActivity]);
    }
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const activityToUpdate = activities.find(a => a.id === id);
    if (!activityToUpdate) return;
    
    // If this is a multi-day activity, update it across all affected days
    if (activityToUpdate.endDate && activityToUpdate.endDate !== activityToUpdate.date) {
      const startDate = new Date(activityToUpdate.startDate ?? activityToUpdate.date);
      const endDate = new Date(activityToUpdate.endDate);
      
      // Update on all days between start and end (inclusive)
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const storageKey = `activities-${dateKey}`;
        const existingActivities = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const updatedActivities = existingActivities.map((activity: Activity) =>
          activity.id === id ? { ...activity, ...updates } : activity
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedActivities));
        
        // If this is the selected date, update state too
        if (dateKey === selectedDate) {
          setActivities(updatedActivities);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Single day activity
      const updated = activities.map(activity =>
        activity.id === id ? { ...activity, ...updates } : activity
      );
      saveActivities(updated);
    }
  };

  const deleteActivity = (id: string) => {
    const activityToDelete = activities.find(a => a.id === id);
    if (!activityToDelete) return;
    
    // If this is a multi-day activity, delete it from all affected days
    if (activityToDelete.endDate && activityToDelete.endDate !== activityToDelete.date) {
      const startDate = new Date(activityToDelete.startDate ?? activityToDelete.date);
      const endDate = new Date(activityToDelete.endDate);
      
      // Delete from all days between start and end (inclusive)
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const storageKey = `activities-${dateKey}`;
        const existingActivities = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const filteredActivities = existingActivities.filter((activity: Activity) => activity.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filteredActivities));
        
        // If this is the selected date, update state too
        if (dateKey === selectedDate) {
          setActivities(filteredActivities);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Single day activity
      const filtered = activities.filter(activity => activity.id !== id);
      saveActivities(filtered);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity && !activity.time) { // Only toggle for to-do items
      updateActivity(id, { completed: !activity.completed });
    }
  };

  const reorderTodos = (reorderedTodos: Activity[]) => {
    const timelineActivities = activities.filter(activity => activity.time);
    const newActivities = [...timelineActivities, ...reorderedTodos];
    saveActivities(newActivities);
  };

  // Separate timeline and to-do items
  const timelineItems = activities
    .filter(activity => activity.time)
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return a.time.localeCompare(b.time);
    });

  const todoItems = activities.filter(activity => !activity.time);

  return {
    activities,
    timelineItems,
    todoItems,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleTaskCompletion,
    reorderTodos,
  };
}