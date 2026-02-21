import { useState, useEffect, useCallback, useRef } from 'react';
import type { Match } from '../types/Match';

interface EditableMatch extends Match {
  isEditing?: boolean;
  isNew?: boolean;
}

interface NewMatch extends Omit<Match, "id" | "user_id" | "created_at" | "updated_at"> {
  id: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  isNew: true;
}

export const useMatchesState = (originalMatches: Match[]) => {
  const [editableMatches, setEditableMatches] = useState<EditableMatch[]>([]);
  const [newMatches, setNewMatches] = useState<NewMatch[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [deletedMatchIds, setDeletedMatchIds] = useState<Set<number>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      setEditableMatches([...originalMatches]);
      initializedRef.current = true;
    } else {
      // Only update if the actual data changed (deep comparison of IDs)
      const currentIds = editableMatches.map(m => m.id).join(',');
      const newIds = originalMatches.map(m => m.id).join(',');
      
      if (currentIds !== newIds) {
        setEditableMatches([...originalMatches]);
      }
    }
  }, [originalMatches]);

  useEffect(() => {
    const hasEditChanges = editableMatches.some((match, index) => {
      const original = originalMatches[index];
      if (!original) return true;
      return (
        match.opponent_name !== original.opponent_name ||
        match.wins !== original.wins ||
        match.losses !== original.losses
      );
    });

    const hasNewMatchChanges = newMatches.some(
      (match) =>
        match.opponent_name.trim().length > 0 ||
        match.wins > 0 ||
        match.losses > 0,
    );
    const hasLengthChanges = editableMatches.length !== originalMatches.length;
    const hasDeletedMatches = deletedMatchIds.size > 0;

    const changes =
      hasEditChanges ||
      hasNewMatchChanges ||
      hasLengthChanges ||
      hasDeletedMatches;

    setHasChanges(changes);
  }, [editableMatches, newMatches, originalMatches, deletedMatchIds]);

  const handleMatchChange = useCallback(
    (matchId: number | string, field: string, value: string | number) => {
      if (typeof matchId === "string") {
        setNewMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, [field]: value } : match,
          ),
        );
      } else {
        setEditableMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, [field]: value } : match,
          ),
        );
      }
    },
    [],
  );

  const addNewMatch = useCallback(() => {
    const newMatch: NewMatch = {
      id: `new-${Date.now()}`,
      opponent_name: "",
      wins: 0,
      losses: 0,
      isNew: true,
    };
    setNewMatches((prev) => [...prev, newMatch]);
  }, []);

  const deleteMatch = useCallback((matchId: number) => {
    setDeletedMatchIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
    setEditableMatches((prev) => prev.filter((match) => match.id !== matchId));
  }, []);

  const resetState = useCallback(() => {
    setEditableMatches([...originalMatches]);
    setNewMatches([]);
    setDeletedMatchIds(new Set());
    setHasChanges(false);
  }, [originalMatches]);

  const clearNewMatches = useCallback(() => {
    setNewMatches([]);
  }, []);

  const removeEmptyRows = useCallback(() => {
    setNewMatches((prev) => 
      prev.filter((match) => 
        match.opponent_name.trim().length > 0 || 
        match.wins > 0 || 
        match.losses > 0
      )
    );
  }, []);

  const resetAfterSave = useCallback(() => {
    setNewMatches([]);
    setDeletedMatchIds(new Set());
    setHasChanges(false);
  }, []);

  return {
    editableMatches,
    newMatches,
    hasChanges,
    deletedMatchIds,
    handleMatchChange,
    addNewMatch,
    deleteMatch,
    resetState,
    resetAfterSave,
    clearNewMatches,
    removeEmptyRows,
  };
};