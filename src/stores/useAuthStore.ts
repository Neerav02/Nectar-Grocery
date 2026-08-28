import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLocation, UserProfile } from '../types';

interface AuthState {
  hasCompletedOnboarding: boolean;
  userLocation: UserLocation;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'signup' | 'phone';
  
  // Actions
  setCompletedOnboarding: (completed: boolean) => void;
  setUserLocation: (location: Partial<UserLocation>) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  openAuthModal: (view?: 'login' | 'signup' | 'phone') => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      userLocation: {
        zone: 'Bengaluru',
        area: 'Indiranagar',
        city: 'Bengaluru',
      },
      userProfile: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalView: 'login',

      setCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      setUserLocation: (location) =>
        set((state) => ({
          userLocation: { ...state.userLocation, ...location },
        })),
      login: (email, name = 'Valued Customer') =>
        set({
          isAuthenticated: true,
          userProfile: {
            name,
            email,
            phone: '+91 98765 43210',
          },
          isAuthModalOpen: false,
        }),
      logout: () => set({ isAuthenticated: false, userProfile: null }),
      openAuthModal: (view = 'login') => set({ isAuthModalOpen: true, authModalView: view }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: 'nectar_auth_storage',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        userLocation: state.userLocation,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
