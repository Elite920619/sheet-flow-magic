
import React from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

const Football = () => {
  const nflGames = [
    {
      league: "NFL",
      team1: "Chiefs",
      team2: "Bills",
      startTime: "Sunday 4:25 PM",
      moneyline1: "-110",
      moneyline2: "-110",
      spread1: "-1.5",
      spread2: "+1.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "47.5",
      under: "47.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    },
    {
      league: "NFL",
      team1: "49ers",
      team2: "Cowboys",
      startTime: "Sunday 8:20 PM",
      moneyline1: "-125",
      moneyline2: "+105",
      spread1: "-2.5",
      spread2: "+2.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "44.5",
      under: "44.5",
      overOdds: "-115",
      underOdds: "-105",
      hasValueBet: false
    },
    {
      league: "NFL",
      team1: "Ravens",
      team2: "Steelers",
      startTime: "Saturday 1:00 PM",
      moneyline1: "-140",
      moneyline2: "+120",
      spread1: "-3.0",
      spread2: "+3.0",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "42.5",
      under: "42.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    }
  ];

  const collegeGames = [
    {
      league: "NCAAF",
      team1: "Georgia",
      team2: "Alabama",
      startTime: "Saturday 8:00 PM",
      moneyline1: "+110",
      moneyline2: "-130",
      spread1: "+2.5",
      spread2: "-2.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "52.5",
      under: "52.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    },
    {
      league: "NCAAF",
      team1: "Michigan",
      team2: "Ohio State",
      startTime: "Saturday 12:00 PM",
      moneyline1: "+180",
      moneyline2: "-220",
      spread1: "+5.5",
      spread2: "-5.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "48.5",
      under: "48.5",
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
            <h1 className="text-3xl font-bold text-white mb-2">Football</h1>
            <p className="text-gray-400">NFL and College Football betting opportunities</p>
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
                  <p className="text-gray-400 text-sm">NFL Value Bets</p>
                  <p className="text-2xl font-bold text-green-400">23</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">College Value Bets</p>
                  <p className="text-2xl font-bold text-blue-400">41</p>
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
                  <p className="text-2xl font-bold text-purple-400">12.7%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFL Games */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">NFL Games</h2>
            <Badge className="bg-red-600 text-white">Week 15</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nflGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>

        {/* College Football Games */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">College Football</h2>
            <Badge className="bg-orange-600 text-white">Championship Week</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collegeGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Football;
