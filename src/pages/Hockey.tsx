
import React from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

const Hockey = () => {
  const nhlGames = [
    {
      league: "NHL",
      team1: "Rangers",
      team2: "Bruins",
      startTime: "Tonight 7:00 PM",
      moneyline1: "+105",
      moneyline2: "-125",
      spread1: "+1.5",
      spread2: "-1.5",
      spreadOdds1: "-200",
      spreadOdds2: "+170",
      over: "6.5",
      under: "6.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    },
    {
      league: "NHL",
      team1: "Oilers",
      team2: "Flames",
      startTime: "Tonight 9:00 PM",
      moneyline1: "-140",
      moneyline2: "+120",
      spread1: "-1.5",
      spread2: "+1.5",
      spreadOdds1: "+165",
      spreadOdds2: "-185",
      over: "6.0",
      under: "6.0",
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
            <h1 className="text-3xl font-bold text-white mb-2">Hockey</h1>
            <p className="text-gray-400">NHL betting opportunities and value bets</p>
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
                  <p className="text-gray-400 text-sm">NHL Value Bets</p>
                  <p className="text-2xl font-bold text-green-400">12</p>
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
                  <p className="text-2xl font-bold text-blue-400">8</p>
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
                  <p className="text-2xl font-bold text-purple-400">11.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NHL Games */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">NHL Games</h2>
            <Badge className="bg-blue-600 text-white">Regular Season</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nhlGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hockey;
