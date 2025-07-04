
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
  const { upcomingEvents } = useUpcomingEvents();
  const { credits, deposit, isDepositing, checkSufficientFunds } = useEnhancedCredits();
  
  // Get categories for live events
  const { sportsCategories: liveSportsCategories, getSportLabel } = useSportCategories(liveEvents);
  
  // Get categories for upcoming events
  const { sportsCategories: upcomingSportsCategories } = useSportCategories(upcomingEvents);

  // Use the correct categories based on active tab
  const currentCategories = activeTab === 'live' ? liveSportsCategories : upcomingSportsCategories;

  // Filter and sort events based on active tab
  const currentEvents = activeTab === 'live' ? liveEvents : upcomingEvents;
  const sortedEvents = currentEvents
    .filter((event) => selectedCategory === "all" || event.sport === selectedCategory)
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
    setActiveTab(tab);
    // Reset category to 'all' when switching tabs to ensure valid selection
    handleCategorySelect('all');
  };

  const handlePlaceBet = (betData: any) => {
    // Check if this is an insufficient funds case
    if (betData.insufficientFunds) {
      handleInsufficientFunds(betData.stake || 50);
      return;
    }

    // Check sufficient funds with the actual stake amount
    const stakeAmount = betData.stake || 50;
    if (!checkSufficientFunds(stakeAmount)) {
      handleInsufficientFunds(stakeAmount);
      return;
    }

    setSelectedBet(betData);
    setShowBetPlacement(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-foreground relative">
      <CanvasBackground />
      <Header />

      <div className="relative z-10 h-[calc(100vh-4rem)] flex flex-col bg-slate-950">
        <LiveEventsHeader
          sortedEventsLength={sortedEvents.length}
          availableMarkets={availableMarkets}
          uniqueSportsLength={uniqueSportsLength}
        />
        
        <div className="flex bg-slate-950">
          <LiveEventsSidebar
            categoryFilters={currentCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <div className="flex-1 max-h-[calc(100vh-8rem)] overflow-y-auto bg-slate-950">
            <LiveEventsContent
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              sortedEvents={sortedEvents}
              selectedCategory={selectedCategory}
              getSportLabel={getSportLabel}
              uniqueSportsLength={uniqueSportsLength}
              onEventClick={handleEventClick}
              onPlaceBet={handlePlaceBet}
              onRefresh={refreshEvents}
              onCategoryChange={handleCategorySelect}
              upcomingSportsCategories={upcomingSportsCategories}
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
