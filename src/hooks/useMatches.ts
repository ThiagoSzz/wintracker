import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserMatches, createMatch, updateMatch, updateMatchOpponentName, deleteMatch, deleteMultipleMatches } from '../database/queries/matches';
import type { Match, CreateMatchRequest, UpdateMatchRequest } from '../types/Match';

export const useGetUserMatches = (userId: number | null) => {
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: () => getUserMatches(userId!),
    enabled: !!userId,
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (matchData: CreateMatchRequest) => createMatch(matchData),
    onMutate: async (matchData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['matches', matchData.user_id] });

      // Snapshot the previous value
      const previousMatches = queryClient.getQueryData(['matches', matchData.user_id]);

      // Optimistically add the new match
      const tempMatch: Match = {
        id: Date.now(), // Temporary ID
        user_id: matchData.user_id,
        opponent_name: matchData.opponent_name,
        wins: matchData.wins || 0,
        losses: matchData.losses || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(['matches', matchData.user_id], (old: Match[] | undefined) => {
        if (!old) return [tempMatch];
        return [...old, tempMatch];
      });

      return { previousMatches, userId: matchData.user_id, tempMatch };
    },
    onSuccess: (data, _variables, context) => {
      // Replace the temp match with the real one from the server
      queryClient.setQueryData(['matches', data.user_id], (old: Match[] | undefined) => {
        if (!old) return [data];
        return old.map(match => 
          match.id === context?.tempMatch.id ? data : match
        );
      });
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMatches) {
        queryClient.setQueryData(['matches', context.userId], context.previousMatches);
      }
    },
  });
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId, updateData }: { matchId: number; updateData: UpdateMatchRequest }) => 
      updateMatch(matchId, updateData),
    onMutate: async ({ matchId, updateData }) => {
      // Find the user_id from the existing matches data
      const existingMatches = queryClient.getQueriesData({ queryKey: ['matches'] });
      let userId: number | null = null;
      
      for (const [, data] of existingMatches) {
        if (Array.isArray(data)) {
          const match = data.find((m: Match) => m.id === matchId);
          if (match) {
            userId = match.user_id;
            break;
          }
        }
      }

      if (!userId) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['matches', userId] });

      // Snapshot the previous value
      const previousMatches = queryClient.getQueryData(['matches', userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['matches', userId], (old: Match[] | undefined) => {
        if (!old) return [];
        return old.map(match => 
          match.id === matchId 
            ? { ...match, ...updateData, updated_at: new Date().toISOString() }
            : match
        );
      });

      // Return a context object with the snapshotted value
      return { previousMatches, userId };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMatches && context?.userId) {
        queryClient.setQueryData(['matches', context.userId], context.previousMatches);
      }
    },
  });
};

export const useUpdateMatchOpponentName = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId, opponentName }: { matchId: number; opponentName: string }) => 
      updateMatchOpponentName(matchId, opponentName),
    onMutate: async ({ matchId, opponentName }) => {
      // Find the user_id from the existing matches data
      const existingMatches = queryClient.getQueriesData({ queryKey: ['matches'] });
      let userId: number | null = null;
      
      for (const [, data] of existingMatches) {
        if (Array.isArray(data)) {
          const match = data.find((m: Match) => m.id === matchId);
          if (match) {
            userId = match.user_id;
            break;
          }
        }
      }

      if (!userId) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['matches', userId] });

      // Snapshot the previous value
      const previousMatches = queryClient.getQueryData(['matches', userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['matches', userId], (old: Match[] | undefined) => {
        if (!old) return [];
        return old.map(match => 
          match.id === matchId 
            ? { ...match, opponent_name: opponentName, updated_at: new Date().toISOString() }
            : match
        );
      });

      // Return a context object with the snapshotted value
      return { previousMatches, userId };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMatches && context?.userId) {
        queryClient.setQueryData(['matches', context.userId], context.previousMatches);
      }
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId }: { matchId: number; userId: number }) => deleteMatch(matchId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches', variables.userId] });
    },
  });
};

export const useDeleteMultipleMatches = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchIds }: { matchIds: number[]; userId: number }) => deleteMultipleMatches(matchIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches', variables.userId] });
    },
  });
};
