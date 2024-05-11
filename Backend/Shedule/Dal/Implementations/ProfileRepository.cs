using Microsoft.EntityFrameworkCore;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Implementations
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly AppDbContext context;

        public ProfileRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<SheduleGroup> AddFolovingGroup(int idProfile, SheduleGroup group)
        {
            var profile = await GetPorofileById(idProfile);
            profile.FolovingGroup.Add(group);

            await context.SaveChangesAsync();

            return group;
        }

        public async Task<ProfileEntity> CreateProfile(ProfileEntity profile)
        {
            var addProfile = context.Profiles.Add(profile);

            await context.SaveChangesAsync();

            return addProfile.Entity;
        }

        public async Task DeleteFolovingGroup(int idProfile, SheduleGroup group)
        {
            var profile = await GetPorofileById(idProfile);
            profile.FolovingGroup.Remove(group);

            await context.SaveChangesAsync();
        }

        public async Task<ProfileEntity> GetPorofileByEmail(string email)
        {
            return await context.Profiles
                    .Include(x => x.FolovingGroup)
                    .Include(x => x.User)
                    .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<ProfileEntity> GetPorofileById(int Id)
        {
            return await context.Profiles
                    .Include(x => x.FolovingGroup)
                    .Include(x => x.User)
                    .FirstOrDefaultAsync(x => x.Id == Id);
        }

        public async Task<IEnumerable<ProfileEntity>> GetSubscribeleProfile()
        {
            return await context.Profiles
                    .Include(x => x.FolovingGroup)
                    .Include(x => x.User)
                    .Where(x => x.NotificationEmail == true)
                    .ToListAsync();
        }

        public async Task<ProfileEntity> Update(int userId, ProfileEntity profile)
        {
            var oldProfile = await GetPorofileById(userId);

            oldProfile.BirthDay = profile.BirthDay;
            oldProfile.About = profile.About;
            oldProfile.Email = profile.Email;
            oldProfile.UserName = profile.UserName;
            if(profile.LogoImage != null && profile.LogoImage.Length != 0)
            {
                oldProfile.LogoImage = profile.LogoImage;
            }
            
            await context.SaveChangesAsync();

            return oldProfile;
        }
    }
}
