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
        <Button variant="outline" size="sm" className="bg-blur/80">
          <Globe className="h-4 w-4 mr-2" />
          {currentRegion?.flag} {currentRegion?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {regions.map((region) => (
          <DropdownMenuItem key={region.value} onClick={() => onRegionChange(region.value)}>
            {region.flag} {region.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LiveEventsRegionSelector;