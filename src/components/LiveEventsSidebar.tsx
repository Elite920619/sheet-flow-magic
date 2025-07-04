
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
    <div className="w-48 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-sm border-r border-slate-700/50 shadow-xl">
      <div className="p-3 space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {categoryFilters.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between text-sm group ${
              selectedCategory === category.value
                ? "bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white shadow-lg shadow-blue-500/25"
                : "hover:bg-slate-800/60 text-slate-300 hover:text-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-lg transition-transform duration-300 ${
                selectedCategory === category.value ? "scale-110" : "group-hover:scale-105"
              }`}>
                {category.icon}
              </span>
              <span className="font-medium">{category.label}</span>
            </div>
            <Badge
              className={`text-xs px-2 py-1 font-medium border-0 transition-all duration-300 ${
                selectedCategory === category.value
                  ? "bg-white/20 text-white shadow-md"
                  : "bg-slate-700/60 text-slate-300 group-hover:bg-slate-600/60 group-hover:text-white"
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
