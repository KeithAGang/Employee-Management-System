import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userFullName: string | null;
  userEmail: string | null;
  userRole: string | null; // Singular 'role' to match DTO
  
  setAuth: (
    fullName: string,
    email: string,
    role: string
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userFullName: null,
  userEmail: null,
  userRole: null,

  setAuth: (fullName, email, role) => {
    set({
      isAuthenticated: true,
      userFullName: fullName,
      userEmail: email,
      userRole: role,
    });
  },

  getEmail: () => {
    const state = useAuthStore.getState();
    return state.userEmail
  },

  getFullName: () => {
    const state = useAuthStore.getState();
    return state.userFullName
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userFullName: null,
      userEmail: null,
      userRole: null,
    });
  },
}));
