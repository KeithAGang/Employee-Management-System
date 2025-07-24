using backend.Models;

namespace backend.Dtos
{
    public record ManagerProfileDto(
        string FirstName,
        string LastName,
        string Email,
        string Department,
        string OfficeLocation,
        ICollection<EmployeeShort> Subordinates,
        ICollection<SendNotificationDto>? Notifications,
        bool IsActive = true
    );

    public record EmployeeShort(
        string FullName,
        string Email,
        ICollection<LeaveApplicationDto> LeaveApplications
    );

     public record UpdateManagerProfileDto(
        string? FirstName,
        string? LastName,
        string? Department,
        string? OfficeLocation
    );
}