import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';
import { useCreateUser } from './useUser';
import { getUserByName } from '../database/queries/users';
import type { User } from '../types/User';

type AuthState = 'input' | 'confirming-existing' | 'confirming-new' | 'processing';

export const useUserAuth = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<AuthState>('input');
  const [error, setError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [sanitizedName, setSanitizedName] = useState<string>('');

  const { setCurrentUser } = useUserStore();
  const createUserMutation = useCreateUser();

  const checkUser = useCallback(async (inputSanitizedName: string) => {
    setState('processing');
    setError(null);
    setSanitizedName(inputSanitizedName);

    try {
      const user = await getUserByName(inputSanitizedName);
      
      if (user) {
        setFoundUser(user);
        setState('confirming-existing');
      } else {
        setState('confirming-new');
      }
    } catch {
      setError(t("networkError"));
      setState('input');
    }
  }, [t]);

  const confirmExistingUser = useCallback(() => {
    setCurrentUser(foundUser);
  }, [setCurrentUser, foundUser]);

  const confirmNewUser = useCallback(async (sanitizedName: string) => {
    setState('processing');
    
    try {
      const newUser = await createUserMutation.mutateAsync({
        name: sanitizedName,
      });
      setCurrentUser(newUser);
    } catch {
      setError(t("networkError"));
      setState('confirming-new');
    }
  }, [createUserMutation, setCurrentUser, t]);

  const goBack = useCallback(() => {
    setState('input');
    setError(null);
    setFoundUser(null);
  }, []);

  const isLoading = state === 'processing' || createUserMutation.isPending;

  return {
    state,
    error,
    foundUser,
    sanitizedName,
    isLoading,
    checkUser,
    confirmExistingUser,
    confirmNewUser,
    goBack,
  };
};