import { createContext, useContext, ReactNode } from "react";

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
}

const ResultsContext = createContext<ResultsContextValue | undefined>(
  undefined,
);

interface ResultsProviderProps {
  children: ReactNode;
  hasChanges: boolean;
  isRemoveMode: boolean;
  toggleRemoveMode: () => void;
  exitRemoveMode: () => void;
  isHelpMode: boolean;
  currentStep?: { id: string; label: string };
}

export const ResultsProvider = ({
  children,
  hasChanges,
  isRemoveMode,
  toggleRemoveMode,
  exitRemoveMode,
  isHelpMode,
  currentStep,
}: ResultsProviderProps) => {
  const value: ResultsContextValue = {
    hasChanges,
    isHelpMode,
    currentStep,
    isRemoveMode,
    toggleRemoveMode,
    exitRemoveMode,
  };

  return (
    <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
  );
};

export const useResultsContext = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error("useResultsContext must be used within a ResultsProvider");
  }
  return context;
};
