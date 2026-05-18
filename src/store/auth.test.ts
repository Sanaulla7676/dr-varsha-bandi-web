import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './index';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store state before each test
    localStorage.clear();
    useAuthStore.setState({
      doctor: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  it('should initialize with correct default state', () => {
    const state = useAuthStore.getState();
    expect(state.doctor).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should store credentials on login', () => {
    const mockDoctor = {
      id: 'doc-123',
      name: 'Dr. Varsha Bandi',
      email: 'doctor@homeopathway.com',
    };
    const mockToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';

    useAuthStore.getState().login(mockToken, mockRefreshToken, mockDoctor);

    const state = useAuthStore.getState();
    expect(state.doctor).toEqual(mockDoctor);
    expect(state.token).toBe(mockToken);
    expect(state.refreshToken).toBe(mockRefreshToken);
    expect(state.isAuthenticated).toBe(true);

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('refreshToken')).toBe(mockRefreshToken);
  });

  it('should update doctor details correctly', () => {
    const mockDoctor = {
      id: 'doc-123',
      name: 'Dr. Varsha Bandi',
      email: 'doctor@homeopathway.com',
    };
    
    useAuthStore.getState().login('token', 'refresh', mockDoctor);
    useAuthStore.getState().updateDoctor({ clinicName: 'Modern Homeopathy Clinic' });

    const state = useAuthStore.getState();
    expect(state.doctor).toEqual({
      ...mockDoctor,
      clinicName: 'Modern Homeopathy Clinic',
    });
  });

  it('should flush state and localStorage on logout', () => {
    const mockDoctor = {
      id: 'doc-123',
      name: 'Dr. Varsha Bandi',
      email: 'doctor@homeopathway.com',
    };
    
    useAuthStore.getState().login('token', 'refresh', mockDoctor);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.doctor).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
