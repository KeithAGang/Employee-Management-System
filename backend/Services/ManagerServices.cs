using backend.Data;
using backend.Dtos;
using backend.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ManagerServices(ILogger<ManagerServices> logger, ApplicationDbContext dbContext)
    {
        private readonly ILogger<ManagerServices> _logger = logger;
        private readonly ApplicationDbContext _dbContext = dbContext;

        public async Task CreateManagerProfileAsync(Guid userId, CreateManagerProfileDto createManagerProfileDto)

        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new UserNotFoundException();

            var manager = new Manager
            {
                UserId = user.Id,
                OfficeLocation = createManagerProfileDto.OfficeLocation,
                Department = createManagerProfileDto.Department
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
                .FirstOrDefaultAsync(m => m.UserId == userId) ?? throw new UserNotFoundException();

            return new ManagerProfileDto(
                FirstName: manager.User.FirstName,
                LastName: manager.User.LastName,
                Email: manager.User.Email,
                Department: manager.Department,
                Subordinates: [.. manager.DirectReports.Select(e => new EmployeeShort(
                    FullName: e.User.FullName(),
                    Email: e.User.Email
                ))]
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

        public async Task<ManagerProfileDto> GetUnpromotedManagerProfile(string email)
        {
            var profile = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.User.Email == email && !m.IsActive) ?? throw new ManagerNotFoundException();

            return new ManagerProfileDto(
                FirstName: profile.User.FirstName,
                LastName: profile.User.LastName,
                Email: profile.User.Email,
                Department: profile.Department,
                Subordinates: [],
                IsActive: profile.IsActive
            );

        }

        public async Task PromoteManagerProfile(string email)
        {
            var profile = await _dbContext.Managers
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.User.Email == email && !m.IsActive) ?? throw new ManagerNotFoundException();

            profile.IsActive = true;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<EmployeeProfileDto> GetSubordinateProfileAsync(Guid managerId, string subordinateEmail)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(m => m.UserId == managerId) ?? throw new UserNotFoundException();

            var subordinate = manager.DirectReports
                .FirstOrDefault(e => e.User.Email == subordinateEmail) ?? throw new Exception("Subordinate not found");

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
                    Reason: la.Reason
                ))],
                LeaveDaysTaken: subordinate.LeaveDaysTaken,
                TotalLeaveDays: subordinate.TotalLeaveDaysEntitled
            );
        }
        
        public async Task ApproveSubordinateLeave(Guid userId, LeaveApplicationDto leaveApplicationDto)
        {
            var manager = await _dbContext.Managers
                .Include(m => m.DirectReports)
                    .ThenInclude(e => e.LeaveApplications)
                .FirstOrDefaultAsync(m => m.UserId == userId) ?? throw new UserNotFoundException();

            var subordinate = manager.DirectReports
                .FirstOrDefault(e => e.LeaveApplications
                                        .Any(l => l.EmployeeId == e.UserId)) ?? throw new UserNotFoundException();

            var leaveApplication = subordinate.LeaveApplications
                .FirstOrDefault(la => la.Id == leaveApplicationDto.ApplicationId) ?? throw new LeaveApplicationNotFoundException();

            leaveApplication.Status = LeaveStatus.Approved;

            await _dbContext.SaveChangesAsync();
        }

    }
}