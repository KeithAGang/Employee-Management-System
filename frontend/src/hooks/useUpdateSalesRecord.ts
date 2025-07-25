import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { UpdateSalesDto } from '@/types/dtos';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://localhost:7026/api';

export const useUpdateSalesRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateSalesDto>({
    mutationFn: async (payload) => {
      const response = await axios.put(`${API_BASE_URL}/employee/update-sales`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the list of sales records
      queryClient.invalidateQueries({ queryKey: ['employeeSalesRecords'] });
      // Invalidate the specific sales record being updated
      queryClient.invalidateQueries({ queryKey: ['salesRecord', variables.salesRecordId] });
      toast.success("Sales record updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating sales record:", err);
      let errorMessage = "Failed to update sales record.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });
};
