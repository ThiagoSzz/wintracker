import { useState, useMemo, useCallback } from 'react';
import type { Match } from '../types/Match';

export const useDuplicateValidation = (originalMatches: Match[]) => {
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const existingOpponentNames = useMemo(
    () =>
      new Set(
        originalMatches.map((match) =>
          match.opponent_name.toLowerCase().trim(),
        ),
      ),
    [originalMatches],
  );

  const checkDuplicate = useCallback((opponentName: string) => {
    const normalizedName = opponentName.toLowerCase().trim();
    if (existingOpponentNames.has(normalizedName)) {
      setDuplicateError(opponentName.trim());
      return true;
    }
    return false;
  }, [existingOpponentNames]);

  const clearDuplicateError = useCallback(() => {
    setDuplicateError(null);
  }, []);

  return {
    duplicateError,
    checkDuplicate,
    clearDuplicateError,
  };
};