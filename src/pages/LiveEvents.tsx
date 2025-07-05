
import React from "react";
import Header from "@/components/Header";
import CanvasBackground from "@/components/CanvasBackground";
import LiveEventsContent from "@/components/LiveEventsContent";
import LiveEventsHeader from "@/components/LiveEventsHeader";
import LiveEventsSidebar from "@/components/LiveEventsSidebar";
import LiveEventsModals from "@/components/LiveEventsModals";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { useEnhancedCredits } from "@/hooks/useEnhancedCredits";
import { useSportCategories } from "@/hooks/useSportCategories";
import { useLiveEventsState } from "@/hooks/useLiveEventsState";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";

const LiveEvents = () => {
  const [activeTab, setActiveTab] = React.useState<'live' | 'upcoming'>('live');

  const {
    selectedBet,
    setSelectedBet,
    showBetPlacement,
    setShowBetPlacement,
    showInsufficientFunds,
    setShowInsufficientFunds,
    showDeposit,
    setShowDeposit,
    showEventModal,
    setShowEventModal,
    selectedEvent,
    selectedCategory,
    insufficientFundsAmount,
    handleEventClick,
    handleCategorySelect,
    handleInsufficientFunds,
    handleDepositModalOpen,
  } = useLiveEventsState();

  const { liveEvents, isLoading, isRefreshing, refreshEvents } = useLiveEvents();
  const { upcomingEvents, isLoading: isLoadingUpcoming, isRefreshing: isRefreshingUpcoming, refreshEvents: refreshUpcomingEvents } = useUpcomingEvents();
  const { credits, deposit, isDepositing, checkSufficientFunds } = useEnhancedCredits();
  
  // Get categories for the current active tab's events
  const currentEvents = activeTab === 'live' ? liveEvents : upcomingEvents;
  const { sportsCategories, getSportLabel } = useSportCategories(currentEvents);

  // Filter and sort events based on active tab and selected category
  const sortedEvents = currentEvents
    .filter((event) => {
      if (selectedCategory === "all") return true;
      
      // Ensure we're comparing the same format
      const eventSport = event.sport?.toLowerCase();
      const selectedSport = selectedCategory?.toLowerCase();
      
      console.log(`🔍 Filtering event: ${event.homeTeam || event.home_team} vs ${event.awayTeam || event.away_team}, sport: "${eventSport}", selected: "${selectedSport}"`);
      
      return eventSport === selectedSport;
    })
    .sort((a, b) => {
      const timeA = a.timeLeft?.match(/\d+/)?.[0] || "0";
      const timeB = b.timeLeft?.match(/\d+/)?.[0] || "0";
      const timeDiff = parseInt(timeA) - parseInt(timeB);
      if (timeDiff !== 0) return timeDiff;
      return (a.league || "").localeCompare(b.league || "");
    });

  const availableMarkets = sortedEvents.filter((e) => e.betStatus === "Available").length;
  const uniqueSportsLength = [...new Set(currentEvents.map(event => event.sport))].length;

  const handleTabChange = (tab: 'live' | 'upcoming') => {
    console.log(`🔄 Switching to ${tab} tab`);
    setActiveTab(tab);
    // Reset category to 'all' when switching tabs to ensure valid selection
    handleCategorySelect('all');
  };

  const handlePlaceBet = (betData: any) => {
    if (betData.insufficientFunds) {
      handleInsufficientFunds(betData.stake || 50);
      return;
    }

    const stakeAmount = betData.stake || 50;
    if (!checkSufficientFunds(stakeAmount)) {
      handleInsufficientFunds(stakeAmount);
      return;
    }

    setSelectedBet(betData);
    setShowBetPlacement(true);
  };

  return (
    <div className="min-h-screen text-foreground relative" style={{ background: 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)' }}>
      <CanvasBackground />
      <Header />

      <div className="relative z-10 h-[calc(100vh-12rem)] flex flex-col bg-blur/80">
        <LiveEventsHeader
          sortedEventsLength={sortedEvents.length}
          availableMarkets={availableMarkets}
          uniqueSportsLength={uniqueSportsLength}
        />
        
        <div className="flex flex-1">
          <LiveEventsSidebar
            categoryFilters={sportsCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <div className="flex-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <LiveEventsContent
              isLoading={activeTab === 'live' ? isLoading : isLoadingUpcoming}
              isRefreshing={activeTab === 'live' ? isRefreshing : isRefreshingUpcoming}
              sortedEvents={sortedEvents}
              selectedCategory={selectedCategory}
              getSportLabel={getSportLabel}
              uniqueSportsLength={uniqueSportsLength}
              onEventClick={handleEventClick}
              onPlaceBet={handlePlaceBet}
              onRefresh={activeTab === 'live' ? refreshEvents : refreshUpcomingEvents}
              onCategoryChange={handleCategorySelect}
              upcomingSportsCategories={sportsCategories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>

      <LiveEventsModals
        showEventModal={showEventModal}
        selectedEvent={selectedEvent}
        onCloseEventModal={() => setShowEventModal(false)}
        onPlaceBet={handlePlaceBet}
        showBetPlacement={showBetPlacement}
        selectedBet={selectedBet}
        onCloseBetPlacement={() => setShowBetPlacement(false)}
        onInsufficientFunds={handleInsufficientFunds}
        showInsufficientFunds={showInsufficientFunds}
        currentBalance={credits?.balance || 0}
        insufficientFundsAmount={insufficientFundsAmount}
        onCloseInsufficientFunds={() => setShowInsufficientFunds(false)}
        onDeposit={handleDepositModalOpen}
        showDeposit={showDeposit}
        onCloseDeposit={() => setShowDeposit(false)}
        depositFn={deposit}
        isDepositing={isDepositing}
      />
    </div>
  );
};

export default LiveEvents;
