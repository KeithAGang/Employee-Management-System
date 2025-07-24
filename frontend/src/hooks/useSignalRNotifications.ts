// src/hooks/useSignalRNotifications.ts
import { useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import toast from 'react-hot-toast';

// Define the expected structure of the notification payload from the backend
interface SendNotificationDto {
  message: string;
  isRead: boolean;
}

const API_BASE_URL = 'https://localhost:7026/api';

export const useSignalRNotifications = () => {
  useEffect(() => {
    let connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/notifications`, {
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR: Connection established.');

        connection.on('SendNotification', (notificationPayload: SendNotificationDto) => {
          console.log('SignalR: Received notification payload:', notificationPayload);

          // Now access the 'message' property from the received object
          if (notificationPayload && typeof notificationPayload.message === 'string' && notificationPayload.message.length > 0) {
            toast.success(notificationPayload.message, {
              duration: 5000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '0.5rem',
              },
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            });
            console.log('SignalR: Toast attempt made for message:', notificationPayload.message);
          } else {
            console.warn('SignalR: Received empty or invalid message payload, not toasting.', notificationPayload);
          }
        });
      })
      .catch(err => console.error('SignalR: Connection error:', err));

    return () => {
      connection.stop()
        .then(() => console.log('SignalR: Connection stopped.'))
        .catch(err => console.error('SignalR: Error stopping connection:', err));
    };
  }, []);
};
