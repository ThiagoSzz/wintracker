import { create } from 'zustand';
import type { User } from '../types/User';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => {
    set({ currentUser: null });
  },
}));
