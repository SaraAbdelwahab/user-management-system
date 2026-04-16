import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // LOGIN
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const { user, accessToken, refreshToken } =
            await authService.login(credentials);

          // 🔥 CRITICAL FIX: store tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });

          return { success: false };
        }
      },

      // REGISTER
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.register(userData);

          set({ isLoading: false });

          return { success: true };
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              'Registration failed',
            isLoading: false,
          });

          return { success: false };
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {}

        // clear EVERYTHING
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // PROFILE
      fetchProfile: async () => {
        set({ isLoading: true });

        try {
          const user = await authService.getProfile();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;