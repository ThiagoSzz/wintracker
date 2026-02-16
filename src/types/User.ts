export interface User {
  id: number;
  name: string;
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
}