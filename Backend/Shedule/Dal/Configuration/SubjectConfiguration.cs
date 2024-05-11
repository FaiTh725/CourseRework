using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Configuration
{
    public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
    {
        public void Configure(EntityTypeBuilder<Subject> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.SheduleDayOfWeek)
                .WithMany(x => x.Subjects);
        }
    }
}
