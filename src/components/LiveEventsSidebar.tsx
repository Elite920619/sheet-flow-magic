import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SportCategory {
  value: string;
  label: string;
  icon: string;
  count: number;
}

interface LiveEventsSidebarProps {
  categoryFilters: SportCategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const LiveEventsSidebar: React.FC<LiveEventsSidebarProps> = ({
  categoryFilters,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="w-48 bg-card/95 backdrop-blur-sm border-r border-border shadow-sm">
      <div className="p-2 space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {categoryFilters.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center justify-between text-sm ${
              selectedCategory === category.value
                ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-blue-400"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </div>
            <Badge
              className={`text-xs px-1.5 py-0.5 ${
                selectedCategory === category.value
                  ? "bg-white/20 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {category.count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiveEventsSidebar;