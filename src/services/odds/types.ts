
export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface ProcessedGameOdds {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  moneyline: {
    home: number;
    away: number;
    draw?: number;
    sportsbook: string;
  };
  spread: {
    home: { point: number; odds: number };
    away: { point: number; odds: number };
    sportsbook: string;
  };
  total: {
    over: { point: number; odds: number };
    under: { point: number; odds: number };
    sportsbook: string;
  };
  bestOdds: {
    homeML: { odds: number; sportsbook: string };
    awayML: { odds: number; sportsbook: string };
    drawML?: { odds: number; sportsbook: string };
    overTotal: { point: number; odds: number; sportsbook: string };
    underTotal: { point: number; odds: number; sportsbook: string };
  };
  region: string;
}

export interface SportInfo {
  key: string;
  title: string;
  active: boolean;
}
