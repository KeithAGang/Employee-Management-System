using backend.Data;
using backend.Dtos;
using backend.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class EmployeeServices(ApplicationDbContext dbContext)
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

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
                DateHired = createUserProfileDto.DateHired,
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
                        la.Reason
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

        public async Task ApplyForLeaveAsync(Guid userId, LeaveApplicationDto leaveApplicationDto)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            var leaveApplication = new LeaveApplication
            {
                EmployeeId = employee.UserId,
                StartDate = leaveApplicationDto.StartDate,
                EndDate = leaveApplicationDto.EndDate,
                Reason = leaveApplicationDto.Reason,
                Status = LeaveStatus.Pending
            };

            await _dbContext.LeaveApplications.AddAsync(leaveApplication);
            await _dbContext.SaveChangesAsync();
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

        public async Task<ICollection<GetSalesDto>> GetSalesRecordsAsync(Guid userId)
        {
            var employee = await _dbContext.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.UserId == userId) ?? throw new UserNotFoundException();

            return await _dbContext.SalesRecords
                .Where(sr => sr.EmployeeId == employee.UserId)
                .Select(sr => new GetSalesDto(
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