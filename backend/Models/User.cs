namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }

        // Navigation properties for one-to-one relationships
        public Employee? EmployeeProfile { get; set; } // A User *might* have an Employee profile
        public Manager? ManagerProfile { get; set; }   // A User *might* have a Manager profile

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Collection of notifications for the user
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}