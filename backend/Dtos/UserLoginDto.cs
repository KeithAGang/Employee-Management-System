namespace backend.Dtos
{
    public record UserLoginDto(
        string Email,
        string Password
    );

    public record UserLoginResponseDto(
        string FullName,
        string Email,
        string Role
    );
}