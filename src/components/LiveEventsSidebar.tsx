
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
    <div className="w-52 bg-deep-slate border-r border-slate-800/50 shadow-2xl shadow-black/60">
      <div className="p-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {categoryFilters.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-400 flex items-center justify-between text-sm group premium-card ${
              selectedCategory === category.value
                ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-2xl shadow-blue-600/40 glow-blue border border-blue-500/50"
                : "hover:bg-slate-900/70 text-slate-300 hover:text-white hover:shadow-xl hover:shadow-black/50 border border-slate-800/30 hover:border-slate-700/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className={`text-xl transition-transform duration-400 ${
                selectedCategory === category.value ? "scale-125" : "group-hover:scale-110"
              }`}>
                {category.icon}
              </span>
              <span className="font-semibold text-premium-light">{category.label}</span>
            </div>
            <Badge
              className={`text-xs px-3 py-1.5 font-semibold border-0 transition-all duration-400 ${
                selectedCategory === category.value
                  ? "bg-white/25 text-white shadow-lg backdrop-blur-sm"
                  : "bg-slate-800/70 text-slate-300 group-hover:bg-slate-700/70 group-hover:text-white backdrop-blur-sm"
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
