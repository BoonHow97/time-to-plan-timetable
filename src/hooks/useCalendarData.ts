import { useState, useEffect } from 'react';
import { Activity } from '@/types';

export function useCalendarData() {
  const [allActivities, setAllActivities] = useState<Record<string, Activity[]>>({});

  // Load all activities from localStorage
  useEffect(() => {
    const activities: Record<string, Activity[]> = {};
    
    // Get all activity keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('activities-')) {
        const date = key.replace('activities-', '');
        const data = localStorage.getItem(key);
        if (data) {
          try {
            activities[date] = JSON.parse(data);
          } catch (error) {
            console.error('Error parsing activities for date:', date, error);
          }
        }
      }
    }
    
    setAllActivities(activities);
  }, []);

  const getActivitiesForDate = (date: string): Activity[] => {
    return allActivities[date] || [];
  };

  const getActivitiesForMonth = (year: number, month: number): Record<string, Activity[]> => {
    const monthActivities: Record<string, Activity[]> = {};
    
    Object.entries(allActivities).forEach(([date, activities]) => {
      const dateObj = new Date(date);
      if (dateObj.getFullYear() === year && dateObj.getMonth() === month) {
        monthActivities[date] = activities;
      }
    });
    
    return monthActivities;
  };

  const getActivitiesForYear = (year: number): Record<string, Activity[]> => {
    const yearActivities: Record<string, Activity[]> = {};
    
    Object.entries(allActivities).forEach(([date, activities]) => {
      const dateObj = new Date(date);
      if (dateObj.getFullYear() === year) {
        yearActivities[date] = activities;
      }
    });
    
    return yearActivities;
  };

  // Refresh data when localStorage changes
  const refreshData = () => {
    const activities: Record<string, Activity[]> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('activities-')) {
        const date = key.replace('activities-', '');
        const data = localStorage.getItem(key);
        if (data) {
          try {
            activities[date] = JSON.parse(data);
          } catch (error) {
            console.error('Error parsing activities for date:', date, error);
          }
        }
      }
    }
    
    setAllActivities(activities);
  };

  return {
    getActivitiesForDate,
    getActivitiesForMonth,
    getActivitiesForYear,
    refreshData,
  };
}