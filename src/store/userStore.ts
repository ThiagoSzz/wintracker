import { create } from 'zustand';
import type { User } from '../types';

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
    // Clear URL parameters when user logs out
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('user');
    const newUrl = urlParams.toString() 
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  },
}));