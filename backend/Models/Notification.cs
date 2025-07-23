namespace backend.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public required string Message { get; set; }
        public NotificationType Type { get; set; } // Enum: LeaveApproved, LeaveApproaching, NewSalesRecord, etc.
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key to the User who receives the notification
        public Guid RecipientId { get; set; }
        public User Recipient { get; set; } = null!; // Navigation property to the recipient user

        // Optional: Link to a specific entity the notification is about
        public Guid? RelatedEntityId { get; set; } // e.g., LeaveApplicationId, SalesRecordId
        public string? RelatedEntityType { get; set; } // e.g., "LeaveApplication", "SalesRecord"
    }

    public enum NotificationType
    {
        LeaveApproved,
        LeaveRejected,
        LeaveApplicationSubmitted,
        LeaveApproaching,
        AccountActivated,
        NewSalesRecord,
        PerformanceReviewDue,
        ReportReady,
        GeneralAnnouncement
    }
}