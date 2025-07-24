// src/hooks/useUserNotifications.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NotificationDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useUserNotifications = () => {
  return useQuery<NotificationDto[], Error>({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const response = await axios.get<NotificationDto[]>(`${API_BASE_URL}/user/notifications`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: true, // Notifications are dynamic, so refetch on focus
  });
};