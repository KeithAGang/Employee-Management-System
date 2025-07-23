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


    }
}