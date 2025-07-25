namespace backend.Models
{
    public class Manager
    {
        // Primary key AND Foreign Key to User
        public Guid UserId { get; set; }

        // Navigation property back to User
        public User User { get; set; } = null!; // Required navigation property

        public required string Department { get; set; }
        public string? OfficeLocation { get; set; }

        public bool IsActive { get; set; }

        // Navigation property for direct reports (One-to-Many: One Manager to Many Employees)
        // This collection allows you to easily get all employees managed by this manager.
        public ICollection<Employee> DirectReports { get; set; } = new List<Employee>();

        public ICollection<LeaveApplication> LeaveApplicationsApproved { get; set; } = new List<LeaveApplication>();
    }
}