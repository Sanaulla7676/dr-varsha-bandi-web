import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  clinicName?: string;
  clinicAddress?: string;
  profilePhoto?: string;
  googleTokens?: {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  };
  theme?: 'light' | 'dark';
}

export interface AuthState {
  doctor: Doctor | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, doctor: Doctor) => void;
  logout: () => void;
  updateDoctor: (data: Partial<Doctor>) => void;
}

export interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: any[];
  addNotification: (n: any) => void;
  clearNotifications: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (token, refreshToken, doctor) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        set({ token, refreshToken, doctor, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('doctor');
        set({ token: null, refreshToken: null, doctor: null, isAuthenticated: false });
      },

      updateDoctor: (data) => set((state) => ({ doctor: state.doctor ? { ...state.doctor, ...data } : null })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        doctor: state.doctor,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      theme: 'dark',
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
