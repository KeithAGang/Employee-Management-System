namespace backend.Dtos
{
    public record SendNotificationDto(
        string Message,
        bool IsRead
    );
}