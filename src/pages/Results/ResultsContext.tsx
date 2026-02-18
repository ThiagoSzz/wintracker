import { createContext, useContext, ReactNode, useState } from 'react';

interface ResultsContextValue {
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

const ResultsContext = createContext<ResultsContextValue | undefined>(undefined);

interface ResultsProviderProps {
  children: ReactNode;
  hasChanges: boolean;
  isRemoveMode: boolean;
  toggleRemoveMode: () => void;
  exitRemoveMode: () => void;
}

export const ResultsProvider = ({ 
  children, 
  hasChanges, 
  isRemoveMode, 
  toggleRemoveMode, 
  exitRemoveMode 
}: ResultsProviderProps) => {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<{ id: string; label: string } | undefined>(undefined);

  const setHelpMode = (helpMode: boolean, step?: { id: string; label: string }) => {
    setIsHelpMode(helpMode);
    setCurrentStep(step);
  };

  const value: ResultsContextValue = {
    hasChanges,
    isHelpMode,
    currentStep,
    isRemoveMode,
    toggleRemoveMode,
    exitRemoveMode,
    setHelpMode,
  };

  return (
    <ResultsContext.Provider value={value}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResultsContext = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResultsContext must be used within a ResultsProvider');
  }
  return context;
};
