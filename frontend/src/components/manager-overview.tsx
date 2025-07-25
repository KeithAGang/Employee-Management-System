import { useManagerProfile } from '@/hooks/useManagerProfile'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "@tanstack/react-router";

export function ManagerOverviewPage() {
  const { data: managerProfile, isLoading, isError, error } = useManagerProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8">
        <p className="text-gray-700 text-lg">Loading manager profile...</p>
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

  if (!managerProfile) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8 text-gray-700">
        <p className="text-gray-600 text-center py-4">No manager profile data available.</p>
      </div>
    );
  }

  const handleEmployeeClick = (employeeEmail: string) => {
    console.log(`Clicked on employee: ${employeeEmail}`);
  };

  const handleNotificationClick = (notificationMessage: string, isRead: boolean) => {
    console.log(`Clicked on notification: "${notificationMessage}" (Read: ${isRead})`);
  };

  return (
    <div className="flex-col p-2 overflow-auto w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">Manager Dashboard Overview</h1>

      <Card className="bg-white border mb-[0.75rem] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-gray-700 text-base sm:text-lg">
          <div className="flex flex-col sm:flex-row mb2 justify-between items-start sm:items-center">
            <span className="font-medium">Name:</span>
            <span>{managerProfile.firstName} {managerProfile.lastName}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Email:</span>
            <span>{managerProfile.email}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Department:</span>
            <span>{managerProfile.department}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Office Location:</span>
            <span>{managerProfile.officeLocation === "" ? "Not Specified" : managerProfile.officeLocation}</span>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-medium">Status:</span>
            <span>{managerProfile.isActive ? "Active" : "Inactive"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border mb-[0.75rem] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">My Direct Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {managerProfile.subordinates && managerProfile.subordinates.length > 0 ? (
            <div className="space-y-3">
              {managerProfile.subordinates.map((employee, index) => (
                  <div
                  key={index}
                  className="p-3 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-800"
                  onClick={() => handleEmployeeClick(employee.email)}
                >
            <Link
              to="/manager/employee/$name"
              params={{ name: encodeURIComponent(employee.email) }}
              className="flex justify-between items-center w-full"
            >
                  <span className="font-medium text-base sm:text-lg">{employee.fullName}</span>
                  <span className="text-sm sm:text-base text-gray-600">{employee.email}</span>
                </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No direct reports found.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border mb-[0.75rem] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {managerProfile.notifications && managerProfile.notifications.length > 0 ? (
            <div className="space-y-3">
              {managerProfile.notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border text-gray-700 cursor-pointer transition-colors ${
                    notification.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200 font-medium'
                  }`}
                  onClick={() => handleNotificationClick(notification.message, notification.isRead)}
                >
                  <p className="text-base sm:text-lg">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.isRead ? 'Read' : 'Unread'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
