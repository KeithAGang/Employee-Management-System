namespace backend.Dtos
{
    public record LeaveApplicationDto(
        DateTime StartDate,
        DateTime EndDate,
        string Reason,
        Guid? ApplicationId
    );

    public record ApproveLeaveApplicationDto(
        Guid ApplicationId,
        string email
    );

    public record LeaveApplicationIdDto(
        Guid ApplicationId
    );
}