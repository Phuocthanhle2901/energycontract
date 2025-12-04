using Api.VMs;

namespace Api.Services.Interfaces;

public interface IAuthService
{
    Task<RegisterResult> RegisterAsync(RegisterRequest request);
    Task<LoginResult> LoginAsync(LoginRequest request);
    Task<LogoutResult> LogoutAsync(string refreshToken);

    Task<RefreshTokenResult> RefreshTokenAsync(string refreshToken);

}