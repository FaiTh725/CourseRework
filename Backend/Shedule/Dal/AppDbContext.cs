using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Shedule.Dal.Configuration;
using Shedule.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Shedule.Dal
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<UserEntity> Users { get; set; }

        public DbSet<ExcelFileEntity> ExcelFiles { get; set; }

        public DbSet<ProfileEntity> Profiles { get; set; }

        public DbSet<SheduleGroup> SheduleGroups { get; set; }

        public DbSet<SheduleDayOfWeek> SheduleDayOfWeeks { get; set; }

        public DbSet<Subject> Subjects { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new SheduleDayOfWeekConfiguration());
            modelBuilder.ApplyConfiguration(new SheduleDayOfWeekConfiguration());
            modelBuilder.ApplyConfiguration(new SubjectConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
