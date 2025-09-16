import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, FilterCategory } from '@/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryBadge } from '@/components/CategoryBadge';

interface SearchDropdownProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activities: Activity[];
  categoryFilter: FilterCategory;
  onActivityClick: (date: string) => void;
  onViewModeChange?: (mode: 'day') => void;
  placeholder?: string;
}

export function SearchDropdown({
  searchQuery,
  onSearchChange,
  activities,
  categoryFilter,
  onActivityClick,
  onViewModeChange,
  placeholder = "Search activities..."
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Activity[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter activities based on search query and category filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }

    const filtered = activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    setFilteredResults(filtered.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, activities, categoryFilter]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    onSearchChange(value);
    setIsOpen(value.length > 0);
  };

  const handleActivityClick = (activity: Activity) => {
    // Always go to the start date for activities (even if they span multiple days)
    onActivityClick(activity.date);
    // Switch to day view
    onViewModeChange?.('day');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative flex-1 max-w-md" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(searchQuery.length > 0)}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {isOpen && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1"
          >
            <Card className="shadow-lg border border-border/50 bg-background">
              <CardContent className="p-0 bg-background">
                <div className="max-h-80 overflow-y-auto">
                  {filteredResults.map((activity) => (
                    <button
                      key={`${activity.id}-${activity.date}`}
                      onClick={() => handleActivityClick(activity)}
                      className="w-full p-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border/30 last:border-b-0 focus:outline-none focus:bg-accent bg-background"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {activity.name}
                            </span>
                            <CategoryBadge category={activity.category} />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(activity.date)}</span>
                            </div>
                            {activity.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {activity.time}
                                  {activity.endTime && ` - ${activity.endTime}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {filteredResults.length === 0 && searchQuery && (
                  <div className="p-3 text-center text-sm text-muted-foreground bg-background">
                    No activities found
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}