namespace backend.Dtos
{
    public record ManagerProfileDto(
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string Department,
        ICollection<EmployeeShort> Subordinates
    );

    public record EmployeeShort(
        string FullName,
        string Email
    );
}