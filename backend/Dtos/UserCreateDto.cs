namespace backend.Dtos
{
    public record CreateUserDto(
        string FirstName,
        string LastName,
        string Email,
        string Password
    );
}