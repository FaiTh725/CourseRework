using Microsoft.IdentityModel.Tokens;
using Shedule.Domain.Entities;
using Shedule.Models.Jwt;
using Shedule.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Shedule.Services.Implementations
{
    public class JwtProvider : IJwtProvider
    {
        private readonly IConfiguration configuration;

        public JwtProvider(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public (string token, string refreshToken) GenerateTocken(UserEntity model)
        {
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, model.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, model.Login),
                new Claim("Role", model.Role.ToString())
            };

            var jwtConfiguration = configuration.GetSection("JwtConfig").Get<JwtOptions>();

            var key = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfiguration.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                jwtConfiguration.Issuerr,
                jwtConfiguration.Audience,
                claims,
                null,
                DateTime.UtcNow.AddMicroseconds(5),
                key
                );

            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            var refreshToken = GenerateRefreshToken();

            return (tokenValue, refreshToken);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var jwtSetting = configuration.GetSection("JwtConfig").Get<JwtOptions>();
            var tokenVallidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSetting.Issuerr,
                ValidAudience = jwtSetting.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSetting.SecretKey))
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenVallidationParameters, out securityToken);
            var jwtSecurotyToken = securityToken as JwtSecurityToken;

            /*if (jwtSecurotyToken != null || !jwtSecurotyToken.Header.Alg
                .Equals(SecurityAlgorithms.HmacSha256))
            {
                throw new SecurityTokenException("Invalid Token");
            }*/

            return principal;
        }
    }
}
