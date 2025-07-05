import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Login
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authAPI.login(credentials);
          const { user, token } = response.data.data;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Google Login
      googleLogin: async (idToken) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authAPI.googleLogin(idToken);
          const { user, token } = response.data.data;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Google login successful!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Google login failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authAPI.register(userData);
          const { user, token } = response.data.data;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Logout
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
      },

      // Check current user
      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return false;
          }

          const response = await authAPI.getCurrentUser();
          const { user } = response.data.data;
          
          set({ user, token, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return false;
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authAPI.updateProfile(userData);
          const { user } = response.data.data;
          
          set({ user, isLoading: false });
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Profile updated successfully!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Profile update failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Refresh token
      refreshToken: async () => {
        try {
          const response = await authAPI.refreshToken();
          const { token } = response.data.data;
          
          set({ token });
          localStorage.setItem('token', token);
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // Initialize auth state
      initialize: async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          try {
            const parsedUser = JSON.parse(user);
            set({ user: parsedUser, token, isAuthenticated: true });
            
            // Verify token is still valid
            await get().checkAuth();
          } catch (error) {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore; 