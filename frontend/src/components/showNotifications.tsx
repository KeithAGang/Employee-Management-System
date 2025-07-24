import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { Separator } from "@/components/ui/separator";

export function ShowNotifications() {
  const { data: notifications, isLoading, isError, error } = useUserNotifications();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-700 text-lg">Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-4 text-red-600">
        <p>Error loading notifications: {error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No notifications found.</p>
    );
  }

  return (
    <div className="flex-col justify-center w-full">
        <h2 className="text-2xl text-black font-bold mb-2 p4">Your Notifications</h2>
      {notifications.map((notification, index) => (
        <Card
          key={index}
          className={`shadow-sm transition-colors duration-200 mb-2 ${
            notification.isRead
              ? 'bg-white border-gray-200 text-gray-700'
              : 'bg-blue-50 border-blue-200 text-blue-800 font-medium'
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className={`mb-3 ${notification.isRead ? 'bg-gray-200' : 'bg-blue-300'}`} />
            <p className="text-base">{notification.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
