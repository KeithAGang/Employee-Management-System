using backend.Data;
using backend.Dtos;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class LeaveDaysApproachingService(ApplicationDbContext dbContext, ILogger<LeaveDaysApproachingService> logger, IHubContext<NotificationsHub, INotificationsClient> hub)
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly ILogger<LeaveDaysApproachingService> _logger = logger;
        private readonly IHubContext<NotificationsHub, INotificationsClient> _hub = hub;

        public async Task NotifyEmployeesWithApproachingLeaveDaysAsync()
        {
            var employees = await _dbContext.Employees
                .Include(e => e.User)
                .Include(e => e.LeaveApplications)
                .Where(e => e.TotalLeaveDaysEntitled > 0)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var nextWeek = today.AddDays(7);

            foreach (var employee in employees)
            {
                var upcomingDates = employee.LeaveApplications
                    .Where(la => la.Status == LeaveStatus.Approved)
                    .SelectMany(la =>
                        Enumerable.Range(0, (la.EndDate.Date - la.StartDate.Date).Days + 1)
                            .Select(offset => la.StartDate.Date.AddDays(offset))
                    )
                    .Where(date => date >= today && date <= nextWeek)
                    .Distinct()
                    .OrderBy(date => date)
                    .ToList();

                if (upcomingDates.Any())
                {
                    var formattedDates = string.Join(", ", upcomingDates.Select(d => d.ToString("dddd (MMM dd)")));

                    var message = upcomingDates.Count == 1
                        ? $"You have approved leave on {formattedDates}."
                        : $"You have approved leave scheduled on the following days: {formattedDates}.";

                    var sendNotification = new SendNotificationDto(
                        Message: message,
                        IsRead: false
                    );

                    var notification = new Notification
                    {
                        RecipientId = employee.UserId,
                        Message = message,
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow,
                        RelatedEntityType = "LeaveApplicationApproaching"
                    };

                    await _dbContext.Notifications.AddAsync(notification);
                    await _dbContext.SaveChangesAsync();
                    
                    _logger.LogInformation("Notifying employee {Email} about approaching leave days.", employee.User.Email);

                    await _hub.Clients.User(employee.User.Email)
                        .SendNotification(sendNotification);
                }
            }
        }

    }

}