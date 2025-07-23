namespace backend.Dtos
{
    public record ManagerProfileDto(
        string FirstName,
        string LastName,
        string Email,
        string Department,
        ICollection<EmployeeShort> Subordinates,
        bool IsActive = true
    );

    public record EmployeeShort(
        string FullName,
        string Email
    );

     public record UpdateManagerProfileDto(
        string? FirstName,
        string? LastName,
        string? Department,
        string? OfficeLocation
    );
}