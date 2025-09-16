import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryStyles = {
  Work: 'bg-category-work text-category-work-foreground',
  Leisure: 'bg-category-leisure text-category-leisure-foreground',
  Event: 'bg-category-event text-category-event-foreground',
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      categoryStyles[category],
      className
    )}>
      {category}
    </span>
  );
}