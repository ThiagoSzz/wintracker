import { sql } from '../connection';
import type { Match, CreateMatchRequest, UpdateMatchRequest } from '../../types';

export const getUserMatches = async (userId: number): Promise<Match[]> => {
  const result = await sql`
    SELECT id, user_id, opponent_name, wins, losses, created_at, updated_at
    FROM matches 
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `;
  return result as Match[];
};

export const createMatch = async (matchData: CreateMatchRequest): Promise<Match> => {
  const result = await sql`
    INSERT INTO matches (user_id, opponent_name, wins, losses) 
    VALUES (${matchData.user_id}, ${matchData.opponent_name}, ${matchData.wins || 0}, ${matchData.losses || 0})
    RETURNING id, user_id, opponent_name, wins, losses, created_at, updated_at
  `;
  return result[0] as Match;
};

export const updateMatch = async (matchId: number, updateData: UpdateMatchRequest): Promise<Match> => {
  const result = await sql`
    UPDATE matches 
    SET wins = ${updateData.wins}, losses = ${updateData.losses}, updated_at = NOW()
    WHERE id = ${matchId}
    RETURNING id, user_id, opponent_name, wins, losses, created_at, updated_at
  `;
  return result[0] as Match;
};

export const updateMatchOpponentName = async (matchId: number, opponentName: string): Promise<Match> => {
  const result = await sql`
    UPDATE matches 
    SET opponent_name = ${opponentName}, updated_at = NOW()
    WHERE id = ${matchId}
    RETURNING id, user_id, opponent_name, wins, losses, created_at, updated_at
  `;
  return result[0] as Match;
};

export const deleteMatch = async (matchId: number): Promise<void> => {
  await sql`
    DELETE FROM matches 
    WHERE id = ${matchId}
  `;
};

export const deleteMultipleMatches = async (matchIds: number[]): Promise<void> => {
  if (matchIds.length === 0) return;
  
  await sql`
    DELETE FROM matches 
    WHERE id = ANY(${matchIds})
  `;
};
