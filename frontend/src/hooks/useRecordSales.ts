// src/hooks/useRecordSales.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CreateSalesDto } from '@/types/dtos';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://localhost:7026/api';

export const useRecordSales = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateSalesDto>({
    mutationFn: async (payload) => {
      // Convert YYYY-MM-DD string to ISO 8601 UTC string (midnight of that day)
      const formattedPayload = {
        ...payload,
        saleDate: new Date(`${payload.saleDate}T00:00:00Z`).toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/employee/record-sales`, formattedPayload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the employeeSalesRecords query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['employeeSalesRecords'] });
      toast.success("Sales record added successfully!");
    },
    onError: (err) => {
      console.error("Error recording sales:", err);
      let errorMessage = "Failed to record sales.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });
};
