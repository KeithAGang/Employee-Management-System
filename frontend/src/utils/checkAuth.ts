// src/api/auth.ts (or src/utils/auth.ts)
import axios from 'axios';
import { useAuthStore } from '@/store/authStore'; // Import your Zustand auth store

// Assuming this DTO structure from your backend's /users/me endpoint
interface CurrentUserResponseDto {
  fullName: string;
  email: string;
  role: string;
}

const API_BASE_URL = 'https://localhost:7026/api';

export const checkCurrentUserSession = async (): Promise<boolean> => {
  const authStore = useAuthStore.getState(); 

  try {
    const response = await axios.get<CurrentUserResponseDto>(`${API_BASE_URL}/user/check-me`, {
      withCredentials: true, 
    });

    authStore.setAuth(response.data.fullName, response.data.email,response.data.role);
    return true; 
  } catch (error) {
    authStore.logout();
    return false;
  }
};
