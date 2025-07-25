import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { UpdateEmployeeProfileDto } from '@/types/dtos';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://localhost:7026/api';

export const useUpdateEmployeeProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateEmployeeProfileDto>({
    mutationFn: async (payload) => {
      const response = await axios.put(`${API_BASE_URL}/employee/update-profile`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeProfile'] });
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating employee profile:", err);
      let errorMessage = "Failed to update profile.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });
};
