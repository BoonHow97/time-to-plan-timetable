import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, FilterCategory, ViewMode } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useActivities } from '@/hooks/useActivities';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Header } from '@/components/Header';
import { TimelineSection } from '@/components/TimelineSection';
import { TodoSection } from '@/components/TodoSection';
import { MonthView } from '@/components/MonthView';
import { YearView } from '@/components/YearView';
import { AddActivityForm } from '@/components/AddActivityForm';

const Index = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => 
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('All');
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const yearScrollRef = useRef<(() => void) | null>(null);

  const { refreshData } = useCalendarData();

  const {
    timelineItems,
    todoItems,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleTaskCompletion,
  } = useActivities(selectedDate);

  // Filter activities based on search and category (only for day view)
  const filteredTimelineItems = useMemo(() => {
    return timelineItems.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [timelineItems, searchQuery, categoryFilter]);

  const filteredTodoItems = useMemo(() => {
    return todoItems.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [todoItems, searchQuery, categoryFilter]);

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleUpdateActivity = (id: string, updates: Partial<Activity>) => {
    updateActivity(id, updates);
    setEditingActivity(undefined);
    refreshData(); // Refresh calendar data when activity is updated
  };

  const handleCancelEdit = () => {
    setEditingActivity(undefined);
  };

  const handleAddActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    addActivity(activity);
    refreshData(); // Refresh calendar data when activity is added
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    refreshData(); // Refresh calendar data when activity is deleted
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleGoToToday = () => {
    if (viewMode === 'year' && yearScrollRef.current) {
      // Longer delay to ensure the date change and component render
      setTimeout(() => {
        yearScrollRef.current?.();
      }, 300);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onGoToToday={handleGoToToday}
      />

      <main className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        <AnimatePresence mode="wait">
          {viewMode === 'day' && (
            <motion.div
              key="day-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <TimelineSection
                activities={filteredTimelineItems}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />

              <TodoSection
                activities={filteredTodoItems}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                onToggleComplete={toggleTaskCompletion}
              />
            </motion.div>
          )}
          
          {viewMode === 'month' && (
            <MonthView
              key="month-view"
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              onViewChange={setViewMode}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
            />
          )}
          
          {viewMode === 'year' && (
            <YearView
              key="year-view"
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              onViewChange={setViewMode}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              onScrollToCurrentMonth={yearScrollRef}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Only show Add Activity Form in day view */}
      {viewMode === 'day' && (
        <AddActivityForm
          onAdd={handleAddActivity}
          onUpdate={handleUpdateActivity}
          editingActivity={editingActivity}
          onCancelEdit={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default Index;
