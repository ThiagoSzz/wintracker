import { useCallback } from 'react';
import {
  useCreateMatch,
  useUpdateMatch,
  useUpdateMatchOpponentName,
  useDeleteMultipleMatches,
} from './useMatches';
import type { User } from '../types/User';

interface NewMatch {
  id: string;
  opponent_name: string;
  wins: number;
  losses: number;
  isNew: true;
}

interface EditableMatch {
  id: number;
  opponent_name: string;
  wins: number;
  losses: number;
}

export const useMatchOperations = () => {
  const createMatchMutation = useCreateMatch();
  const updateMatchMutation = useUpdateMatch();
  const updateOpponentNameMutation = useUpdateMatchOpponentName();
  const deleteMultipleMatchesMutation = useDeleteMultipleMatches();

  const saveChanges = useCallback(async (
    currentUser: User,
    newMatches: NewMatch[],
    editableMatches: EditableMatch[],
    originalMatches: EditableMatch[],
    deletedMatchIds: Set<number>,
    checkDuplicate: (name: string) => boolean,
    onDuplicateFound: (name: string) => void
  ) => {
    if (deletedMatchIds.size > 0) {
      await deleteMultipleMatchesMutation.mutateAsync({
        matchIds: Array.from(deletedMatchIds),
        userId: currentUser.id,
      });
    }

    for (const newMatch of newMatches) {
      if (newMatch.opponent_name.trim()) {
        if (checkDuplicate(newMatch.opponent_name)) {
          onDuplicateFound(newMatch.opponent_name.trim());
          return false;
        }

        await createMatchMutation.mutateAsync({
          user_id: currentUser.id,
          opponent_name: newMatch.opponent_name.trim(),
          wins: newMatch.wins,
          losses: newMatch.losses,
        });
      }
    }

    for (const match of editableMatches) {
      const original = originalMatches.find((m) => m.id === match.id);
      if (original) {
        if (match.opponent_name !== original.opponent_name) {
          await updateOpponentNameMutation.mutateAsync({
            matchId: match.id,
            opponentName: match.opponent_name.trim(),
          });
        }

        if (match.wins !== original.wins || match.losses !== original.losses) {
          await updateMatchMutation.mutateAsync({
            matchId: match.id,
            updateData: { wins: match.wins, losses: match.losses },
          });
        }
      }
    }

    return true;
  }, [
    createMatchMutation,
    updateMatchMutation,
    updateOpponentNameMutation,
    deleteMultipleMatchesMutation,
  ]);

  const isLoading = 
    createMatchMutation.isPending ||
    updateMatchMutation.isPending ||
    updateOpponentNameMutation.isPending ||
    deleteMultipleMatchesMutation.isPending;

  return {
    saveChanges,
    isLoading,
  };
};