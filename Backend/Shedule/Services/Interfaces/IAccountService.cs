using Microsoft.AspNetCore.Identity.Data;
using Shedule.Domain.Response;
using Shedule.Models.Account;

namespace Shedule.Services.Interfaces
{
    public interface IAccountService
    {
        Task<BaseResponse<AccountResponse>> Login(AccountRequest request);

        Task<BaseResponse<AccountResponse>> Register(AccountRequest request);

        Task<BaseResponse<AccountResponse>> RefreshToken(string refreshToken);

        Task<BaseResponse<AccountResponse>> LogOut(SignOutRequets requets);

        Task<bool> CheckToken(string token);
    }
}
