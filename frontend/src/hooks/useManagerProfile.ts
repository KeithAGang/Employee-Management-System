import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ManagerProfileDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useManagerProfile = () => {
  return useQuery<ManagerProfileDto, Error>({
    queryKey: ['managerProfile'], // Unique key for caching this data
    queryFn: async () => {
      const response = await axios.get<ManagerProfileDto>(`${API_BASE_URL}/manager/get-profile`, {
        withCredentials: true, // Send the HttpOnly cookie
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    // cacheTime: 10 * 60 * 1000, // Default is 5 minutes, keep data in cache for 10 minutes after inactive
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};