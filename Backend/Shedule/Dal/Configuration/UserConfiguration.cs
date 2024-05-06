using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Profile)
                   .WithOne(x => x.User)
                   .HasForeignKey<ProfileEntity>(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
