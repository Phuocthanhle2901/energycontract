using Api.Services.Interfaces; // Namespace chứa Interface Service
using Api.VMs;                 // Namespace chứa LoginRequest, RegisterRequest...
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // 1. Gọi Service
        var result = await _authService.RegisterAsync(request);

        // 2. Kiểm tra kết quả
        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(new { message = "Đăng ký thành công!" });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            // Trả về 401 Unauthorized nếu sai mật khẩu/user
            return Unauthorized(new { message = result.ErrorMessage });
        }

        // Trả về cả AccessToken và RefreshToken
        return Ok(new 
        { 
            accessToken = result.AccessToken,
            refreshToken = result.RefreshToken 
        });
    }

    // POST: api/auth/refresh-token
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        // Trả về AccessToken mới
        return Ok(new { accessToken = result.AccessToken });
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] TokenRequest request)
    {
        var result = await _authService.LogoutAsync(request.RefreshToken);

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(new { message = "Đăng xuất thành công" });
    }
}