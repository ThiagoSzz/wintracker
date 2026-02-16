import { createContext, useContext, ReactNode, useState } from 'react';

interface WinLossContextValue {
  hasChanges: boolean;
  isHelpMode: boolean;
  currentStep?: {
    id: string;
    label: string;
  };
  isRemoveMode: boolean;
  toggleRemoveMode: () => void;
  exitRemoveMode: () => void;
  setHelpMode: (isHelpMode: boolean, currentStep?: { id: string; label: string }) => void;
}

const WinLossContext = createContext<WinLossContextValue | undefined>(undefined);

interface WinLossProviderProps {
  children: ReactNode;
  hasChanges: boolean;
  isRemoveMode: boolean;
  toggleRemoveMode: () => void;
  exitRemoveMode: () => void;
}

export const WinLossProvider = ({ 
  children, 
  hasChanges, 
  isRemoveMode, 
  toggleRemoveMode, 
  exitRemoveMode 
}: WinLossProviderProps) => {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<{ id: string; label: string } | undefined>(undefined);

  const setHelpMode = (helpMode: boolean, step?: { id: string; label: string }) => {
    setIsHelpMode(helpMode);
    setCurrentStep(step);
  };

  const value: WinLossContextValue = {
    hasChanges,
    isHelpMode,
    currentStep,
    isRemoveMode,
    toggleRemoveMode,
    exitRemoveMode,
    setHelpMode,
  };

  return (
    <WinLossContext.Provider value={value}>
      {children}
    </WinLossContext.Provider>
  );
};

export const useWinLossContext = () => {
  const context = useContext(WinLossContext);
  if (context === undefined) {
    throw new Error('useWinLossContext must be used within a WinLossProvider');
  }
  return context;
};