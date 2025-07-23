using backend.Data;
using backend.Dtos;
using backend.Exceptions;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserServices(AuthTokenProcessor authTokenProcessor, ApplicationDbContext dbContext, ILogger<UserServices> logger)
    {
        private readonly AuthTokenProcessor _authTokenProcessor = authTokenProcessor;
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly ILogger _logger = logger;

        public async Task<User> RegisterUserAsync(CreateUserDto createUser)
        {
            var userExists = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == createUser.Email);

            if (userExists != null)
            {
                throw new UserAlreadyExistsException(userExists.Email);
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = createUser.FirstName,
                LastName = createUser.LastName,
                Email = createUser.Email,
                PasswordHash = ""
            };

            var passwordHash = new PasswordHasher<User>()
                .HashPassword(user, createUser.Password);

            user.PasswordHash = passwordHash;

            var (token, exptime) = _authTokenProcessor.GenerateJwtToken(user);
            var refreshToken = _authTokenProcessor.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = exptime;

            _authTokenProcessor.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", token, exptime);
            _authTokenProcessor.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, exptime);

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<UserLoginResponseDto> Login(UserLoginDto userLogin)
        {
            var user = await _dbContext.Users
                .Include(u => u.ManagerProfile)
                .Include(u => u.EmployeeProfile)
                .FirstOrDefaultAsync(u => u.Email == userLogin.Email) ?? throw new UserDetailsException();

            var passwordHash = new PasswordHasher<User>()
                .VerifyHashedPassword(user, user.PasswordHash, userLogin.Password);

            if (passwordHash == PasswordVerificationResult.Failed)
            {
                throw new UserDetailsException();
            }

            var (token, exptime) = _authTokenProcessor.GenerateJwtToken(user);
            var refreshToken = _authTokenProcessor.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = exptime;
            
            await _dbContext.SaveChangesAsync();

            _authTokenProcessor.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", token, exptime);
            _authTokenProcessor.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, exptime);

            string role = user.ManagerProfile != null ? "Manager"
                : user.EmployeeProfile != null ? "Employee"
                : "User"; // fallback/default

            _logger.LogInformation($"User {user.Email} logged in with role {role}");

            return new UserLoginResponseDto(
                user.FullName(),
                role
            );
            
        }
    }
}