
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SportCategory {
  value: string;
  label: string;
  icon: string;
  count: number;
}

interface ValueBetsSidebarProps {
  sportsCategories: SportCategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const ValueBetsSidebar = ({ sportsCategories, selectedCategory, onCategorySelect }: ValueBetsSidebarProps) => {
  return (
    <div className="w-32 bg-transparent border-r border-slate-800/50 shadow-2xl shadow-black/60 backdrop-blur-sm h-full">
      <ScrollArea className="h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="p-1.5 space-y-0.5 min-h-full flex flex-col" style={{ scrollbarWidth: 'none' }}>
          {sportsCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategorySelect(category.value)}
              className={`w-full text-left p-1.5 rounded-md transition-all duration-300 flex items-center justify-between text-xs group flex-shrink-0 ${
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
          {/* Spacer to stretch sidebar to full height */}
          <div className="flex-1" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ValueBetsSidebar;
