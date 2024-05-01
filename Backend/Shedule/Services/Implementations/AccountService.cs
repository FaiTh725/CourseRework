using Microsoft.AspNetCore.Identity.Data;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;
using Shedule.Domain.Enums;
using Shedule.Domain.Response;
using Shedule.Models.Account;
using Shedule.Models.Home;
using Shedule.Services.Interfaces;

namespace Shedule.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IUserRepository userRepository;
        private readonly IJwtProvider jwtProvider;

        public AccountService(IUserRepository userRepository, IJwtProvider jwtProvider)
        {
            this.userRepository = userRepository;
            this.jwtProvider = jwtProvider;
        }

        public async Task<bool> CheckToken(string token)
        {
            var user = await userRepository.GetUserByRefreshToken(token);

            if (user == null)
            {
                return false;
            }

            return user.RefreshTokenTime > DateTime.UtcNow;
        }

        public async Task<BaseResponse<AccountResponse>> Login(AccountRequest request)
        {
            try
            {
                var user = await userRepository.GetByLogin(request.Login);

                if (user is not null)
                {
                    if (user.Password == request.Password)
                    {
                        var tokens = jwtProvider.GenerateTocken(user);

                        user.RefreshTokenTime = DateTime.Now.AddDays(3);
                        user.RefreshToken = tokens.refreshToken;
                        await userRepository.Update(user.Id,user);

                        return new BaseResponse<AccountResponse>
                        {
                            StatusCode = StatusCode.Ok,
                            Description = "Успешный вход",
                            Data = new AccountResponse()
                            {
                                Token = tokens.token,
                                RefreshToken = tokens.refreshToken
                            }
                        };
                    }

                    return new BaseResponse<AccountResponse>
                    {
                        StatusCode = StatusCode.InvalidData,
                        Description = "Неверный логин или пароль",
                        Data = new AccountResponse()
                    };
                }

                return new BaseResponse<AccountResponse>
                {
                    StatusCode = StatusCode.UnAuthorization,
                    Description = "Не зарегистрированный логин",
                    Data = new AccountResponse()
                };
            }
            catch
            {
                return new BaseResponse<AccountResponse>()
                {
                    Data = new AccountResponse(),
                    StatusCode = StatusCode.ServerError,
                    Description = "Внутрення ошибка сервера"
                };
            }
        }

        public async Task<BaseResponse<AccountResponse>> LogOut(SignOutRequets requets)
        {
            try
            {
                var user = await userRepository.GetById(requets.IdUser);

                if(user is null)
                {
                    return new BaseResponse<AccountResponse>
                    {
                        Description = "Пользователь с таким id не найден",
                        StatusCode = StatusCode.NotFoundUser,
                        Data = new AccountResponse()
                    };
                }

                user.RefreshToken = null;
                await userRepository.Update(user.Id, user);

                return new BaseResponse<AccountResponse>
                {
                    Description = "Выход из аккаунта",
                    StatusCode = StatusCode.Ok,
                    Data = new AccountResponse()
                };
            }
            catch
            {
                return new BaseResponse<AccountResponse>
                {
                    Description = "Внутрення ошибка сервера",
                    StatusCode = StatusCode.ServerError,
                    Data = new AccountResponse()
                };
            }
        }


        public async Task<BaseResponse<AccountResponse>> RefreshToken(string refreshToken)
        {
            if (!await CheckToken(refreshToken))
            {
                return new BaseResponse<AccountResponse>()
                {
                    StatusCode = StatusCode.InvalidToken,
                    Data = new (),
                    Description = "Токен не валиден"
                };
            }

            try
            {
                var user = await userRepository.GetUserByRefreshToken(refreshToken);

                /*if (user == null)
                {
                    return new BaseResponse<AccountResponse>
                    {
                        Description = "Не найден пользователь с такии токеном обновления",
                        StatusCode = StatusCode.NotFoundUser,
                        Data = new AccountResponse()
                    };
                }

                // проверка времени токена
                if (user.RefreshTokenTime < DateTime.UtcNow)
                {
                    return new BaseResponse<AccountResponse>
                    {
                        StatusCode = StatusCode.InvalidToken,
                        Description = "Время жизки токена истекло",
                        Data = new AccountResponse()
                        {
                            RefreshToken = refreshToken,
                        }
                    };
                }*/

                var tokens = jwtProvider.GenerateTocken(user);
                user.RefreshToken = tokens.refreshToken;
                
                await userRepository.Update(user.Id, user);

                return new BaseResponse<AccountResponse>
                {
                    StatusCode = StatusCode.Ok,
                    Description = "Успешно получили токены",
                    Data = new AccountResponse()
                    {
                        RefreshToken = tokens.refreshToken,
                        Token = tokens.token,
                    }
                };
            }
            catch
            {
                return new BaseResponse<AccountResponse>
                {
                    Description = "Внутрення ошибка сервера",
                    StatusCode = StatusCode.ServerError,
                    Data = new AccountResponse()
                };
            }
        }

        public async Task<BaseResponse<AccountResponse>> Register(AccountRequest request)
        {
            try
            {
                var user = await userRepository.GetByLogin(request.Login);

                if (user is null)
                {
                    var createrUser = await userRepository.Create(new UserEntity
                    {
                        Login = request.Login,
                        Password = request.Password
                    });

                    var tokens = jwtProvider.GenerateTocken(createrUser);
                    createrUser.RefreshTokenTime = DateTime.UtcNow.AddDays(3);
                    createrUser.RefreshToken = tokens.refreshToken;
                    await userRepository.Update(createrUser.Id, createrUser);

                    return new BaseResponse<AccountResponse>
                    {
                        StatusCode = StatusCode.Ok,
                        Description = "Зарегистрировали пользователя",
                        Data = new AccountResponse()
                        {
                            Token = tokens.token,
                            RefreshToken = tokens.refreshToken
                        }
                    };
                }

                return new BaseResponse<AccountResponse>
                {
                    StatusCode = StatusCode.UnAuthorization,
                    Data = new AccountResponse(),
                    Description = "Пользователь уже зарегистрирован"
                };
            }
            catch
            {
                return new BaseResponse<AccountResponse>()
                {
                    Data = new AccountResponse(),
                    StatusCode = StatusCode.ServerError,
                    Description = "Внутрення ошибка сервера"
                };
            }
        }
    }
}
