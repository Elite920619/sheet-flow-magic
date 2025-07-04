
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, TrendingUp, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UpcomingGamesGridProps {
  games: any[];
  isLoading: boolean;
  onRefresh: () => void;
  formatOdds: (odds: number) => string;
  formatTimeTillStart: (commenceTime: string) => string;
  getOddsDifferencePercentage: (game: any) => number;
  onPlaceBet: (betData: any) => void;
}

const UpcomingGamesGrid: React.FC<UpcomingGamesGridProps> = ({
  games,
  isLoading,
  onRefresh,
  formatOdds,
  formatTimeTillStart,
  getOddsDifferencePercentage,
  onPlaceBet
}) => {
  console.log('UpcomingGamesGrid received games:', games.length, games.slice(0, 2));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading upcoming games...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Upcoming Games</h3>
          <p className="text-muted-foreground mb-4">
            No upcoming games are available at the moment.
          </p>
          <Button onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handlePlaceBet = (game: any, betType: string, odds: number, selection: string) => {
    onPlaceBet({
      event: `${game.awayTeam} @ ${game.homeTeam}`,
      type: betType,
      selection: selection,
      odds: odds,
      league: game.league,
      homeOdds: game.moneylineHome,
      awayOdds: game.moneylineAway,
      sportsbook: 'Various'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upcoming Games</h2>
          <p className="text-muted-foreground">
            {games.length} games available for betting
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
          {games.map((game, index) => {
            // Use the actual team names from the processed data
            const awayTeam = game.awayTeam || game.away_team || 'Away Team';
            const homeTeam = game.homeTeam || game.home_team || 'Home Team';
            const league = game.league || game.sport_title || 'Unknown League';
            const timeLeft = formatTimeTillStart(game.commenceTime || game.commence_time);

            console.log(`Rendering game ${index}: ${awayTeam} @ ${homeTeam}`);

            return (
              <Card 
                key={game.id || index} 
                className="bg-card hover:bg-accent/50 transition-colors border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {league}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {timeLeft}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <div className="text-right">
                        <p className="font-semibold text-sm">{awayTeam}</p>
                      </div>
                      <div className="text-center text-muted-foreground text-xs">@</div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{homeTeam}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Moneyline</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {game.moneylineAway && game.moneylineAway !== 'N/A' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handlePlaceBet(game, 'Moneyline', parseFloat(game.moneylineAway.replace(/[+]/g, '')), awayTeam)}
                        >
                          <div className="text-center">
                            <div className="font-medium">{awayTeam}</div>
                            <div className="text-xs">{game.moneylineAway}</div>
                          </div>
                        </Button>
                      )}
                      {game.moneylineHome && game.moneylineHome !== 'N/A' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handlePlaceBet(game, 'Moneyline', parseFloat(game.moneylineHome.replace(/[+]/g, '')), homeTeam)}
                        >
                          <div className="text-center">
                            <div className="font-medium">{homeTeam}</div>
                            <div className="text-xs">{game.moneylineHome}</div>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpcomingGamesGrid;
