using Microsoft.EntityFrameworkCore;
using Shedule.Dal;

namespace Shedule.Services
{
    public static class DatabaseManagmentService
    {
        public static  void MigrationInitializing(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();

            using var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            dbContext.Database.Migrate();
        }
    }
}
