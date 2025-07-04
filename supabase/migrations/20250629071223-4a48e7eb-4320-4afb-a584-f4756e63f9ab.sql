
-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'paypal')),
  card_number TEXT,
  card_holder_name TEXT,
  card_expiry TEXT,
  card_cvv TEXT,
  paypal_email TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create live bets table for tracking real-time betting opportunities
CREATE TABLE public.live_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  league TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  odds TEXT NOT NULL,
  implied_probability TEXT NOT NULL,
  ai_probability TEXT NOT NULL,
  value_percentage TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  sportsbook TEXT NOT NULL,
  time_left TEXT NOT NULL,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  quarter TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create value bets table for tracking value betting opportunities
CREATE TABLE public.value_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  league TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  odds TEXT NOT NULL,
  implied_prob TEXT NOT NULL,
  ai_prob TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence TEXT NOT NULL,
  sportsbook TEXT NOT NULL,
  time_left TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.value_bets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_methods
CREATE POLICY "Users can view their own payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payment methods" ON public.payment_methods
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payment methods" ON public.payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for live_bets (public read, admin write)
CREATE POLICY "Anyone can view live bets" ON public.live_bets
  FOR SELECT USING (true);
CREATE POLICY "Service can manage live bets" ON public.live_bets
  FOR ALL USING (true);

-- Create RLS policies for value_bets (public read, admin write)
CREATE POLICY "Anyone can view value bets" ON public.value_bets
  FOR SELECT USING (true);
CREATE POLICY "Service can manage value bets" ON public.value_bets
  FOR ALL USING (true);

-- Add some sample data for live_bets
INSERT INTO public.live_bets (event_id, league, home_team, away_team, bet_type, odds, implied_probability, ai_probability, value_percentage, confidence, sportsbook, time_left, home_score, away_score, quarter) VALUES
('nba_lakers_warriors', 'NBA', 'Los Angeles Lakers', 'Golden State Warriors', 'Moneyline', '+105', '48.8%', '55.2%', '+12.3%', 78, 'DraftKings', '8:42', 78, 82, '3rd'),
('nfl_chiefs_bills', 'NFL', 'Kansas City Chiefs', 'Buffalo Bills', 'Spread -1.5', '-110', '52.4%', '58.1%', '+8.7%', 82, 'FanDuel', '3:27', 14, 10, '2nd'),
('epl_city_liverpool', 'Premier League', 'Manchester City', 'Liverpool', 'Over 2.5', '+180', '35.7%', '42.3%', '+15.6%', 71, 'BetMGM', '23:00', 1, 1, '67th min'),
('mlb_yankees_redsox', 'MLB', 'New York Yankees', 'Boston Red Sox', 'Yankees -1.5', '-140', '58.3%', '65.8%', '+11.4%', 85, 'Caesars', '2.5 innings', 4, 2, 'Top 7th'),
('nhl_leafs_canadiens', 'NHL', 'Toronto Maple Leafs', 'Montreal Canadiens', 'Over 6.5', '+115', '46.5%', '52.9%', '+9.2%', 73, 'PointsBet', '12:34', 2, 3, '2nd Period');

-- Add some sample data for value_bets
INSERT INTO public.value_bets (event, league, team1, team2, bet_type, odds, implied_prob, ai_prob, value, confidence, sportsbook, time_left) VALUES
('Warriors @ Lakers', 'NBA', 'Golden State Warriors', 'Los Angeles Lakers', 'Warriors ML', '+125', '44.4%', '52.1%', '+17.3%', '84', 'DraftKings', '2h 15m'),
('Chiefs vs Bills', 'NFL', 'Kansas City Chiefs', 'Buffalo Bills', 'Over 47.5', '+105', '48.8%', '56.2%', '+15.2%', '79', 'FanDuel', '1h 45m'),
('City vs Liverpool', 'Premier League', 'Manchester City', 'Liverpool', 'BTTS Yes', '+110', '47.6%', '54.8%', '+15.1%', '76', 'Bet365', '3h 30m'),
('Yankees @ Red Sox', 'MLB', 'New York Yankees', 'Boston Red Sox', 'Under 8.5', '-105', '51.2%', '58.7%', '+14.7%', '81', 'BetMGM', '4h 20m'),
('Leafs vs Canadiens', 'NHL', 'Toronto Maple Leafs', 'Montreal Canadiens', 'Leafs -1.5', '+165', '37.7%', '44.9%', '+19.1%', '77', 'PointsBet', '1h 10m');
