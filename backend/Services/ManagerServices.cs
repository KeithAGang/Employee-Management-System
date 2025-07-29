using backend.Data;
using backend.Dtos;
using backend.Exceptions;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ManagerServices(ILogger<ManagerServices> logger, ApplicationDbContext dbContext, IHubContext<NotificationsHub, INotificationsClient> hub)
    {
        private readonly ILogger<ManagerServices> _logger = logger;
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly IHubContext<NotificationsHub, INotificationsClient> _hub = hub;

        public async Task CreateManagerProfileAsync(Guid userId, CreateManagerProfileDto createManagerProfileDto)

        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new UserNotFoundException();

            var manager = new Manager
            {
                UserId = user.Id,
                OfficeLocation = createManagerProfileDto.OfficeLocation,
                Department = createManagerProfileDto.Department,
                IsActive = false
            };

            await _dbContext.Managers.AddAsync(manager);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<ManagerProfileDto> GetManagerProfileAsync(Guid userId)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.User)
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.LeaveApplications)
                .FirstOrDefaultAsync(m => m.UserId == userId) ?? throw new UserNotFoundException();

            return new ManagerProfileDto(
                FirstName: manager.User.FirstName,
                LastName: manager.User.LastName,
                Email: manager.User.Email,
                Department: manager.Department,
                OfficeLocation: manager.OfficeLocation ?? "",
                Subordinates: [.. manager.DirectReports.Select(e => new EmployeeShort(
                    FullName: e.User.FullName(),
                    Email: e.User.Email,
                    LeaveApplications: [.. e.LeaveApplications.Select(la => new LeaveApplicationDto(
                        la.StartDate,
                        la.EndDate,
                        la.Reason,
                        la.Status,
                        la.Id
                    ))]
                ))],
                Notifications: await _dbContext.Notifications
                    .Where(n => n.RecipientId == manager.UserId)
                    .Select(n => new SendNotificationDto(
                        n.Message,
                        n.IsRead
                    )).ToListAsync(),
                IsActive: manager.IsActive
            );
        }

        public async Task UpdateManagerProfileAsync(Guid userId, UpdateManagerProfileDto updateManagerProfileDto)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId) ?? throw new UserNotFoundException();

            manager.User.FirstName = updateManagerProfileDto.FirstName ?? manager.User.FirstName;
            manager.User.LastName = updateManagerProfileDto.LastName ?? manager.User.LastName;
            manager.Department = updateManagerProfileDto.Department ?? manager.Department;
            manager.OfficeLocation = updateManagerProfileDto.OfficeLocation ?? manager.OfficeLocation;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<ManagerProfileDto[]> GetUnpromotedManagerProfile(Guid userId)
        {
            var user = await _dbContext.Managers
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (!user!.IsActive)
            {
                return [];
            }
            
            var profiles = await _dbContext.Managers
                .Include(m => m.User)
                .Where(m => !m.IsActive)
                .ToArrayAsync();

            if (profiles.Length == 0)
                return [];

            return profiles.Select(profile => new ManagerProfileDto(
                FirstName: profile.User.FirstName,
                LastName: profile.User.LastName,
                Email: profile.User.Email,
                Department: profile.Department,
                OfficeLocation: profile.OfficeLocation ?? "",
                Subordinates: [],
                Notifications: [],
                IsActive: profile.IsActive
            )).ToArray();

        }

        public async Task PromoteManagerProfile(string email)
        {
            var profile = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.User.Email == email && !m.IsActive) ?? throw new ManagerNotFoundException();

            profile.IsActive = true;


            var sendNotification = new SendNotificationDto(
                Message: "Your manager profile has been activated.",
                IsRead: false
            );

            var notification = new Notification
            {
                RecipientId = profile.UserId,
                Message = sendNotification.Message,
                IsRead = sendNotification.IsRead,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityType = "ManagerProfileActivation"
            };

            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            await _hub.Clients.User(profile.User.Email)
                .SendNotification(sendNotification);
        }

        public async Task<EmployeeProfileDto> GetSubordinateProfileAsync(Guid managerId, string subordinateEmail)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(m => m.UserId == managerId) ?? throw new UserNotFoundException();

            var subordinate = manager.DirectReports
                .FirstOrDefault(e => e.User.Email == subordinateEmail) ?? throw new UserNotFoundException();

            return new EmployeeProfileDto(
                FullName: subordinate.User.FullName(),
                Email: subordinate.User.Email,
                Position: subordinate.Position,
                JobTitle: subordinate.JobTitle,
                DateHired: subordinate.DateHired,
                ManagerName: null,
                ManagerEmail: null,
                LeaveApplications: [.. subordinate.LeaveApplications.Select(la => new LeaveApplicationDto(
                    ApplicationId: la.Id,
                    StartDate: la.StartDate,
                    EndDate: la.EndDate,
                    Reason: la.Reason,
                    Status: la.Status
                ))],
                Notifications: [],
                LeaveDaysTaken: subordinate.LeaveDaysTaken,
                TotalLeaveDays: subordinate.TotalLeaveDaysEntitled
            );
        }

        public async Task ApproveSubordinateLeave(Guid userId, LeaveApplicationIdDto leaveApplicationDto)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.LeaveApplications)
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(m => m.UserId == userId) ?? throw new UserNotFoundException();

            var subordinate = manager.DirectReports
                .FirstOrDefault(e => e.LeaveApplications
                                        .Any(l => l.EmployeeId == e.UserId)) ?? throw new UserNotFoundException();

            var leaveApplication = subordinate.LeaveApplications
                .FirstOrDefault(la => la.Id == leaveApplicationDto.ApplicationId) ?? throw new LeaveApplicationNotFoundException();

            leaveApplication.Status = LeaveStatus.Approved;
            subordinate.TotalLeaveDaysEntitled -= 1;


            var sendNotification = new SendNotificationDto(
                Message: $"Your leave application from {leaveApplication.StartDate.ToShortDateString()} to {leaveApplication.EndDate.ToShortDateString()} has been approved.",
                IsRead: false
            );

            var notification = new Notification
            {
                RecipientId = subordinate.UserId,
                Message = sendNotification.Message,
                IsRead = sendNotification.IsRead,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityType = "LeaveApplicationApproval"
            };

            await _dbContext.Notifications.AddAsync(notification);

            await _dbContext.SaveChangesAsync();

            await _hub.Clients.User(subordinate.User.Email)
                .SendNotification(sendNotification);
        }

        public async Task<ICollection<GetSalesDtoEx>> GetSubordiantesSalesRecordsAsync(Guid userId)
        {
            var user = await _dbContext.Managers
                .Include(s => s.DirectReports)
                    .ThenInclude(u => u.User)
                .Include(s => s.DirectReports)
                    .ThenInclude(u => u.SalesRecords)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new ManagerNotFoundException();

            return [.. user.DirectReports
                .SelectMany(e => e.SalesRecords.Select(
                    sr => new GetSalesDtoEx(
                        sr.Id,
                        sr.CustomerName,
                        e.User.FullName(),
                        sr.SaleDate,
                        sr.Quantity,
                        sr.UnitPrice,
                        sr.TotalAmount,
                        sr.Notes ?? ""
                    )
                ))];
        }
    }

}