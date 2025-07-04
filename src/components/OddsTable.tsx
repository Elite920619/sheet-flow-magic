
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProcessedGameOdds } from '@/services/oddsService';
import { ValueBetAnalysis } from '@/services/aiService';
import { Clock, TrendingUp, Filter, RefreshCw, Star } from 'lucide-react';

interface OddsTableProps {
  games: (ProcessedGameOdds & { analysis?: ValueBetAnalysis })[];
  isLoading: boolean;
  onRefresh: () => void;
  lastUpdate: Date;
}

const OddsTable: React.FC<OddsTableProps> = ({ games, isLoading, onRefresh, lastUpdate }) => {
  const [selectedSport, setSelectedSport] = useState('all');
  const [sortBy, setSortBy] = useState<'time' | 'value' | 'confidence'>('value');

  const filteredGames = games.filter(game => 
    selectedSport === 'all' || game.league.toLowerCase().includes(selectedSport.toLowerCase())
  );

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime();
      case 'value':
        const aValue = Math.max(...(a.analysis?.recommendations.map(r => r.valuePercentage) || [0]));
        const bValue = Math.max(...(b.analysis?.recommendations.map(r => r.valuePercentage) || [0]));
        return bValue - aValue;
      case 'confidence':
        return (b.analysis?.overallConfidence || 0) - (a.analysis?.overallConfidence || 0);
      default:
        return 0;
    }
  });

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)}m`;
    } else if (diffHours < 24) {
      return `${Math.round(diffHours)}h`;
    } else {
      return `${Math.round(diffHours / 24)}d`;
    }
  };

  const getBestValueBet = (game: ProcessedGameOdds & { analysis?: ValueBetAnalysis }) => {
    if (!game.analysis?.recommendations.length) return null;
    return game.analysis.recommendations.reduce((best, current) => 
      current.valuePercentage > best.valuePercentage ? current : best
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Odds & AI Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Updated {formatTime(lastUpdate.toISOString())} ago
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Sport
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSport('all')}>
                  All Sports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSport('nfl')}>
                  NFL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSport('nba')}>
                  NBA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSport('mlb')}>
                  MLB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSport('nhl')}>
                  NHL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('value')}>
                  Value %
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('confidence')}>
                  Confidence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('time')}>
                  Game Time
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Moneyline</TableHead>
                <TableHead>Spread</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Best Value</TableHead>
                <TableHead>AI Analysis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGames.map((game) => {
                const bestValueBet = getBestValueBet(game);
                return (
                  <TableRow key={game.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {game.awayTeam} @ {game.homeTeam}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {game.league}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{formatTime(game.commenceTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {game.homeTeam.split(' ').pop()}: {formatOdds(game.moneyline.home)}
                        </div>
                        <div className="text-sm">
                          {game.awayTeam.split(' ').pop()}: {formatOdds(game.moneyline.away)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {game.spread.home.point} ({formatOdds(game.spread.home.odds)})
                        </div>
                        <div className="text-sm">
                          {game.spread.away.point} ({formatOdds(game.spread.away.odds)})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          O {game.total.over.point} ({formatOdds(game.total.over.odds)})
                        </div>
                        <div className="text-sm">
                          U {game.total.under.point} ({formatOdds(game.total.under.odds)})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {bestValueBet ? (
                        <div className="space-y-1">
                          <Badge className="bg-green-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            +{bestValueBet.valuePercentage.toFixed(1)}%
                          </Badge>
                          <div className="text-xs text-gray-600">
                            {bestValueBet.selection}
                          </div>
                          <div className="text-xs text-gray-500">
                            via {bestValueBet.sportsbook}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No value detected</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {game.analysis ? (
                        <div className="space-y-1">
                          <Badge 
                            className={`${
                              game.analysis.overallConfidence >= 80 
                                ? 'bg-green-500' 
                                : game.analysis.overallConfidence >= 60 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            } text-white`}
                          >
                            {game.analysis.overallConfidence}% Confidence
                          </Badge>
                          <div className="text-xs text-gray-600">
                            {game.analysis.recommendations.length} recommendations
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Analyzing...</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {sortedGames.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            No games found for the selected filters
          </div>
        )}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading odds and AI analysis...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OddsTable;
