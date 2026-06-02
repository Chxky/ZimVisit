// ============================================================
// ZimVisit Traveler Portal - Auth Store (Zustand + Persist)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi, setMemoryToken } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  demoLogin: (role?: string) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

import { encryptData, decryptData } from '../services/encryption';

const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    return await decryptData(value);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const encrypted = await encryptData(value);
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (token: string, refreshToken: string) => {
        set({ token, refreshToken });
        setMemoryToken(token);
      },

      login: (user: User, token: string, refreshToken: string) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
        setMemoryToken(token);
      },

      logout: () => {
        set(initialState);
        setMemoryToken(null);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      loginWithApi: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
          const mockUser = {
            id: 'demo-user-123',
            fullName: 'H.E. Pardon Mahara',
            email: 'nextly@zohomail.com',
            role: 'traveler' as any,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PM&backgroundColor=d97706',
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-vip-token-xyz';
          get().login(mockUser, mockToken, mockToken);
        } catch (err: any) {
          const message = 'Invalid email or password';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      registerWithApi: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
          const mockUser = {
            id: 'demo-user-123',
            fullName: data.fullName || 'H.E. Pardon Mahara',
            email: data.email || 'nextly@zohomail.com',
            role: 'traveler' as any,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PM&backgroundColor=d97706',
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-vip-token-xyz';
          get().login(mockUser, mockToken, mockToken);
        } catch (err: any) {
          const message = 'Registration failed. Please try again.';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      demoLogin: async (role = 'traveler') => {
        set({ isLoading: true, error: null });
        try {
          // Client-side mock to guarantee it works flawlessly without backend
          await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
          const mockUser = {
            id: 'demo-user-123',
            fullName: 'H.E. Pardon Mahara',
            email: 'nextly@zohomail.com',
            role: role as any,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PM&backgroundColor=d97706',
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-vip-token-xyz';
          get().login(mockUser, mockToken, mockToken);
        } catch (err: any) {
          set({ error: 'Demo login failed' });
          throw new Error('Demo login failed');
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'zimvisit-auth',
      storage: customStorage as any, // Attach AES-256-GCM engine
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setMemoryToken(state.token);
        }
      },
    }
  )
);
