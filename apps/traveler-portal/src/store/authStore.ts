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
          const response = await authApi.login({ email, password });
          const d: any = (response as any).data || response;
          const t = d.accessToken || d.token || '';
          get().login(d.user, t, d.refreshToken);
        } catch (err: any) {
          const message = err.response?.data?.message || 'Invalid email or password';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      registerWithApi: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const d: any = (response as any).data || response;
          const t = d.accessToken || d.token || '';
          get().login(d.user, t, d.refreshToken);
        } catch (err: any) {
          const message = err.response?.data?.message || 'Registration failed. Please try again.';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      demoLogin: async (role = 'traveler') => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.demoLogin(role);
          const d: any = (response as any).data || response;
          const t = d.accessToken || d.token || '';
          get().login(d.user, t, d.refreshToken);
        } catch (err: any) {
          const message = err.response?.data?.message || 'Demo login failed';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'zimvisit-auth',
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
