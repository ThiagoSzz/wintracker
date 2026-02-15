export interface User {
  id: number;
  name: string;
  created_at: string;
}

export interface Match {
  id: number;
  user_id: number;
  opponent_name: string;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
}

export interface CreateMatchRequest {
  user_id: number;
  opponent_name: string;
  wins?: number;
  losses?: number;
}

export interface UpdateMatchRequest {
  wins: number;
  losses: number;
}