namespace backend.Dtos
{
    public record EmployeeProfileDto(
        string FullName,
        string Email,
        string Position,
        string JobTitle,
        DateTime DateHired,
        string? ManagerName,
        string? ManagerEmail,
        int TotalLeaveDays,
        int LeaveDaysTaken,
        ICollection<LeaveApplicationDto> LeaveApplications,
        ICollection<SendNotificationDto>? Notifications
    );

    public record UpdateEmployeeProfileDto(
        string? FirstName,
        string? LastName,
        string? Position,
        string? JobTitle
    );
}