using backend.Dtos;
using backend.Exceptions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(ILogger<UserController> logger, UserServices userServices, GetIdFromCookie getIdFromCookie) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly UserServices _userServices = userServices;
        private readonly GetIdFromCookie _getIdFromCookie = getIdFromCookie;

        // Example action method to get manager details
        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserDto request)
        {
            try
            {
                await _userServices.RegisterUserAsync(request);
                return Ok(new { message = "User registered successfully" });

            }
            catch (UserAlreadyExistsException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering the user.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            try
            {
                var response = await _userServices.Login(request);
                return Ok(response);
            }
            catch (UserDetailsException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering the user.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("check-me")]
        [Authorize()]
        public async Task<IActionResult> CheckMe()
        {
            try
            {
                var userIdGuid = _getIdFromCookie.IdFromToken();
                var response = await _userServices.CheckMe(userIdGuid);
                return Ok(response);
            }
            catch (UserDetailsException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering the user.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
        {
            try
            {
                await _userServices.ResetPasswordAsync(request);
                return Ok(new { message = "Password reset successfully" });
            }
            catch (UserDetailsException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UserNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while resetting the password.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}