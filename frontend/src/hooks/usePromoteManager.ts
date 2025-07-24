import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7026/api';

interface PromoteManagerPayload {
  email: string;
}

export const usePromoteManager = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, PromoteManagerPayload>({
    mutationFn: async (payload) => {
      // Sanitize the email by encoding it for URL use
      const encodedEmail = encodeURIComponent(payload.email);
      const url = `${API_BASE_URL}/manager/promote-manager?email=${encodedEmail}`;

      const response = await axios.put(url, {}, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['unpromotedManagers'] });
      queryClient.invalidateQueries({ queryKey: ['managerProfile'] });

      console.log(`Manager ${variables.email} promoted successfully.`);
    },
    onError: (err) => {
      console.error("Error promoting manager:", err);
      throw err;
    },
  });
};
