import { useState, useEffect } from 'react';
import { Activity } from '@/types';

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
      const today = new Date().toISOString().split('T')[0];
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
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      date: selectedDate,
    };
    saveActivities([...activities, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const updated = activities.map(activity =>
      activity.id === id ? { ...activity, ...updates } : activity
    );
    saveActivities(updated);
  };

  const deleteActivity = (id: string) => {
    const filtered = activities.filter(activity => activity.id !== id);
    saveActivities(filtered);
  };

  const toggleTaskCompletion = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity && !activity.time) { // Only toggle for to-do items
      updateActivity(id, { completed: !activity.completed });
    }
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
  };
}