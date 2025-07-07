import React from "react";
import Header from "@/components/Header";
import CanvasBackground from "@/components/CanvasBackground";
import LiveEventsContent from "@/components/LiveEventsContent";
import LiveEventsHeader from "@/components/LiveEventsHeader";
import LiveEventsSidebar from "@/components/LiveEventsSidebar";
import LiveEventsModals from "@/components/LiveEventsModals";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { useEnhancedCredits } from "@/hooks/useEnhancedCredits";
import { useSportCategories } from "@/hooks/useSportCategories";
import { useLiveEventsState } from "@/hooks/useLiveEventsState";

const UpcomingEvents = () => {
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

  const { upcomingEvents, isLoading, isRefreshing, refreshEvents } = useUpcomingEvents();
  const { credits, deposit, isDepositing, checkSufficientFunds } = useEnhancedCredits();
  
  // Filter events based on selected category and ensure unique events
  const uniqueEvents = upcomingEvents.filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );

  const sortedEvents = uniqueEvents
    .filter((event) => {
      if (selectedCategory === "all") return true;
      const eventSport = event.sport?.toLowerCase();
      const selectedSport = selectedCategory.toLowerCase();
      return eventSport === selectedSport;
    })
    .sort((a, b) => {
      const timeA = a.timeLeft?.match(/\d+/)?.[0] || "0";
      const timeB = b.timeLeft?.match(/\d+/)?.[0] || "0";
      const timeDiff = parseInt(timeA) - parseInt(timeB);
      if (timeDiff !== 0) return timeDiff;
      return (a.league || "").localeCompare(b.league || "");
    });

  // Get categories and update counts
  const { sportsCategories: allCategories, getSportLabel } = useSportCategories(upcomingEvents);
  
  // Update counts to match exactly with displayed cards
  const categoriesWithUpdatedCounts = allCategories.map(category => {
    if (category.value === 'all') {
      return {
        ...category,
        count: uniqueEvents.length // Total unique events
      };
    }

    // Count unique events for each sport
    const sportEvents = uniqueEvents.filter(event => 
      event.sport?.toLowerCase() === category.value.toLowerCase()
    );
    
    return {
      ...category,
      count: sportEvents.length
    };
  });

  const availableMarkets = sortedEvents.filter((e) => e.betStatus === "Available").length;
  const uniqueSportsLength = [...new Set(sortedEvents.map(event => event.sport))].length;

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
    <div className="min-h-screen text-foreground relative" style={{ background: 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)' }}>
      <CanvasBackground />
      <Header />

      <div className="relative z-10 flex flex-col h-[calc(100vh-4rem)]">
        <LiveEventsHeader
          sortedEventsLength={sortedEvents.length}
          availableMarkets={availableMarkets}
          uniqueSportsLength={uniqueSportsLength}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <LiveEventsSidebar
            categoryFilters={categoriesWithUpdatedCounts}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <div className="flex-1 overflow-y-auto">
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
              upcomingSportsCategories={categoriesWithUpdatedCounts}
              activeTab="upcoming"
              onTabChange={() => {}}
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

export default UpcomingEvents; 