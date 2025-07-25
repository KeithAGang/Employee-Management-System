import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { EmployeeProfileDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useEmployeeProfile = () => {
  return useQuery<EmployeeProfileDto, Error>({
    queryKey: ['employeeProfile'],
    queryFn: async () => {
      const response = await axios.get<EmployeeProfileDto>(`${API_BASE_URL}/employee/profile`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
