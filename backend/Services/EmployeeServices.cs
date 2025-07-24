using backend.Data;
using backend.Dtos;
using backend.Exceptions;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class EmployeeServices
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<NotificationsHub, INotificationsClient> _hub;

        public EmployeeServices(ApplicationDbContext dbContext, IHubContext<NotificationsHub, INotificationsClient> hub)
        {
            _dbContext = dbContext;
            _hub = hub;
        }

        public async Task CreateEmployeeProfileAsync(Guid userId, CreateUserProfileDto createUserProfileDto)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new UserNotFoundException();

            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.User.Email == createUserProfileDto.ManagerEmail) ?? throw new ManagerNotFoundException();

            var employee = new Employee
            {
                UserId = user.Id,
                Position = createUserProfileDto.Position,
                JobTitle = createUserProfileDto.JobTitle,
                DateHired = DateTime.SpecifyKind(createUserProfileDto.DateHired, DateTimeKind.Utc),
                ManagerId = manager.UserId,
                TotalLeaveDaysEntitled = 20
            };

            await _dbContext.Employees.AddAsync(employee);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<EmployeeProfileDto> GetEmployeeProfileAsync(Guid userId)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            var manager = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == employee.ManagerId);

            return new EmployeeProfileDto(
                FullName: employee.User.FullName(),
                Email: employee.User.Email,
                Position: employee.Position,
                JobTitle: employee.JobTitle,
                DateHired: employee.DateHired,
                ManagerName: manager?.User.FullName() ?? "No Manager Assigned",
                ManagerEmail: manager?.User.Email ?? "No Manager Assigned",
                TotalLeaveDays: employee.TotalLeaveDaysEntitled,
                LeaveDaysTaken: employee.LeaveDaysTaken,
                LeaveApplications: await _dbContext.LeaveApplications
                    .Where(la => la.EmployeeId == employee.UserId)
                    .Select(la => new LeaveApplicationDto(
                        la.StartDate,
                        la.EndDate,
                        la.Reason,
                        la.Status,
                        null
                    )).ToListAsync(),
                Notifications: await _dbContext.Notifications
                    .Where(n => n.RecipientId == employee.UserId)
                    .Select(n => new SendNotificationDto(
                        n.Message,
                        n.IsRead
                    )).ToListAsync()
            );
        }

        public async Task UpdateProfileAsync(Guid userId, UpdateEmployeeProfileDto updateProfileDto)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            employee.User.FirstName = updateProfileDto.FirstName ?? employee.User.FirstName;
            employee.User.LastName = updateProfileDto.LastName ?? employee.User.LastName;
            employee.Position = updateProfileDto.Position ?? employee.Position;
            employee.JobTitle = updateProfileDto.JobTitle ?? employee.JobTitle;

            await _dbContext.SaveChangesAsync();

        }

        public async Task ApplyForLeaveAsync(Guid userId, LeaveAppDto leaveApplicationDto)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .Include(e => e.Manager)
                .Include(e => e.Manager!.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            if (employee.Manager?.User == null)
            {
                throw new InvalidOperationException("Employee does not have a manager assigned.");
            }

            var leaveApplication = new LeaveApplication
            {
                EmployeeId = employee.UserId,
                StartDate = leaveApplicationDto.StartDate,
                EndDate = leaveApplicationDto.EndDate,
                Reason = leaveApplicationDto.Reason,
                Status = LeaveStatus.Pending
            };

            await _dbContext.LeaveApplications.AddAsync(leaveApplication);

            var notification = new SendNotificationDto(
                Message: $"Leave application submitted by {employee.User.FullName()} from {leaveApplicationDto.StartDate.ToShortDateString()} to {leaveApplicationDto.EndDate.ToShortDateString()}",
                IsRead: false
            );

            await _dbContext.Notifications.AddAsync(new Notification
            {
                RecipientId = employee.Manager.UserId,
                Message = notification.Message,
                Type = NotificationType.LeaveApplicationSubmitted,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityId = leaveApplication.Id,
                RelatedEntityType = "LeaveApplication"
            });

            await _dbContext.SaveChangesAsync();

            await _hub.Clients.User(employee.Manager!.User.Email)
                .SendNotification(notification);
        }

        public async Task RecordSalesAsync(Guid userId, CreateSalesDto createSalesDto)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            var salesRecord = new SalesRecord
            {
                EmployeeId = employee.UserId,
                CustomerName = createSalesDto.CustomerName,
                ProductName = createSalesDto.ProductName,
                TotalAmount = createSalesDto.UnitPrice * createSalesDto.Quantity,
                Quantity = createSalesDto.Quantity,
                SaleDate = createSalesDto.SaleDate,
                Notes = createSalesDto.Notes
            };

            await _dbContext.SalesRecords.AddAsync(salesRecord);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateSalesAsync(Guid userId, UpdateSalesDto updateSalesDto)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            var salesRecord = await _dbContext.SalesRecords
                .FirstOrDefaultAsync(sr => sr.EmployeeId == employee.UserId && sr.Id == updateSalesDto.SalesRecordId) ?? throw new SalesRecordNotFoundException();

            salesRecord.ProductName = updateSalesDto.ProductName ?? salesRecord.ProductName;
            salesRecord.Notes = updateSalesDto.Notes ?? salesRecord.Notes;

            var sendNotification = new SendNotificationDto(
                Message: $"Sales record updated for {employee.User.FullName()} on {salesRecord.SaleDate.ToShortDateString()}",
                IsRead: false
            );

            var notification = new Notification
            {
                RecipientId = employee.UserId,
                Message = sendNotification.Message,
                Type = NotificationType.NewSalesRecord,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityId = salesRecord.Id,
                RelatedEntityType = "SalesRecord"
            };

            await _dbContext.SaveChangesAsync();

            await _hub.Clients.User(employee.User.Email)
                .SendNotification(sendNotification);
        }

        public async Task<ICollection<GetSalesDto>> GetSalesRecordsAsync(Guid userId)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            return await _dbContext.SalesRecords
                .Where(sr => sr.EmployeeId == employee.UserId)
                .Select(sr => new GetSalesDto(
                    sr.Id,
                    sr.CustomerName,
                    sr.SaleDate,
                    sr.Quantity,
                    sr.UnitPrice,
                    sr.TotalAmount,
                    sr.Notes
                ))
                .ToListAsync();
        }
    }
}