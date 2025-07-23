using backend.Dtos;
using backend.Exceptions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserServices _userServices;

        public UserController(ILogger<UserController> logger, UserServices userServices)
        {
            _logger = logger;
            _userServices = userServices;
        }

        // Example action method to get manager details
        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserDto request)
        {
            try
            {
                return Ok(await _userServices.RegisterUserAsync(request));

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

        // Additional action methods can be added here
    }
}