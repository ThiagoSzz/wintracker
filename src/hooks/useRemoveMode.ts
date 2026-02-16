import { useState, useCallback } from 'react';

export const useRemoveMode = () => {
  const [isRemoveMode, setIsRemoveMode] = useState(false);

  const toggleRemoveMode = useCallback(() => {
    setIsRemoveMode((prev) => !prev);
  }, []);

  const exitRemoveMode = useCallback(() => {
    setIsRemoveMode(false);
  }, []);

  return {
    isRemoveMode,
    toggleRemoveMode,
    exitRemoveMode,
  };
};