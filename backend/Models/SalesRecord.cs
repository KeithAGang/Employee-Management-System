namespace backend.Models
{
    public class SalesRecord
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; } // Foreign Key to Employee.UserId
        public Employee Employee { get; set; } = null!; // Navigation property

        public required string CustomerName { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }
}