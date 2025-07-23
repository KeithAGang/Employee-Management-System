using System.Security.Claims;
using backend.Data;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace backend.Services
{
    public class GetEmailFromCookieService(IHttpContextAccessor httpContextAccessor, GetIdFromCookie getIdFromCookie, ILogger<GetEmailFromCookieService> logger)
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly GetIdFromCookie _getIdFromCookie = getIdFromCookie;
        private readonly ILogger _logger = logger;

        public string GetUserEmail()
        {
            var userEmail = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value
                            ?? _httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

            if (userEmail == null)
            {
                _logger.LogError("User email claim not found in the authenticated context.");
                throw new InvalidOperationException("User email claim is missing from authenticated context.");
            }
            return userEmail;
        }

        public IEnumerable<string> GetUserRoles()
        {
            return _httpContextAccessor.HttpContext?.User.FindAll(ClaimTypes.Role).Select(c => c.Value) ?? Enumerable.Empty<string>();
        }

        public string? GetUserFullName()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
