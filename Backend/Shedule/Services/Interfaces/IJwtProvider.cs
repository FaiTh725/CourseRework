using Shedule.Domain.Entities;
using System.Security.Claims;

namespace Shedule.Services.Interfaces
{
    public interface IJwtProvider
    {
        (string token, string refreshToken) GenerateTocken(UserEntity model);

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
