import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GetSalesDto } from '@/types/dtos';

const API_BASE_URL = 'https://localhost:7026/api';

export const useSalesRecord = (salesRecordId: string) => {
  return useQuery<GetSalesDto, Error>({
    queryKey: ['salesRecord', salesRecordId],
    queryFn: async () => {
      const response = await axios.get<GetSalesDto>(`${API_BASE_URL}/employee/sales-records/${salesRecordId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!salesRecordId,
    staleTime: 5 * 60 * 1000,
  });
};
