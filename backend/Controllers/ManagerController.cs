using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Dtos;
using backend.Exceptions;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize()]
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

        [HttpPut("update-profile")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateManagerProfile(UpdateManagerProfileDto request)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _managerServices.UpdateManagerProfileAsync(userIdGuid, request);
                return Ok(new { message = "Manager profile created successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while updating manager profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("get-profile")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetManagerProfile()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var profile = await _managerServices.GetManagerProfileAsync(userIdGuid);
                return Ok(profile);
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while updating manager profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("get-unpromoted-managers")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetUnpromotedManagerProfiles()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var profiles = await _managerServices.GetUnpromotedManagerProfile(userIdGuid);
                return Ok(profiles);
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Managers not found.");
                return NotFound(new { message = "No Unpromoted Managers Found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("promote-manager")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> PromoteManagerProfile(string email)
        {
            try
            {
                await _managerServices.PromoteManagerProfile(email);
                return Ok(new { message = "Successfully Promoted Manager!" });
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Managers not found.");
                return NotFound(new { message = "No Unpromoted Managers Found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("get-employee-profile")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetEmployeeProfile(string email)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var profile = await _managerServices.GetSubordinateProfileAsync(userIdGuid, email);
                return Ok(profile);
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Managers not found.");
                return NotFound(new { message = "No Unpromoted Managers Found." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "Subordinate Not Found");
                return NotFound(new { message = "Subordinate Not Found!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("approve-leave")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> ApproveLeave(LeaveApplicationIdDto leaveApplicationIdDto)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _managerServices.ApproveSubordinateLeave(userIdGuid, leaveApplicationIdDto);
                return Ok(new { message = "Successfully Approved Leave" });
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Managers not found.");
                return NotFound(new { message = "No Unpromoted Managers Found." });
            }
            catch (LeaveApplicationNotFoundException ex)
            {
                _logger.LogError(ex, "Leave Application not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the manager profile.");
                return StatusCode(500, "Internal server error");
            }
        }
        
        [HttpGet("get-sales-record")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllSalesRecords()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var response = await _managerServices.GetSubordiantesSalesRecordsAsync(userIdGuid);
                return Ok( response );
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Managers not found.");
                return NotFound(new { message = "No Unpromoted Managers Found." });
            }
            catch (LeaveApplicationNotFoundException ex)
            {
                _logger.LogError(ex, "Leave Application not found.");
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