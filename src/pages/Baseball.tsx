
import React from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

const Baseball = () => {
  const mlbGames = [
    {
      league: "MLB",
      team1: "Yankees",
      team2: "Red Sox",
      startTime: "Tonight 7:05 PM",
      moneyline1: "-130",
      moneyline2: "+110",
      spread1: "-1.5",
      spread2: "+1.5",
      spreadOdds1: "+140",
      spreadOdds2: "-160",
      over: "9.5",
      under: "9.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    },
    {
      league: "MLB",
      team1: "Dodgers",
      team2: "Giants",
      startTime: "Tonight 10:10 PM",
      moneyline1: "-115",
      moneyline2: "-105",
      spread1: "-1.5",
      spread2: "+1.5",
      spreadOdds1: "+155",
      spreadOdds2: "-175",
      over: "8.0",
      under: "8.0",
      overOdds: "-105",
      underOdds: "-115",
      hasValueBet: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Baseball</h1>
            <p className="text-gray-400">MLB betting opportunities and value bets</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">MLB Value Bets</p>
                  <p className="text-2xl font-bold text-green-400">18</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Games Today</p>
                  <p className="text-2xl font-bold text-blue-400">15</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Edge</p>
                  <p className="text-2xl font-bold text-purple-400">9.8%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MLB Games */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">MLB Games</h2>
            <Badge className="bg-green-600 text-white">Regular Season</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mlbGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Baseball;
