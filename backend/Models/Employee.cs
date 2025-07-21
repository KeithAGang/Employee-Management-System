namespace backend.Models
{
    public class Employee
    {
        // Primary key AND Foreign Key to User
        public Guid UserId { get; set; }

        // Navigation property back to User
        public User User { get; set; } = null!; // Required navigation property

        public required string Position { get; set; }
        public required string JobTitle { get; set; }
        public DateTime DateHired { get; set; } // Good to add

        // Navigation property for Manager relationship (Many-to-One: Many Employees to One Manager)
        public Guid? ManagerId { get; set; } // Foreign Key to Manager's UserId (if Manager is also a User/Employee)
        public Manager? Manager { get; set; } // Nullable if an employee might not have a manager

        // Leave tracking (moved from application level to entity for consistency)
        public int TotalLeaveDaysEntitled { get; set; }
        public int LeaveDaysTaken { get; set; }

        // Collection of leave applications by this employee
        public ICollection<LeaveApplication> LeaveApplications { get; set; } = new List<LeaveApplication>();

        // For sales team app:
        public ICollection<SalesRecord> SalesRecords { get; set; } = new List<SalesRecord>();
    }
}