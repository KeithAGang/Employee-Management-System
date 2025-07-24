// src/components/ManagerPendingApprovalsSection.tsx
import * as React from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ManagerProfileDto, LeaveApplicationIdDto, LeaveApplicationDto, EmployeeShort } from '@/types/dtos';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://localhost:7026/api';

export function ManagerPendingApprovalsSection() {
  const queryClient = useQueryClient();

  const managerProfile = queryClient.getQueryData<ManagerProfileDto>(['managerProfile']);

  const pendingApplications: (LeaveApplicationDto & { subordinateFullName: string; subordinateEmail: string })[] = React.useMemo(() => {
    if (!managerProfile || !managerProfile.subordinates) {
      return [];
    }
    return managerProfile.subordinates.flatMap((subordinate: EmployeeShort) =>
      subordinate.leaveApplications
        .filter((app: LeaveApplicationDto) => app.status === 'Pending')
        .map((app: LeaveApplicationDto) => ({
          ...app,
          subordinateFullName: subordinate.fullName,
          subordinateEmail: subordinate.email,
        }))
    );
  }, [managerProfile]);

  const { mutate: approveLeave, isPending: isApproving } = useMutation<any, Error, LeaveApplicationIdDto>({
    mutationFn: async (payload) => {
      const response = await axios.put(`${API_BASE_URL}/manager/approve-leave`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerProfile'] });
      toast.success("Leave application approved successfully!");
    },
    onError: (err) => {
      console.error("Error approving leave application:", err);
      let errorMessage = "Failed to approve leave application.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleApprove = (applicationId: string) => {
    if (confirm("Are you sure you want to approve this leave application?")) {
      approveLeave({ applicationId });
    }
  };

  if (!managerProfile) {
    return (
      <p className="text-gray-600 text-center py-4">
        Manager profile data not available in cache.
      </p>
    );
  }

  if (pendingApplications.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No pending leave applications found.</p>
    );
  }

  return (
    <div className="flex-col justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingApplications.map((app) => (
          <Card key={app.applicationId} className="bg-yellow-50 border-yellow-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-yellow-800">
                Pending Leave Request
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                From: {app.subordinateFullName} ({app.subordinateEmail})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Dates:</span>
                <span className="text-gray-900">{formatDate(app.startDate)} - {formatDate(app.endDate)}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div>
                <span className="font-medium text-gray-700">Reason:</span>
                <p className="mt-1 text-gray-900">{app.reason}</p>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  {app.status}
                </span>
              </div>
              <Button
                onClick={() => handleApprove(app.applicationId)}
                className="w-full bg-green-600 text-white hover:bg-green-700 mt-4"
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve Leave"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
