using Microsoft.AspNetCore.Identity;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Enums;
using Shedule.Domain.Response;
using Shedule.Models.Home;
using Shedule.Services.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace Shedule.Services.Implementations
{
    public class HomeService : IHomeService
    {
        private readonly IUserRepository userRepository;
        private readonly IAccountService accountService;
        private readonly IJwtProvider jwtProvider;

        public HomeService(IUserRepository userRepository, IAccountService accountService, IJwtProvider jwtProvider)
        {
            this.userRepository = userRepository;   
            this.accountService = accountService;
            this.jwtProvider = jwtProvider;
        }

        public async Task<BaseResponse<GetAllUsersResponse>> GetAllUsers(HomeBaseRequest request)
        {
            try
            {
                var token = jwtProvider.GetPrincipalFromExpiredToken(request.Token);
                
                if(token.FindFirst("Role")?.Value != "Admin")
                {
                    return new BaseResponse<GetAllUsersResponse>()
                    {
                        StatusCode = StatusCode.NotEnoughRight,
                        Description = "Не достаточно прав",
                        Data = new GetAllUsersResponse()
                        {
                            Users = new List<UserView>()
                        }
                    };
                }

                var users = await userRepository.GetAllUsers();


                return new BaseResponse<GetAllUsersResponse>()
                {
                    StatusCode = StatusCode.Ok,
                    Description = "Получили пользователей",
                    Data = new GetAllUsersResponse()
                    {
                        Users = users.Select(x => new UserView
                        {
                            Id = x.Id,
                            ImageProfile = x.Profile.LogoImage == null ? string.Empty : Convert.ToBase64String(x.Profile.LogoImage),
                            login = x.Login,
                            Role = x.Role,
                        }).ToList(),
                    }
                };
            }
            catch
            {
                return new BaseResponse<GetAllUsersResponse>()
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера при получении пользователей",
                    Data = new GetAllUsersResponse()
                    {
                        Users = new List<UserView>()
                    }
                };
            }
        }

        public async Task<BaseResponse<SwithRoleResponse>> SwithRole(SwithRoleRequest request)
        {
            if(await accountService.CheckToken(request.Token))
            {
                return new BaseResponse<SwithRoleResponse>()
                {
                    StatusCode = StatusCode.InvalidToken,
                    Data = new SwithRoleResponse(),
                    Description = "Токен не валиден"
                };
            }

            try
            {
                  var user = await userRepository.GetById(request.IdUser);

                if (user == null) 
                {
                    return new BaseResponse<SwithRoleResponse>
                    {
                        StatusCode = StatusCode.NotFoundUser,
                        Data = new SwithRoleResponse(),
                        Description = "Пользователя с таким id не существует"
                    };
                }

                user.Role = (Role)request.Role;
                await userRepository.Update(request.IdUser, user);

                return new BaseResponse<SwithRoleResponse>()
                {
                    StatusCode = StatusCode.Ok,
                    Description = "Обновили пользователя",
                    Data = new SwithRoleResponse()
                    {
                        IdUser = user.Id,
                        Role = user.Role,
                        Login = user.Login
                    }
                };
            }
            catch
            {
                return new BaseResponse<SwithRoleResponse>()
                {
                    StatusCode = StatusCode.ServerError,
                    Data = new SwithRoleResponse(),
                    Description = "Ошибка сервера"
                };
            }
        }
    }
}
