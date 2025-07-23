namespace backend.Dtos
{
    public record CreateUserProfileDto(
        string Position,
        string JobTitle,
        DateTime DateHired,
        string ManagerEmail
    );

    
}