
import { supabase } from '@/integrations/supabase/client';

export interface SeedData {
  live_bets: any[];
  value_bets: any[];
  user_credits: any[];
  transactions: any[];
}

export const seedDatabaseData = async (): Promise<void> => {
  try {
    // Sample live bets data
    const liveBetsData = [
      {
        event_id: 'nba-001',
        league: 'NBA',
        home_team: 'Los Angeles Lakers',
        away_team: 'Boston Celtics',
        bet_type: 'Moneyline',
        odds: '+120',
        implied_probability: '45.5%',
        ai_probability: '52.3%',
        value_percentage: '+15.2%',
        confidence: 78,
        sportsbook: 'DraftKings',
        time_left: '2:45',
        home_score: 95,
        away_score: 88,
        quarter: '4th',
        status: 'active'
      },
      {
        event_id: 'nfl-002', 
        league: 'NFL',
        home_team: 'Green Bay Packers',
        away_team: 'Minnesota Vikings',
        bet_type: 'Spread -3.5',
        odds: '-110',
        implied_probability: '52.4%',
        ai_probability: '58.7%',
        value_percentage: '+12.1%',
        confidence: 72,
        sportsbook: 'FanDuel',
        time_left: '12:30',
        home_score: 21,
        away_score: 14,
        quarter: '3rd',
        status: 'active'
      },
      {
        event_id: 'mlb-003',
        league: 'MLB',
        home_team: 'New York Yankees',
        away_team: 'Boston Red Sox',
        bet_type: 'Over 8.5',
        odds: '+105',
        implied_probability: '48.8%',
        ai_probability: '55.2%',
        value_percentage: '+13.1%',
        confidence: 69,
        sportsbook: 'Caesars',
        time_left: '3 innings',
        home_score: 5,
        away_score: 3,
        quarter: 'Top 7th',
        status: 'active'
      },
      {
        event_id: 'nhl-004',
        league: 'NHL',
        home_team: 'Toronto Maple Leafs',
        away_team: 'Montreal Canadiens',
        bet_type: 'Puck Line -1.5',
        odds: '+165',
        implied_probability: '37.7%',
        ai_probability: '44.9%',
        value_percentage: '+19.1%',
        confidence: 81,
        sportsbook: 'BetMGM',
        time_left: '8:15',
        home_score: 3,
        away_score: 1,
        quarter: '3rd Period',
        status: 'active'
      },
      {
        event_id: 'soccer-005',
        league: 'Premier League',
        home_team: 'Manchester United',
        away_team: 'Liverpool',
        bet_type: 'Draw',
        odds: '+240',
        implied_probability: '29.4%',
        ai_probability: '35.8%',
        value_percentage: '+21.8%',
        confidence: 65,
        sportsbook: 'PointsBet',
        time_left: '25:00',
        home_score: 1,
        away_score: 1,
        quarter: '65th min',
        status: 'active'
      }
    ];

    // Sample value bets data
    const valueBetsData = [
      {
        event: 'Lakers vs Celtics',
        league: 'NBA',
        team1: 'Los Angeles Lakers',
        team2: 'Boston Celtics',
        bet_type: 'Over 215.5',
        odds: '+110',
        implied_prob: '47.6%',
        ai_prob: '58.2%',
        value: '+22.3%',
        confidence: '84',
        sportsbook: 'DraftKings',
        time_left: '2 hours',
        status: 'active'
      },
      {
        event: 'Cowboys vs Eagles',
        league: 'NFL',
        team1: 'Dallas Cowboys',
        team2: 'Philadelphia Eagles',
        bet_type: 'Cowboys -7',
        odds: '-105',
        implied_prob: '51.2%',
        ai_prob: '63.8%',
        value: '+24.6%',
        confidence: '89',
        sportsbook: 'FanDuel',
        time_left: '4 hours',
        status: 'active'
      },
      {
        event: 'Dodgers vs Padres',
        league: 'MLB',
        team1: 'Los Angeles Dodgers',
        team2: 'San Diego Padres',
        bet_type: 'Dodgers ML',
        odds: '-140',
        implied_prob: '58.3%',
        ai_prob: '71.2%',
        value: '+22.1%',
        confidence: '76',
        sportsbook: 'Caesars',
        time_left: '1.5 hours',
        status: 'active'
      },
      {
        event: 'Rangers vs Devils',
        league: 'NHL',
        team1: 'New York Rangers',
        team2: 'New Jersey Devils',
        bet_type: 'Under 6.5',
        odds: '+120',
        implied_prob: '45.5%',
        ai_prob: '57.9%',
        value: '+27.3%',
        confidence: '82',
        sportsbook: 'BetMGM',
        time_left: '3 hours',
        status: 'active'
      },
      {
        event: 'Arsenal vs Chelsea',
        league: 'Premier League',
        team1: 'Arsenal',
        team2: 'Chelsea',
        bet_type: 'Both Teams To Score',
        odds: '-110',
        implied_prob: '52.4%',
        ai_prob: '64.7%',
        value: '+23.5%',
        confidence: '78',
        sportsbook: 'PointsBet',
        time_left: '6 hours',
        status: 'active'
      }
    ];

    // Clear existing data
    await supabase.from('live_bets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('value_bets').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert live bets
    const { error: liveBetsError } = await supabase
      .from('live_bets')
      .insert(liveBetsData);

    if (liveBetsError) {
      console.error('Error seeding live bets:', liveBetsError);
    } else {
      console.log('Live bets seeded successfully');
    }

    // Insert value bets
    const { error: valueBetsError } = await supabase
      .from('value_bets')
      .insert(valueBetsData);

    if (valueBetsError) {
      console.error('Error seeding value bets:', valueBetsError);
    } else {
      console.log('Value bets seeded successfully');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Call this function to seed the database
export const initializeAppData = async () => {
  await seedDatabaseData();
};
