import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, FilterCategory } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useActivities } from '@/hooks/useActivities';
import { Header } from '@/components/Header';
import { TimelineSection } from '@/components/TimelineSection';
import { TodoSection } from '@/components/TodoSection';
import { AddActivityForm } from '@/components/AddActivityForm';

const Index = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => 
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('All');
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();

  const {
    timelineItems,
    todoItems,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleTaskCompletion,
  } = useActivities(selectedDate);

  // Filter activities based on search and category
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
  };

  const handleCancelEdit = () => {
    setEditingActivity(undefined);
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
      />

      <main className="container mx-auto px-4 py-8 pb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <TimelineSection
            activities={filteredTimelineItems}
            onEdit={handleEditActivity}
            onDelete={deleteActivity}
          />

          <TodoSection
            activities={filteredTodoItems}
            onEdit={handleEditActivity}
            onDelete={deleteActivity}
            onToggleComplete={toggleTaskCompletion}
          />
        </motion.div>
      </main>

      <AddActivityForm
        onAdd={addActivity}
        onUpdate={handleUpdateActivity}
        editingActivity={editingActivity}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default Index;
