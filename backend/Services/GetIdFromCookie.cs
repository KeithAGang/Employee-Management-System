using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Services
{
    public class GetIdFromCookie(IHttpContextAccessor httpContextAccessor, ILogger<GetIdFromCookie> logger)
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly ILogger<GetIdFromCookie> _logger = logger;
        public Guid IdFromToken()
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
         ?? _httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (userId == null)
            {
                _logger.LogError("User ID claim not found in the request.");
                throw new Exception("User ID claim is missing.");
            }

            if (!Guid.TryParse(userId, out var userIdGuid))
            {
                _logger.LogError("Invalid User ID claim value: {UserId}", userId);
                throw new Exception("Invalid User ID.");
            }

            return userIdGuid;
        }
        public DateTime GetTokenExpiry()
        {
            var expClaim = _httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;

            if (expClaim == null)
            {
            _logger.LogError("Token expiry (exp) claim not found in the request.");
            throw new Exception("Token expiry claim is missing.");
            }

            if (!long.TryParse(expClaim, out var expMinutes))
            {
            _logger.LogError("Invalid expiry claim value: {Exp}", expClaim);
            throw new Exception("Invalid expiry claim.");
            }

            var expiryDateTime = DateTimeOffset.FromUnixTimeSeconds(expMinutes * 60).UtcDateTime;
            return expiryDateTime;
        }
    }
}