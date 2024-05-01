using Shedule.Domain.Entities;

namespace Shedule.Dal.Interfaces
{
    public interface IUserRepository
    {
        Task<UserEntity> Create(UserEntity userEntity);

        Task<UserEntity> GetByLogin(string login);

        Task<UserEntity> GetUserByRefreshToken(string refreshToken);

        Task<UserEntity> Update(int idUser, UserEntity newData);

        Task<UserEntity> GetById(int id);

        Task<List<UserEntity>> GetAllUsers();
    }
}
