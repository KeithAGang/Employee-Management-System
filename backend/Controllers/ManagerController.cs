using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Dtos;
using backend.Exceptions;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManagerController(ILogger<ManagerController> logger, ManagerServices managerServices, IHttpContextAccessor httpContextAccessor, GetIdFromCookie getIdFromCookie) : ControllerBase
    {
        private readonly ILogger<ManagerController> _logger = logger;
        private readonly ManagerServices _managerServices = managerServices;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly GetIdFromCookie _getIdFromCookie = getIdFromCookie;

        [HttpPost("create-profile")]
        public async Task<IActionResult> CreateManagerProfile(CreateManagerProfileDto request)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _managerServices.CreateManagerProfileAsync(userIdGuid, request);
                return Ok(new { message = "Manager profile created successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while creating manager profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}