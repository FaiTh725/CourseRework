using Shedule.Domain.Entities;

namespace Shedule.Dal.Interfaces
{
    public interface IProfileRepository
    {
        Task<ProfileEntity> CreateProfile(ProfileEntity profile);

        Task<ProfileEntity> GetPorofileById(int Id);

        Task<ProfileEntity> GetPorofileByEmail(string email);

        Task<ProfileEntity> Update(int userId, ProfileEntity profile);
    
    }
}
