import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      doctor: null,
      token: null,
      isAuthenticated: false,

      login: (token, doctor) => {
        localStorage.setItem('token', token);
        set({ token, doctor, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('doctor');
        set({ token: null, doctor: null, isAuthenticated: false });
      },

      updateDoctor: (data) => set((state) => ({ doctor: { ...state.doctor, ...data } })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, doctor: state.doctor, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useUIStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      theme: 'dark', // 'light' or 'dark'
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      notifications: [],
      addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
      clearNotifications: () => set({ notifications: [] }),
      
      globalSearch: '',
      setGlobalSearch: (q) => set({ globalSearch: q }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
