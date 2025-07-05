
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface Region {
  value: string;
  label: string;
  flag: string;
}

interface LiveEventsRegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const regions: Region[] = [
  { value: 'all', label: 'All Regions', flag: '' },
  { value: 'us', label: 'United States', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'eu', label: 'Europe', flag: '🇪🇺' },
  { value: 'au', label: 'Australia', flag: '🇦🇺' }
];

const LiveEventsRegionSelector: React.FC<LiveEventsRegionSelectorProps> = ({
  selectedRegion,
  onRegionChange
}) => {
  const currentRegion = regions.find(r => r.value === selectedRegion);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-slate-900/50 border-slate-800/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 text-xs px-2 py-1 h-7">
          <Globe className="h-3 w-3 mr-1" />
          {currentRegion?.flag} {currentRegion?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900/95 border-slate-800/50 backdrop-blur-sm">
        {regions.map((region) => (
          <DropdownMenuItem 
            key={region.value} 
            onClick={() => onRegionChange(region.value)}
            className="text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 text-xs"
          >
            {region.flag} {region.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LiveEventsRegionSelector;
