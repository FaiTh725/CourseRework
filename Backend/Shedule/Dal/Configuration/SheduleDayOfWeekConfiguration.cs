using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Configuration
{
    public class SheduleDayOfWeekConfiguration : IEntityTypeConfiguration<SheduleDayOfWeek>
    {
        public void Configure(EntityTypeBuilder<SheduleDayOfWeek> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.SheduleGroup)
                .WithMany(x => x.WeekShedules);

            builder.HasMany(x => x.Subjects)
                .WithOne(x => x.SheduleDayOfWeek)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
