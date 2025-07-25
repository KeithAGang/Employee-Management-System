import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GetSalesDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useEmployeeSalesRecords = () => {
  return useQuery<GetSalesDto[], Error>({
    queryKey: ['employeeSalesRecords'],
    queryFn: async () => {
      const response = await axios.get<GetSalesDto[]>(`${API_BASE_URL}/employee/sales-records`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
