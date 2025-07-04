
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, TrendingUp, Activity } from 'lucide-react';

interface LiveEventsOddsTableProps {
  games: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

const LiveEventsOddsTable = ({ games, isLoading, onRefresh }: LiveEventsOddsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading odds data...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Odds Data Available</h3>
          <p className="text-muted-foreground mb-4">
            Multi-region odds data is not available at the moment.
          </p>
          <Button onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const getBestOdds = (oddsArray: any[], type: 'highest' | 'lowest' = 'highest') => {
    if (!oddsArray || oddsArray.length === 0) return null;
    
    const sorted = [...oddsArray].sort((a, b) => {
      const aOdds = typeof a.odds === 'string' ? parseFloat(a.odds.replace(/[+]/g, '')) : a.odds;
      const bOdds = typeof b.odds === 'string' ? parseFloat(b.odds.replace(/[+]/g, '')) : b.odds;
      return type === 'highest' ? bOdds - aOdds : aOdds - bOdds;
    });
    
    return sorted[0];
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Multi-Region Odds Comparison
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead>League</TableHead>
                <TableHead>Home Team Best</TableHead>
                <TableHead>Away Team Best</TableHead>
                <TableHead>Draw Best</TableHead>
                <TableHead>Total Markets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game, index) => {
                const bestHomeOdds = getBestOdds(game.homeOdds);
                const bestAwayOdds = getBestOdds(game.awayOdds);
                const drawOdds = game.drawOdds ? getBestOdds(game.drawOdds) : null;
                
                return (
                  <TableRow key={game.id || index}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {game.awayTeam} @ {game.homeTeam}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(game.commenceTime).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {game.league}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bestHomeOdds ? (
                        <div className="space-y-1">
                          <Badge className="bg-blue-500 text-white text-xs">
                            {formatOdds(bestHomeOdds.odds)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {bestHomeOdds.sportsbook} ({bestHomeOdds.region})
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bestAwayOdds ? (
                        <div className="space-y-1">
                          <Badge className="bg-green-500 text-white text-xs">
                            {formatOdds(bestAwayOdds.odds)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {bestAwayOdds.sportsbook} ({bestAwayOdds.region})
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {drawOdds ? (
                        <div className="space-y-1">
                          <Badge className="bg-orange-500 text-white text-xs">
                            {formatOdds(drawOdds.odds)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {drawOdds.sportsbook} ({drawOdds.region})
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Home: {game.homeOdds?.length || 0}</div>
                        <div>Away: {game.awayOdds?.length || 0}</div>
                        {drawOdds && <div>Draw: {game.drawOdds?.length || 0}</div>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveEventsOddsTable;
