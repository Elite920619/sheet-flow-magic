
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import LiveEventsTabsHeader from './LiveEventsTabsHeader';
import LiveEventsCardGrid from './LiveEventsCardGrid';
import LiveEventsEmptyState from './LiveEventsEmptyState';
import LiveEventsLoadingState from './LiveEventsLoadingState';
import UpcomingEventsLoadingState from './UpcomingEventsLoadingState';
import BettingOptionsModal from './BettingOptionsModal';
import { useLiveEventsFiltering } from '@/hooks/useLiveEventsFiltering';
import { useScrollHandler } from '@/hooks/useScrollHandler';
import { useBetStatusUpdater } from '@/hooks/useBetStatusUpdater';
import { useBetOddsSync } from '@/hooks/useBetOddsSync';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';

interface LiveEventsContentProps {
  isLoading: boolean;
  isRefreshing?: boolean;
  sortedEvents: any[];
  selectedCategory: string;
  getSportLabel: (sport: string) => string;
  uniqueSportsLength: number;
  onEventClick: (event: any) => void;
  onPlaceBet: (event: any, betType?: string) => void;
  onRefresh: () => void;
  onCategoryChange: (category: string) => void;
  upcomingSportsCategories: any[];
  activeTab: 'live' | 'upcoming';
  onTabChange: (tab: 'live' | 'upcoming') => void;
}

const LiveEventsContent = ({ 
  isLoading, 
  isRefreshing = false,
  sortedEvents, 
  selectedCategory, 
  getSportLabel, 
  uniqueSportsLength,
  onEventClick,
  onPlaceBet,
  onRefresh,
  onCategoryChange,
  upcomingSportsCategories,
  activeTab,
  onTabChange
}: LiveEventsContentProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBetType, setSelectedBetType] = useState<string>('');
  const [showingProgressiveResults, setShowingProgressiveResults] = useState(false);

  // Initialize bet status updater and odds sync
  const { checkBetStatuses, pendingBetsCount } = useBetStatusUpdater();
  const { syncBetData } = useBetOddsSync();

  // Upcoming events hook
  const { 
    upcomingEvents, 
    isLoading: isLoadingUpcoming, 
    isRefreshing: isRefreshingUpcoming,
    refreshEvents: refreshUpcomingEvents 
  } = useUpcomingEvents();

  // Use live events filtering for live events
  const {
    filteredEventsByRegion: filteredLiveEventsByRegion,
    displayedEvents: displayedLiveEvents,
    hasMoreEvents: hasMoreLiveEvents,
    isLoadingMore: isLoadingMoreLive,
    handleLoadMore: handleLoadMoreLive
  } = useLiveEventsFiltering({
    sortedEvents: activeTab === 'live' ? sortedEvents : [],
    selectedCategory,
    selectedRegion
  });

  // Use upcoming events filtering for upcoming events
  const {
    filteredEventsByRegion: filteredUpcomingEventsByRegion,
    displayedEvents: displayedUpcomingEvents,
    hasMoreEvents: hasMoreUpcomingEvents,
    isLoadingMore: isLoadingMoreUpcoming,
    handleLoadMore: handleLoadMoreUpcoming
  } = useLiveEventsFiltering({
    sortedEvents: activeTab === 'upcoming' ? sortedEvents : [],
    selectedCategory,
    selectedRegion
  });

  // Scroll handler for active tab
  useScrollHandler({
    hasMoreEvents: activeTab === 'live' ? hasMoreLiveEvents : hasMoreUpcomingEvents,
    isLoadingMore: activeTab === 'live' ? isLoadingMoreLive : isLoadingMoreUpcoming,
    displayedCount: activeTab === 'live' ? displayedLiveEvents.length : displayedUpcomingEvents.length,
    filteredEventsLength: activeTab === 'live' ? filteredLiveEventsByRegion.length : filteredUpcomingEventsByRegion.length,
    onLoadMore: activeTab === 'live' ? handleLoadMoreLive : handleLoadMoreUpcoming
  });

  // Monitor progressive results for live events
  useEffect(() => {
    if (!isLoading && sortedEvents.length > 0 && activeTab === 'live') {
      setShowingProgressiveResults(true);
      console.log('🚀 Progressive live results available:', {
        totalEvents: sortedEvents.length,
        displayedEvents: displayedLiveEvents.length,
        selectedCategory,
        selectedRegion
      });
    }
  }, [isLoading, sortedEvents, displayedLiveEvents, selectedCategory, selectedRegion, activeTab]);

  const handleRefresh = () => {
    console.log(`Refreshing ${activeTab} events data with progressive updates...`);
    if (activeTab === 'live') {
      onRefresh();
    } else {
      refreshUpcomingEvents();
    }
    checkBetStatuses();
    syncBetData();
  };

  const handleEventCardBet = (event: any, betType: string) => {
    setSelectedEvent(event);
    setSelectedBetType(betType);
    setShowBettingModal(true);
  };

  const handlePlaceBetFromModal = (betData: any) => {
    onPlaceBet(betData);
    setShowBettingModal(false);
  };

  // Check bet statuses and sync odds when component mounts
  useEffect(() => {
    checkBetStatuses();
    syncBetData();
  }, []);

  // Get current data and unique sports based on active tab
  const currentEvents = activeTab === 'live' ? sortedEvents : upcomingEvents;
  const currentFilteredEvents = activeTab === 'live' ? filteredLiveEventsByRegion : filteredUpcomingEventsByRegion;
  const currentDisplayedEvents = activeTab === 'live' ? displayedLiveEvents : displayedUpcomingEvents;
  const currentIsLoading = activeTab === 'live' ? isLoading : isLoadingUpcoming;
  const currentIsRefreshing = activeTab === 'live' ? isRefreshing : isRefreshingUpcoming;
  const currentHasMoreEvents = activeTab === 'live' ? hasMoreLiveEvents : hasMoreUpcomingEvents;
  const currentIsLoadingMore = activeTab === 'live' ? isLoadingMoreLive : isLoadingMoreUpcoming;
  const currentUniqueSportsLength = activeTab === 'live' ? uniqueSportsLength : [...new Set(upcomingEvents.map(event => event.sport))].length;

  return (
    <div className="flex flex-col">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col">
        {/* Always show tabs header regardless of loading state or events */}
        <LiveEventsTabsHeader
          isRefreshing={currentIsRefreshing}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          pendingBetsCount={pendingBetsCount}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        {/* Live Events Tab */}
        <TabsContent value="live" className="flex-1">
          {/* Show loading state only during initial load */}
          {isLoading && !showingProgressiveResults && (
            <div className="flex flex-col">
              <div className="p-4 text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Loading Real Events from Multiple Regions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fetching and validating live events from US, UK, EU, and AU regions...
                  </p>
                </div>
              </div>
              <LiveEventsLoadingState />
            </div>
          )}



          {/* Show events grid when we have events */}
          {!isLoading && filteredLiveEventsByRegion.length > 0 && (
            <LiveEventsCardGrid
              displayedEvents={displayedLiveEvents}
              filteredEventsLength={filteredLiveEventsByRegion.length}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              uniqueSportsLength={currentUniqueSportsLength}
              getSportLabel={getSportLabel}
              onEventCardBet={handleEventCardBet}
              isLoadingMore={isLoadingMoreLive}
              hasMoreEvents={hasMoreLiveEvents}
            />
          )}

          {/* Show empty state only when no events after loading is complete */}
          {!isLoading && !showingProgressiveResults && filteredLiveEventsByRegion.length === 0 && (
            <LiveEventsEmptyState
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              getSportLabel={getSportLabel}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          )}
        </TabsContent>

        {/* Upcoming Games Tab */}
        <TabsContent value="upcoming" className="flex-1">

          {/* Show upcoming events grid when we have events */}
          {!isLoadingUpcoming && filteredUpcomingEventsByRegion.length > 0 && (
            <LiveEventsCardGrid
              displayedEvents={displayedUpcomingEvents}
              filteredEventsLength={filteredUpcomingEventsByRegion.length}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              uniqueSportsLength={currentUniqueSportsLength}
              getSportLabel={getSportLabel}
              onEventCardBet={handleEventCardBet}
              isLoadingMore={isLoadingMoreUpcoming}
              hasMoreEvents={hasMoreUpcomingEvents}
            />
          )}

          {/* Show empty state when no upcoming events */}
          {!isLoadingUpcoming && filteredUpcomingEventsByRegion.length === 0 && (
            <LiveEventsEmptyState
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              getSportLabel={getSportLabel}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshingUpcoming}
            />
          )}
        </TabsContent>
      </Tabs>

      <BettingOptionsModal
        isOpen={showBettingModal}
        onClose={() => setShowBettingModal(false)}
        event={selectedEvent}
        betType={selectedBetType}
        onPlaceBet={handlePlaceBetFromModal}
      />
    </div>
  );
};

export default LiveEventsContent;
