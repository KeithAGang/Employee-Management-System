using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{

    public interface INotificationsClient
    {
        Task SendNotification(SendNotificationDto notification);
    }
    
    [Authorize]
    public sealed class NotificationsHub : Hub<INotificationsClient>;
}