import React from 'react';
import BetPlacementModal from '@/components/BetPlacementModal';
import InsufficientFundsModal from '@/components/InsufficientFundsModal';
import DepositModal from '@/components/DepositModal';
import LiveEventModal from '@/components/LiveEventModal';

interface LiveEventsModalsProps {
  // Event Modal
  showEventModal: boolean;
  selectedEvent: any;
  onCloseEventModal: () => void;
  onPlaceBet: (betData: any) => void;
  
  // Bet Placement Modal
  showBetPlacement: boolean;
  selectedBet: any;
  onCloseBetPlacement: () => void;
  onInsufficientFunds: (amount: number) => void;
  
  // Insufficient Funds Modal
  showInsufficientFunds: boolean;
  currentBalance: number;
  insufficientFundsAmount: number;
  onCloseInsufficientFunds: () => void;
  onDeposit: () => void;
  
  // Deposit Modal
  showDeposit: boolean;
  onCloseDeposit: () => void;
  depositFn: (amount: number) => void;
  isDepositing: boolean;
}

const LiveEventsModals: React.FC<LiveEventsModalsProps> = ({
  showEventModal,
  selectedEvent,
  onCloseEventModal,
  onPlaceBet,
  showBetPlacement,
  selectedBet,
  onCloseBetPlacement,
  onInsufficientFunds,
  showInsufficientFunds,
  currentBalance,
  insufficientFundsAmount,
  onCloseInsufficientFunds,
  onDeposit,
  showDeposit,
  onCloseDeposit,
  depositFn,
  isDepositing,
}) => {
  return (
    <>
      <LiveEventModal
        isOpen={showEventModal}
        onClose={onCloseEventModal}
        event={selectedEvent}
        onPlaceBet={onPlaceBet}
      />

      <BetPlacementModal
        isOpen={showBetPlacement}
        onClose={onCloseBetPlacement}
        bet={selectedBet}
        onInsufficientFunds={onInsufficientFunds}
      />

      <InsufficientFundsModal
        isOpen={showInsufficientFunds}
        onClose={onCloseInsufficientFunds}
        currentBalance={currentBalance}
        requiredAmount={insufficientFundsAmount}
        onDeposit={onDeposit}
      />

      <DepositModal
        isOpen={showDeposit}
        onClose={onCloseDeposit}
        onDeposit={depositFn}
        isLoading={isDepositing}
        currentBalance={currentBalance}
      />
    </>
  );
};

export default LiveEventsModals;