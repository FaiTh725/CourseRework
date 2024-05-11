using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Configuration
{
    public class SheduleGroupConfiguration : IEntityTypeConfiguration<SheduleGroup>
    {
        public void Configure(EntityTypeBuilder<SheduleGroup> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(x => x.WeekShedules)
                    .WithOne(x => x.SheduleGroup)
                    .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Profiles)
                    .WithMany(x => x.FolovingGroup);
        }
    }
}
