import { sql } from '../connection';
import type { User, CreateUserRequest } from '../../types/User';

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const result = await sql`
    INSERT INTO users (name) 
    VALUES (${userData.name}) 
    RETURNING id, name, created_at
  `;
  return result[0] as User;
};

export const getUserByName = async (name: string): Promise<User | null> => {
  const result = await sql`
    SELECT id, name, created_at 
    FROM users 
    WHERE LOWER(name) = LOWER(${name})
  `;
  return result.length > 0 ? (result[0] as User) : null;
};

export const checkUserExists = async (name: string): Promise<boolean> => {
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM users 
    WHERE LOWER(name) = LOWER(${name})
  `;
  return (result[0] as { count: string }).count > '0';
};
