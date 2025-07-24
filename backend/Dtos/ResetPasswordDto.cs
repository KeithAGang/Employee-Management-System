namespace backend.Dtos
{
    public record ResetPasswordDto(
        string Email,
        string FirstName,
        string LastName,
        string NewPassword
    );
}