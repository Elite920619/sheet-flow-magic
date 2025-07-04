
import { useMemo } from 'react';

export const useSportCategories = (liveEvents: any[]) => {
  const getSportCount = (sport: string) => {
    if (sport === 'all') return liveEvents.length;
    return liveEvents.filter(event => event.sport === sport).length;
  };

  const getSportIcon = (sport: string) => {
    const iconMap: { [key: string]: string } = {
      'football': '🏈',
      'basketball': '🏀',
      'soccer': '⚽',
      'baseball': '⚾',
      'hockey': '🏒',
      'tennis': '🎾',
      'golf': '⛳',
      'boxing': '🥊',
      'mma': '🥋',
      'cricket': '🏏',
      'rugby': '🏉',
      'aussie_rules': '🏈',
      'darts': '🎯',
      'snooker': '🎱',
      'motorsport': '🏎️',
      'esports': '🎮',
      'politics': '🗳️',
      'awards': '🏆',
      'other': '🏆'
    };
    return iconMap[sport] || '🏆';
  };

  const getSportLabel = (sport: string) => {
    const labelMap: { [key: string]: string } = {
      'football': 'Football',
      'basketball': 'Basketball',
      'soccer': 'Soccer',
      'baseball': 'Baseball',
      'hockey': 'Hockey',
      'tennis': 'Tennis',
      'golf': 'Golf',
      'boxing': 'Boxing',
      'mma': 'MMA',
      'cricket': 'Cricket',
      'rugby': 'Rugby',
      'aussie_rules': 'Aussie Rules',
      'darts': 'Darts',
      'snooker': 'Snooker',
      'motorsport': 'Motorsport',
      'esports': 'Esports',
      'politics': 'Politics',
      'awards': 'Awards',
      'other': 'Other'
    };
    return labelMap[sport] || sport.charAt(0).toUpperCase() + sport.slice(1);
  };

  const uniqueSports = useMemo(() => 
    [...new Set(liveEvents.map(event => event.sport))], 
    [liveEvents]
  );

  // Use consistent sport categories across all pages
  const allSportCategories = [
    'football', 'basketball', 'soccer', 'baseball', 'hockey', 
    'tennis', 'golf', 'boxing', 'mma', 'cricket', 'rugby', 
    'aussie_rules', 'darts', 'snooker', 'motorsport', 'esports', 
    'politics', 'awards', 'other'
  ];

  const sportsCategories = useMemo(() => {
    const categories = [
      { value: 'all', label: 'All Sports', icon: '🏆', count: getSportCount('all') }
    ];

    // Add categories in consistent order, only if they have events
    allSportCategories.forEach(sport => {
      const count = getSportCount(sport);
      if (count > 0) {
        categories.push({
          value: sport,
          label: getSportLabel(sport),
          icon: getSportIcon(sport),
          count: count
        });
      }
    });

    return categories;
  }, [liveEvents]);

  return {
    uniqueSports,
    sportsCategories,
    getSportLabel,
    getSportIcon,
    getSportCount
  };
};
