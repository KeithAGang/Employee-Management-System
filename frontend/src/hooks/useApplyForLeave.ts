// src/hooks/useApplyForLeave.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { LeaveAppDto } from '@/types/dtos';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://localhost:7026/api';

export const useApplyForLeave = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, LeaveAppDto>({
    mutationFn: async (payload) => {
      // Convert YYYY-MM-DD strings to ISO 8601 UTC strings (midnight of that day)
      // This is crucial for your C# backend's DateTime parsing
      const formattedPayload = {
        ...payload,
        startDate: new Date(`${payload.startDate}T00:00:00Z`).toISOString(),
        endDate: new Date(`${payload.endDate}T00:00:00Z`).toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/employee/apply-for-leave`, formattedPayload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      // For example, if employeeProfile contains leave application summaries
      queryClient.invalidateQueries({ queryKey: ['employeeProfile'] });
      // If you had a specific query for employee's own leave applications:
      // queryClient.invalidateQueries({ queryKey: ['employeeLeaveApplications'] });
      toast.success("Leave application submitted successfully!");
    },
    onError: (err) => {
      console.error("Error applying for leave:", err);
      let errorMessage = "Failed to submit leave application.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });
};
