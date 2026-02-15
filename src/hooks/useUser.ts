import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getUserByName, checkUserExists } from '../database/queries/users';
import type { CreateUserRequest } from '../types';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
  });
};

export const useGetUserByName = (name: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['user', name],
    queryFn: () => getUserByName(name),
    enabled: enabled && !!name,
  });
};

export const useCheckUserExists = () => {
  return useMutation({
    mutationFn: (name: string) => checkUserExists(name),
  });
};