using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class LeaveNotificationWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<LeaveNotificationWorker> _logger;

        public LeaveNotificationWorker(IServiceProvider serviceProvider, ILogger<LeaveNotificationWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("LeaveNotificationWorker started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var leaveService = scope.ServiceProvider.GetRequiredService<LeaveDaysApproachingService>();

                    await leaveService.NotifyEmployeesWithApproachingLeaveDaysAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while notifying employees.");
                }

                // Wait 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}
