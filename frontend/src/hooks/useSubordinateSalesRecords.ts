import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GetSalesDtoEx } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useSubordinateSalesRecords = () => {
  return useQuery<GetSalesDtoEx[], Error>({
    queryKey: ['subordinateSalesRecords'],
    queryFn: async () => {
      const response = await axios.get<GetSalesDtoEx[]>(`${API_BASE_URL}/manager/get-sales-record`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
