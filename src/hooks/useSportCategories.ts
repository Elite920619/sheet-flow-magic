import { useMemo } from 'react';

export const useSportCategories = (events: any[]) => {
  const getSportCount = (sport: string) => {
    if (sport === 'all') return events.length;
    return events.filter(event => {
      const eventSport = event.sport?.toLowerCase();
      const targetSport = sport.toLowerCase();
      return eventSport === targetSport;
    }).length;
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
    [...new Set(events.map(event => event.sport?.toLowerCase()).filter(Boolean))], 
    [events]
  );

  // Use consistent sport categories across all pages
  const allSportCategories = [
    'football', 'basketball', 'soccer', 'baseball', 'hockey', 
    'tennis', 'golf', 'boxing', 'mma', 'cricket', 'rugby', 
    'aussie_rules', 'darts', 'snooker', 'motorsport', 'esports'
  ];

  const sportsCategories = useMemo(() => {
    console.log('🏆 Building sport categories from events:', {
      totalEvents: events.length,
      uniqueSports: uniqueSports,
      sampleEvents: events.slice(0, 3).map(e => ({ sport: e.sport, region: e.region }))
    });

    // Get all available sports from current events
    const availableSports = [...new Set(events.map(event => event.sport?.toLowerCase()).filter(Boolean))];
    
    // Start with All Sports category
    const categories = [
      { value: 'all', label: 'All Sports', icon: '🏆', count: events.length }
    ];

    // Add all supported sports that are in our allSportCategories list
    allSportCategories.forEach(sport => {
      if (availableSports.includes(sport)) {
        categories.push({
          value: sport,
          label: getSportLabel(sport),
          icon: getSportIcon(sport),
          count: events.filter(event => event.sport?.toLowerCase() === sport).length
        });
        console.log(`✅ Added category: ${sport}`);
      }
    });

    // Add any new sports that aren't in our predefined list but exist in the data
    availableSports
      .filter(sport => !allSportCategories.includes(sport))
      .forEach(sport => {
        if (sport && !['politics', 'awards', 'other'].includes(sport)) {
          categories.push({
            value: sport,
            label: getSportLabel(sport),
            icon: getSportIcon(sport),
            count: events.filter(event => event.sport?.toLowerCase() === sport).length
          });
          console.log(`✅ Added new sport category: ${sport}`);
        }
      });

    console.log('🎯 Final categories:', categories.map(c => `${c.label}: ${c.count}`));
    return categories;
  }, [events]);

  return {
    uniqueSports,
    sportsCategories,
    getSportLabel,
    getSportIcon,
    getSportCount
  };
};
