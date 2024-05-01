using Microsoft.EntityFrameworkCore;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext context;

        public UserRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<UserEntity> Create(UserEntity userEntity)
        {
            context.Users.Add(userEntity);
            await context.SaveChangesAsync();

            return userEntity;
        }

        public async Task<List<UserEntity>> GetAllUsers()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<UserEntity> GetById(int id)
        {
            return await context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<UserEntity> GetByLogin(string login)
        {
            return await context.Users.FirstOrDefaultAsync(x => x.Login == login);
        }

        public async Task<UserEntity> GetUserByRefreshToken(string refreshToken)
        {
            return await context.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
        }

        public async Task<UserEntity> Update(int id,UserEntity newData)
        {
            /*await context.Users.Where(x => x.Id == userEntity.Id)
                .ExecuteUpdateAsync(y => y.SetProperty(a => a.Password, a => userEntity.Password)
                                                             .SetProperty(a => a.Login, a => userEntity.Login)
                                                             .SetProperty(a => a.RefreshToken, a => userEntity.RefreshToken)
                                                             .SetProperty(a => a.RefreshTokenTime, a => userEntity.RefreshTokenTime));*/

            var user = await GetById(id);

            user.Login = newData.Login;
            user.RefreshToken = newData.RefreshToken;
            user.Role = newData.Role;
            user.RefreshTokenTime = newData.RefreshTokenTime;
            
            await context.SaveChangesAsync();

            return user;
        }
    }
}
