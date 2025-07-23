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
    public class EmployeeController(ILogger<EmployeeController> logger, EmployeeServices employeeServices, IHttpContextAccessor httpContextAccessor, GetIdFromCookie getIdFromCookie) : ControllerBase
    {
        private readonly ILogger<EmployeeController> _logger = logger;
        private readonly EmployeeServices _employeeServices = employeeServices;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly GetIdFromCookie _getIdFromCookie = getIdFromCookie;

        [HttpPost("create-profile")]
        public async Task<IActionResult> CreateEmployeeProfile(CreateUserProfileDto request)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _employeeServices.CreateEmployeeProfileAsync(userIdGuid, request);
                return Ok(new { message = "Employee profile created successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while creating employee profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (ManagerNotFoundException ex)
            {
                _logger.LogError(ex, "Manager not found while creating employee profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the employee profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetEmployeeProfile()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                return Ok(await _employeeServices.GetEmployeeProfileAsync(userIdGuid));
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while retrieving employee profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the employee profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("update-profile")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateEmployeeProfile(UpdateEmployeeProfileDto request)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _employeeServices.UpdateProfileAsync(userIdGuid, request);
                return Ok(new { message = "Employee profile updated successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while updating employee profile.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the employee profile.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("apply-for-leave")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> ApplyForLeave(LeaveApplicationDto request)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _employeeServices.ApplyForLeaveAsync(userIdGuid, request);
                return Ok(new { message = "Leave application submitted successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while retrieving sales records.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while applying for leave.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("record-sales")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> RecordSales(CreateSalesDto createSalesDto)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _employeeServices.RecordSalesAsync(userIdGuid, createSalesDto);
                return Ok(new { message = "Sales record created successfully." });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while retrieving sales records.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while recording sales.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("update-sales")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateSales(UpdateSalesDto updateSalesDto)
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                await _employeeServices.UpdateSalesAsync(userIdGuid, updateSalesDto);
                return Ok(new { message = "Sales record created successfully." });
            }
            catch (SalesRecordNotFoundException ex)
            {
                _logger.LogError(ex, "Sales Record Not Found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while recording sales.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("sales-records")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetSalesRecords()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var salesRecords = await _employeeServices.GetSalesRecordsAsync(userIdGuid);
                return Ok(salesRecords);
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogError(ex, "User not found while retrieving sales records.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving sales records.");
                return StatusCode(500, "Internal server error");
            }
        }
        

    }
}