
import React from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import ValueBetCard from '@/components/ValueBetCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

const Basketball = () => {
  const nbaGames = [
    {
      league: "NBA",
      team1: "Lakers",
      team2: "Warriors",
      startTime: "Tonight 8:00 PM",
      moneyline1: "+120",
      moneyline2: "-140",
      spread1: "+3.5",
      spread2: "-3.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "215.5",
      under: "215.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    },
    {
      league: "NBA",
      team1: "Celtics",
      team2: "Heat",
      startTime: "Tonight 7:30 PM",
      moneyline1: "-165",
      moneyline2: "+140",
      spread1: "-4.0",
      spread2: "+4.0",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "208.5",
      under: "208.5",
      overOdds: "-105",
      underOdds: "-115",
      hasValueBet: false
    }
  ];

  const collegeGames = [
    {
      league: "NCAAB",
      team1: "Duke",
      team2: "UNC",
      startTime: "Saturday 6:00 PM",
      moneyline1: "-110",
      moneyline2: "-110",
      spread1: "-1.5",
      spread2: "+1.5",
      spreadOdds1: "-110",
      spreadOdds2: "-110",
      over: "142.5",
      under: "142.5",
      overOdds: "-110",
      underOdds: "-110",
      hasValueBet: true
    }
  ];

  const basketballValueBets = [
    {
      event: "NBA Regular Season",
      league: "NBA",
      team1: "Lakers",
      team2: "Warriors",
      betType: "Lakers ML",
      odds: "+120",
      impliedProb: "45.5%",
      aiProb: "52.3%",
      value: "+15.0%",
      confidence: "85",
      sportsbook: "DraftKings",
      timeLeft: "2h 15m"
    },
    {
      event: "NCAA Tournament",
      league: "NCAAB",
      team1: "Duke",
      team2: "UNC",
      betType: "Under 142.5",
      odds: "-110",
      impliedProb: "52.4%",
      aiProb: "58.9%",
      value: "+12.4%",
      confidence: "76",
      sportsbook: "FanDuel",
      timeLeft: "1d 18h"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Basketball</h1>
            <p className="text-gray-400">NBA and College Basketball betting opportunities</p>
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

        {/* Value Bets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-green-400" />
              Basketball Value Bets
            </h2>
            <Badge className="bg-green-600 text-white">
              High Value
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {basketballValueBets.map((bet, index) => (
              <ValueBetCard key={index} {...bet} />
            ))}
          </div>
        </div>

        {/* NBA Games */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">NBA Games</h2>
            <Badge className="bg-purple-600 text-white">Tonight</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nbaGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>

        {/* College Basketball Games */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">College Basketball</h2>
            <Badge className="bg-blue-600 text-white">March Madness</Badge>
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

export default Basketball;
