// backend/Data/SeedData.cs
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity; // Make sure to install BCrypt.Net-Next via NuGet

namespace backend.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                // Ensure the database is created and migrations are applied
                // This is generally done via migrations, but EnsureCreatedAsync can be used for simple cases or initial setup
                await context.Database.MigrateAsync(); // Use MigrateAsync for production-ready setups
                                                       // Or for development/testing: await context.Database.EnsureCreatedAsync();

                // Check if a manager with the default email already exists
                if (await context.Users.AnyAsync(u => u.Email == "manager@corpinc.com"))
                {
                    Console.WriteLine("Default manager user already exists. Skipping seeding.");
                    return;
                }

                Console.WriteLine("Seeding default manager user...");

                // Create a new User
                var managerUser = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Default",
                    LastName = "Manager",
                    Email = "manager@firm.com",
                    // Hash the password securely
                    PasswordHash = "", // Use a strong password
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var passwordHash = new PasswordHasher<User>()
                    .HashPassword(managerUser, "12345678");

                // Create a new Manager profile
                var managerProfile = new Manager
                {
                    UserId = managerUser.Id, // Link to the User
                    Department = "Management",
                    OfficeLocation = "Head Office",
                    IsActive = true, // Set to true as this is a default, active manager
                };

                // Add both to the context
                context.Users.Add(managerUser);
                context.Managers.Add(managerProfile);

                // Save changes to the database
                await context.SaveChangesAsync();

                Console.WriteLine("Default manager user seeded successfully.");
            }
        }
    }
}
