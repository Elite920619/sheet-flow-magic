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
    <div className="w-36 bg-transparent border-r border-slate-800/50 shadow-2xl shadow-black/60 backdrop-blur-sm h-full">
      <div className="p-1.5 space-y-0.5 h-full overflow-y-auto">
        {categoryFilters.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`w-full text-left p-1.5 rounded-md transition-all duration-300 flex items-center justify-between text-xs group ${
              selectedCategory === category.value
                ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50"
                : "hover:bg-slate-900/50 text-slate-300 hover:text-white hover:shadow-md hover:shadow-black/40 border border-slate-800/30 hover:border-slate-700/50"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className={`text-xs transition-transform duration-300 ${
                selectedCategory === category.value ? "scale-110" : "group-hover:scale-105"
              }`}>
                {category.icon}
              </span>
              <span className="font-medium text-xs">{category.label}</span>
            </div>
            <Badge
              className={`text-xs px-1 py-0 font-medium border-0 transition-all duration-300 ${
                selectedCategory === category.value
                  ? "bg-white/20 text-white shadow-sm"
                  : "bg-slate-800/70 text-slate-300 group-hover:bg-slate-700/70 group-hover:text-white"
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
