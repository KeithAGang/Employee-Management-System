namespace backend.Models
{
    public class LeaveApplication
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; } // Foreign Key to Employee.UserId
        public Employee Employee { get; set; } = null!; // Navigation property

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Reason { get; set; }
        public LeaveStatus Status { get; set; } // Enum: Pending, Approved, Rejected, Cancelled

        public Guid? ApproverId { get; set; } // Foreign Key to Manager.UserId (if a manager approved it)
        public Manager? Approver { get; set; } // Navigation property to the manager who approved

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovalDate { get; set; } // Nullable until approved
    }

    public enum LeaveStatus
    {
        Pending,
        Approved,
        Rejected,
        Cancelled
    }
}