using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;
using Shedule.Domain.Response;
using Shedule.Models.Porifle;
using Shedule.Models.Profile;
using Shedule.Services.Interfaces;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;

namespace Shedule.Services.Implementations
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository profileRepository;
        private readonly IEmailService emailService;
        private readonly IJwtProvider jwtProvider;
        private readonly IUserRepository userRepository;
        private readonly ICacheService cacheService;

        public ProfileService(IProfileRepository profileRepository, 
            IEmailService emailService, 
            IJwtProvider jwtProvider,
            IUserRepository userRepository,
            ICacheService cacheService)
        {
            this.profileRepository = profileRepository;
            this.emailService = emailService;
            this.jwtProvider = jwtProvider;
            this.userRepository = userRepository;
            this.cacheService = cacheService;
        }

        public async Task<BaseResponse<ProfileResponse>> GetProfile(int idProfile)
        {
            try
            {
                var profile = await cacheService.GetData<ProfileEntity>($"profile - {idProfile}");

                if(profile == null)
                {
                    profile = await profileRepository.GetPorofileById(idProfile);
                }


                if(profile == null)
                {
                    return new BaseResponse<ProfileResponse>
                    {
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile,
                        Description = "Не найден профиль",
                        Data = new ProfileResponse()
                    };
                }

                await cacheService.SetData($"profile - {idProfile}", profile, DateTimeOffset.Now.AddMinutes(10));

                return new BaseResponse<ProfileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Успешно получили профиль",
                    Data = new ProfileResponse()
                    {
                        About = profile?.About ?? "",
                        BirthDay = profile?.BirthDay?.ToString("d") ?? "",
                        Email = profile?.Email ?? "",
                        FullName = profile?.UserName ?? "",
                        Base64Image = profile.LogoImage != null ? Convert.ToBase64String(profile.LogoImage) : string.Empty,
                        NotificationEmail = profile?.NotificationEmail ?? false
                    }
                };
                
            }
            catch
            {
                return new BaseResponse<ProfileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера",
                    Data = new ProfileResponse()
                };
            }
        }

        public async Task<DataResponse> NotificationEmail(NotificationEmailRequest request)
        {
            try
            {
                var profile = await profileRepository.GetPorofileById(request.IdProfile);

                if(profile == null)
                {
                    return new DataResponse
                    {
                        Description = "Профиль не найден",
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile
                    };
                }

                profile.NotificationEmail = !profile.NotificationEmail;
                await profileRepository.Update(profile.Id, profile);

                await cacheService.SetData($"profile - {profile.Id}", profile, DateTimeOffset.Now.AddMinutes(10));

                return new DataResponse
                {
                    Description = "Включили/Выключили оповещение",
                    StatusCode = Domain.Enums.StatusCode.Ok
                };
            }
            catch
            {
                return new DataResponse
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError
                };
            }
        }

        public async Task<DataResponse> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                var profile = await profileRepository.GetPorofileById(request.IdProfile);

                if(profile == null)
                {
                    return new DataResponse
                    {
                        Description = "Профиль не существует",
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile
                    };
                }

                var verifyToken = jwtProvider.GenerateTokenResetPassword(profile.Email);

                try
                {
                    await emailService.SendEmail(profile.Email, "Восстановление пароля", verifyToken);

                    return new DataResponse
                    {
                        Description = "Отправили письмо",
                        StatusCode = Domain.Enums.StatusCode.Ok,
                    };
                }
                catch (MailKit.Net.Smtp.SmtpCommandException)
                {
                    return new DataResponse
                    {
                        Description = "Email не авалиден",
                        StatusCode = Domain.Enums.StatusCode.InvalidEmail
                    };
                }
            }
            catch
            {
                return new DataResponse
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера"
                };
            }
        }

        public async Task<DataResponse> ResetPasswordConfirm(ResetPasswordConfirmeRequest request, string token)
        {
            try
            {
                
                var principalToken = jwtProvider.GetPrincipalFromExpiredToken(token);
                var email = principalToken.Claims.Where(x => x.Type == "name").Select(x => x.Value).FirstOrDefault();

                if(email == null)
                {
                    return new DataResponse
                    {
                        Description = "В токене нету почты",
                        StatusCode = Domain.Enums.StatusCode.InvalidToken
                    };
                }

                var profile = await profileRepository.GetPorofileByEmail(email);

                if(profile == null)
                {
                    return new DataResponse
                    {
                        Description = "С такой почтой профиль не найден",
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile
                    };
                }

                var user = await userRepository.GetById(profile.Id);

                user.Password = request.Password;
                await userRepository.Update(user.Id, user);

                return new DataResponse
                {
                    Description = "Обновили пароль",
                    StatusCode = Domain.Enums.StatusCode.Ok
                };

            }
            catch
            {
                return new DataResponse
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError
                };
            }
        }

        public async Task<BaseResponse<ProfileResponse>> UpdateProfile(UpdateProfileRequest request)
        {
            try
            {
                var profile = await profileRepository.GetPorofileById(request.ProfileId);

                if(profile == null)
                {
                    return new BaseResponse<ProfileResponse>
                    {
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile,
                        Description = "Не найден профиль",
                        Data = new ProfileResponse()
                    };
                }

                var profileByEmail = await profileRepository.GetPorofileByEmail(request.Email);

                if(profileByEmail != null && request.Email != profileByEmail.Email)
                {
                    return new BaseResponse<ProfileResponse>
                    {
                        StatusCode = Domain.Enums.StatusCode.InvalidEmail,
                        Description = "Данный Email уже занят",
                        Data = new ProfileResponse()
                    };
                }

                DateTime? validBurthDay = null;

                try
                {
                    validBurthDay = DateTime.Parse(request?.BirthDay);
                }
                catch
                {

                }

                var newProfile = await profileRepository.Update(profile.Id, new Domain.Entities.ProfileEntity
                {
                    About = request?.About,
                    Email = request?.Email,
                    BirthDay = validBurthDay,
                    UserName = request?.FullName
                });

                await cacheService.SetData($"profile - {newProfile.Id}", newProfile, DateTimeOffset.Now.AddMinutes(10));

                return new BaseResponse<ProfileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Обновили пользователя",
                    Data = new ProfileResponse()
                    {
                        Email = newProfile.Email ?? "",
                        About = newProfile.About ?? "",
                        BirthDay = newProfile.BirthDay.ToString() ?? "",
                        FullName = newProfile.UserName ?? "",

                    }
                };
            }
            catch
            {
                return new BaseResponse<ProfileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера",
                    Data = new ProfileResponse()
                };
            }
        }

        public async Task<DataResponse> UpdateProfileImage(int idUser, IFormFile file)
        {
            try
            {
                if(file == null)
                {
                    return new DataResponse
                    {
                        StatusCode = Domain.Enums.StatusCode.InvalidData,
                        Description = "Файл пустой"
                    };
                }

                var profile = await profileRepository.GetPorofileById(idUser);

                if(profile == null)
                {
                    return new DataResponse
                    {
                        StatusCode = Domain.Enums.StatusCode.NotFountProfile,
                        Description = "Не найден профиль"
                    };
                }

                if(file.Length > 0)
                {

                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        var fileBytes = memoryStream.ToArray();
                        profile.LogoImage = fileBytes;
                        await profileRepository.Update(profile.Id, profile);
                    }

                    await cacheService.SetData($"profile - {profile.Id}", profile, DateTimeOffset.Now.AddMinutes(10));
                }

                return new DataResponse
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Обновили фото профиля"
                };
            }
            catch
            {
                return new DataResponse
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера"
                };
            }

        }
    }
}
