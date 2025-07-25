import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaveApplicationDto {
  applicationId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface EmployeeProfileDto {
  fullName: string;
  email: string;
  position: string;
  jobTitle: string;
  dateHired: string;
  managerName: string | null;
  managerEmail: string | null;
  leaveApplications: LeaveApplicationDto[];
  notifications: any[];
  leaveDaysTaken: number;
  totalLeaveDays: number;
}

const API_BASE_URL = 'https://localhost:7026/api';

interface UseSubordinateProfileOptions {
  subordinateEmail: string;
  enabled?: boolean;
}

export const useSubordinateProfile = ({ subordinateEmail, enabled = true }: UseSubordinateProfileOptions) => {
  return useQuery<EmployeeProfileDto, Error>({
    queryKey: ['subordinateProfile', subordinateEmail],
    queryFn: async () => {
      const response = await axios.get<EmployeeProfileDto>(
        `${API_BASE_URL}/Manager/get-employee-profile?email=${subordinateEmail}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    enabled: enabled && !!subordinateEmail,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

interface EmployeeProfileCardProps {
  subordinateEmail: string;
}

export function EmployeeProfileCard({ subordinateEmail }: EmployeeProfileCardProps) {
  const { data: employeeProfile, isLoading, isError, error } = useSubordinateProfile({ subordinateEmail });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8">
        <p className="text-gray-700 text-lg">Loading employee profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8 text-red-600">
        <p>Error loading profile: {error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!employeeProfile) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8 text-gray-700">
        <p className="text-gray-600 text-center py-4">No employee profile data available.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8 w-full p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">Employee Profile: {employeeProfile.fullName}</h1>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-gray-700 text-base sm:text-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Full Name:</span>
            <span>{employeeProfile.fullName}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Email:</span>
            <span>{employeeProfile.email}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Position:</span>
            <span>{employeeProfile.position}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Job Title:</span>
            <span>{employeeProfile.jobTitle}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Date Hired:</span>
            <span>{formatDate(employeeProfile.dateHired)}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Manager:</span>
            <span>{employeeProfile.managerName || 'N/A'} ({employeeProfile.managerEmail || 'N/A'})</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Leave Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-gray-700 text-base sm:text-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Leave Days Taken:</span>
            <span>{employeeProfile.leaveDaysTaken}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Total Leave Days Entitled:</span>
            <span>{employeeProfile.totalLeaveDays}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {employeeProfile.leaveApplications && employeeProfile.leaveApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Start Date</TableHead>
                  <TableHead className="text-gray-700">End Date</TableHead>
                  <TableHead className="text-gray-700">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeProfile.leaveApplications.map((app, index) => (
                  <TableRow key={app.applicationId || index} className="hover:bg-gray-100">
                    <TableCell className="font-medium text-gray-800">{formatDate(app.startDate)}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(app.endDate)}</TableCell>
                    <TableCell className="text-gray-600">{app.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 text-center py-4">No leave applications found.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {employeeProfile.notifications && employeeProfile.notifications.length > 0 ? (
            <div className="space-y-3">
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No notifications for this employee (as per current profile data).</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
