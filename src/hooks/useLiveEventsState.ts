import { useState } from 'react';

export const useLiveEventsState = () => {
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [showBetPlacement, setShowBetPlacement] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [insufficientFundsAmount, setInsufficientFundsAmount] = useState(50);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleInsufficientFunds = (amount: number) => {
    setInsufficientFundsAmount(amount);
    setShowInsufficientFunds(true);
  };

  const handleDepositModalOpen = () => {
    setShowInsufficientFunds(false);
    setShowDeposit(true);
  };

  return {
    // State
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
    setSelectedEvent,
    selectedCategory,
    setSelectedCategory,
    insufficientFundsAmount,
    setInsufficientFundsAmount,
    
    // Handlers
    handleEventClick,
    handleCategorySelect,
    handleInsufficientFunds,
    handleDepositModalOpen,
  };
};