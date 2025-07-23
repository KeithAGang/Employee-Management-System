namespace backend.Dtos
{
    public record LeaveApplicationDto(
        DateTime StartDate,
        DateTime EndDate,
        string Reason
    );
}