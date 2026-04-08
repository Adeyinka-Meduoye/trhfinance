import React, { createContext, useContext, useState, ReactNode } from 'react';
import FinanceContactModal from '../components/FinanceContactModal';

interface HelpModalContextType {
  openHelpModal: () => void;
  closeHelpModal: () => void;
}

const HelpModalContext = createContext<HelpModalContextType | undefined>(undefined);

export const HelpModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openHelpModal = () => setIsOpen(true);
  const closeHelpModal = () => setIsOpen(false);

  return (
    <HelpModalContext.Provider value={{ openHelpModal, closeHelpModal }}>
      {children}
      <FinanceContactModal isOpen={isOpen} onClose={closeHelpModal} />
    </HelpModalContext.Provider>
  );
};

export const useHelpModal = () => {
  const context = useContext(HelpModalContext);
  if (context === undefined) {
    throw new Error('useHelpModal must be used within a HelpModalProvider');
  }
  return context;
};
