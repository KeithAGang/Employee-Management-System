import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userFullName: string | null;
  userRole: string | null; // Singular 'role' to match DTO
  
  setAuth: (
    fullName: string,
    role: string
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userFullName: null,
  userRole: null,

  setAuth: (fullName, role) => {
    set({
      isAuthenticated: true,
      userFullName: fullName,
      userRole: role,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userFullName: null,
      userRole: null,
    });
  },
}));
