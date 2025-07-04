
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
  upcomingSportsCategories
}: LiveEventsContentProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBetType, setSelectedBetType] = useState<string>('');
  const [showingProgressiveResults, setShowingProgressiveResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

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
    sortedEvents,
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
    sortedEvents: upcomingEvents,
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

  // Handle tab change and update categories
  const handleTabChange = (tab: 'live' | 'upcoming') => {
    setActiveTab(tab);
    // Reset to 'all' when switching tabs to ensure valid category
    if (tab === 'upcoming') {
      onCategoryChange('all');
    }
  };

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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col">
        {/* Always show tabs header regardless of loading state or events */}
        <LiveEventsTabsHeader
          isRefreshing={currentIsRefreshing}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          pendingBetsCount={pendingBetsCount}
          activeTab={activeTab}
          onTabChange={handleTabChange}
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

          {/* Show progressive results notice when data is available */}
          {showingProgressiveResults && (
            <div className="p-4 mb-2">
              <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-300 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    ✅ Showing {displayedLiveEvents.length} verified real live events 
                    {selectedCategory !== 'all' && ` in ${getSportLabel(selectedCategory)}`}
                    {selectedRegion !== 'all' && ` from selected region`}
                  </p>
                  {isRefreshing && (
                    <div className="flex items-center text-xs text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                      Updating with new events...
                    </div>
                  )}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {isRefreshing 
                    ? 'Adding fresh data while keeping existing events visible' 
                    : 'Results updated continuously • Auto-refresh every 5 minutes'
                  }
                </p>
              </div>
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
          {/* Show loading state during initial load */}
          {isLoadingUpcoming && (
            <div className="flex flex-col">
              <div className="p-4 text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Loading Upcoming Games from All Sports
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fetching upcoming games from multiple sports and regions...
                  </p>
                </div>
              </div>
              <UpcomingEventsLoadingState />
            </div>
          )}

          {/* Show upcoming events notice when data is available */}
          {!isLoadingUpcoming && upcomingEvents.length > 0 && (
            <div className="p-4 mb-2">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-800">
                    ✅ Showing {displayedUpcomingEvents.length} upcoming games 
                    {selectedCategory !== 'all' && ` in ${getSportLabel(selectedCategory)}`}
                    {selectedRegion !== 'all' && ` from selected region`}
                  </p>
                  {isRefreshingUpcoming && (
                    <div className="flex items-center text-xs text-green-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-2"></div>
                      Updating with new games...
                    </div>
                  )}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {isRefreshingUpcoming 
                    ? 'Adding fresh data while keeping existing games visible' 
                    : 'Results updated continuously • Auto-refresh every 5 minutes'
                  }
                </p>
              </div>
            </div>
          )}

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
