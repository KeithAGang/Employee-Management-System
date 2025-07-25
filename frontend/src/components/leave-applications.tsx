import * as React from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ManagerProfileDto, LeaveApplicationIdDto, LeaveApplicationDto, EmployeeShort } from '@/types/dtos';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7026/api';

export function ManagerAllLeaveApplications() {
  const queryClient = useQueryClient();

  // Access the managerProfile directly from cache
  const managerProfile = queryClient.getQueryData<ManagerProfileDto>(['managerProfile']);

  const allLeaveApplications: (LeaveApplicationDto & { subordinateFullName: string; subordinateEmail: string })[] = React.useMemo(() => {
    if (!managerProfile || !managerProfile.subordinates) {
      return [];
    }
    return managerProfile.subordinates.flatMap((subordinate: EmployeeShort) =>
      subordinate.leaveApplications.map((app: LeaveApplicationDto) => ({
          ...app,
          subordinateFullName: subordinate.fullName,
          subordinateEmail: subordinate.email,
        }))
    );
  }, [managerProfile]);

  const { mutate: approveLeave, isPending: isApproving } = useMutation<any, Error, LeaveApplicationIdDto>({
    mutationFn: async (payload) => {
      const response = await axios.put(`${API_BASE_URL}/manager/approve-leave`, {"applicationId": payload}, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the managerProfile query to refetch fresh data after approval
      // This will cause ManagerOverviewPage and this component to re-render with updated data
      queryClient.invalidateQueries({ queryKey: ['managerProfile'] });
      // Optionally, display a success toast/message
    },
    onError: (err) => {
      console.error("Error approving leave application:", err);
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

  if (allLeaveApplications.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No leave applications found for your direct reports.</p>
    );
  }

  return (
    <div className="flex w-full justify-center p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {allLeaveApplications.map((app) => {
          let cardBgColor = 'bg-gray-50'; // Default
          let cardBorderColor = 'border-gray-200';
          let textColor = 'text-gray-800';
          let buttonVariant: "default" | "link" | "outline" | "destructive" | "secondary" | "ghost" | null | undefined = 'default';
          let buttonText = '';
          let buttonDisabled = false;

          switch (app.status) {
            case 'Approved':
              cardBgColor = 'bg-green-50';
              cardBorderColor = 'border-green-200';
              textColor = 'text-green-800';
              buttonText = 'Approved';
              buttonVariant = 'outline';
              buttonDisabled = true;
              break;
            case 'Pending':
              cardBgColor = 'bg-yellow-50';
              cardBorderColor = 'border-yellow-200';
              textColor = 'text-yellow-800';
              buttonText = isApproving ? "Approving..." : "Approve Leave";
              buttonVariant = 'default';
              buttonDisabled = isApproving;
              break;
            case 'Rejected':
              cardBgColor = 'bg-red-50';
              cardBorderColor = 'border-red-200';
              textColor = 'text-red-800';
              buttonText = 'Rejected';
              buttonVariant = 'destructive';
              buttonDisabled = true;
              break;
            case 'Cancelled':
              cardBgColor = 'bg-blue-50';
              cardBorderColor = 'border-blue-200';
              textColor = 'text-blue-800';
              buttonText = 'Cancelled';
              buttonVariant = 'secondary';
              buttonDisabled = true;
              break;
            default:
              cardBgColor = 'bg-gray-50';
              cardBorderColor = 'border-gray-200';
              textColor = 'text-gray-800';
              buttonText = 'Unknown Status';
              buttonVariant = 'outline';
              buttonDisabled = true;
              break;
          }

          return (
            <Card key={app.applicationId} className={`${cardBgColor} ${cardBorderColor} shadow-sm transition-colors duration-200`}>
              <CardHeader>
                <CardTitle className={`text-lg font-semibold ${textColor}`}>
                  Leave Request
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
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${textColor}`}>
                    {app.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
