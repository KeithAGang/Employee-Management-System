using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Manager> Managers { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<LeaveApplication> LeaveApplications { get; set; } = null!;
        public DbSet<SalesRecord> SalesRecords { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- User Configurations ---
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id); // Primary Key

                entity.Property(u => u.FirstName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.LastName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(256);
                entity.HasIndex(u => u.Email).IsUnique();

                entity.Property(u => u.PasswordHash)
                      .IsRequired()
                      .HasMaxLength(512);

                entity.Property(u => u.CreatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP"); // For PostgreSQL
                
                entity.Property(u => u.UpdatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP"); // For PostgreSQL
                

                // One-to-one relationship with Employee
                entity.HasOne(u => u.EmployeeProfile)
                      .WithOne(e => e.User)
                      .HasForeignKey<Employee>(e => e.UserId) // Employee.UserId is both PK and FK
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Cascade); // If a User is deleted, delete the associated Employee profile

                // One-to-one relationship with Manager
                entity.HasOne(u => u.ManagerProfile)
                      .WithOne(m => m.User)
                      .HasForeignKey<Manager>(m => m.UserId) // Manager.UserId is both PK and FK
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Cascade); // If a User is deleted, delete the associated Manager profile

                // One-to-many relationship with Notifications
                entity.HasMany(u => u.Notifications)
                      .WithOne(n => n.Recipient)
                      .HasForeignKey(n => n.RecipientId)
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Cascade); // If a User is deleted, delete their notifications
            });

            // --- Employee Configurations ---
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.UserId); // UserId is the primary key for Employee

                entity.Property(e => e.Position)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.JobTitle)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.DateHired)
                      .IsRequired();

                // Many-to-one relationship with Manager (an Employee has one Manager)
                entity.HasOne(e => e.Manager)
                      .WithMany(m => m.DirectReports) // A Manager has many DirectReports
                      .HasForeignKey(e => e.ManagerId)
                      .IsRequired(false) // ManagerId is nullable
                      .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a Manager if they still have direct reports

                // One-to-many relationship with LeaveApplications (an Employee submits many LeaveApplications)
                entity.HasMany(e => e.LeaveApplications)
                      .WithOne(la => la.Employee)
                      .HasForeignKey(la => la.EmployeeId)
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Cascade); // If an Employee is deleted, delete their leave applications

                // One-to-many relationship with SalesRecords (an Employee makes many SalesRecords)
                entity.HasMany(e => e.SalesRecords)
                      .WithOne(sr => sr.Employee)
                      .HasForeignKey(sr => sr.EmployeeId)
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Cascade); // If an Employee is deleted, delete their sales records
            });

            // --- Manager Configurations ---
            modelBuilder.Entity<Manager>(entity =>
            {
                entity.HasKey(m => m.UserId); // UserId is the primary key for Manager

                entity.Property(m => m.Department)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(m => m.OfficeLocation)
                      .HasMaxLength(100);
                
                // One-to-many relationship with LeaveApplicationsApproved (a Manager approves many LeaveApplications)
                entity.HasMany(m => m.LeaveApplicationsApproved)
                      .WithOne(la => la.Approver)
                      .HasForeignKey(la => la.ApproverId)
                      .IsRequired(false) // ApproverId is nullable in LeaveApplication
                      .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a Manager if they have approved applications
            });

            // --- Notification Configurations ---
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.Id);

                entity.Property(n => n.Message)
                      .IsRequired()
                      .HasMaxLength(500); // Adjust max length as needed

                entity.Property(n => n.Type)
                      .IsRequired(); // Enum will be stored as int by default

                entity.Property(n => n.IsRead)
                      .IsRequired();

                entity.Property(n => n.CreatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP"); // For PostgreSQL

            });

            // --- LeaveApplication Configurations ---
            modelBuilder.Entity<LeaveApplication>(entity =>
            {
                entity.HasKey(la => la.Id);

                entity.Property(la => la.StartDate)
                      .IsRequired();

                entity.Property(la => la.EndDate)
                      .IsRequired();

                entity.Property(la => la.Reason)
                      .IsRequired()
                      .HasMaxLength(1000); // Adjust max length as needed

                entity.Property(la => la.Status)
                      .IsRequired(); // Enum

                entity.Property(la => la.SubmittedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP"); // For PostgreSQL

            });

            // --- SalesRecord Configurations ---
            modelBuilder.Entity<SalesRecord>(entity =>
            {
                entity.HasKey(sr => sr.Id);

                entity.Property(sr => sr.CustomerName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(sr => sr.ProductName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(sr => sr.Quantity)
                      .IsRequired();

                entity.Property(sr => sr.UnitPrice)
                      .IsRequired()
                      .HasColumnType("decimal(18,2)"); // Example precision for currency

                entity.Property(sr => sr.TotalAmount)
                      .IsRequired()
                      .HasColumnType("decimal(18,2)");

                entity.Property(sr => sr.SaleDate)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP"); // For PostgreSQL

                entity.Property(sr => sr.Notes)
                      .HasMaxLength(1000); // Nullable
                
            });
        }
    }
}