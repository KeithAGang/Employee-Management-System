import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ManagerProfileDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useUnpromotedManagers = () => {
  return useQuery<ManagerProfileDto[], Error>({
    queryKey: ['unpromotedManagers'], // Unique key for caching this list
    queryFn: async () => {
      const response = await axios.get<ManagerProfileDto[]>(`${API_BASE_URL}/manager/get-unpromoted-managers`, {
        withCredentials: true, // Send the HttpOnly cookie
      });
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // Data is fresh for 15 minutes
    refetchOnWindowFocus: true,
  });
};