﻿using Microsoft.AspNetCore.SignalR;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Response;
using Shedule.Hubs;
using Shedule.Models.File;
using Shedule.Services.Interfaces;

namespace Shedule.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly IExcelFileRepository excelFileRepository;
        private readonly IHubContext<ReciveEmailHub> hubContext;
        private readonly IProfileRepository profileRepository;
        private readonly IEmailService emailService;

        public FileService(IExcelFileRepository excelFileRepository, 
                IHubContext<ReciveEmailHub> hubContext, 
                IProfileRepository profileRepository,
                IEmailService emailService)
        {
            this.excelFileRepository = excelFileRepository; 
            this.hubContext = hubContext;
            this.profileRepository = profileRepository;
            this.emailService = emailService;
        }

        public async Task<BaseResponse<AddFileResponse>> AddFile(IFormFile file)
        {
            try
            {
                if(await excelFileRepository.GetExcelFileByName(file.FileName) != null)
                {
                    return new BaseResponse<AddFileResponse>
                    {
                        Description = "Файл с таким именем существуем",
                        Data = new AddFileResponse(),
                        StatusCode = Domain.Enums.StatusCode.ExcelFileExist
                    };
                }

                var createExcelFile = await excelFileRepository.AddFile(file);

                //await hubContext.Clients.Group("FileUploadOrDelete").SendAsync("ReceiveSheduleChanging", "Расписание обновилось");
                await hubContext.Clients.All.SendAsync("ReceiveSheduleChanging", "Расписание обновилось");

                return new BaseResponse<AddFileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Успешно добавили файл",
                    Data = new AddFileResponse()
                    {
                        Id = createExcelFile.Id,
                        Description = createExcelFile.Description,
                        IsSelected = createExcelFile.IsSelected,
                        Name = createExcelFile.Name
                    }
                };
            }
            catch
            {
                return new BaseResponse<AddFileResponse>
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Data = new AddFileResponse()
                };
            }
        }

        public async Task<BaseResponse<AddFileResponse>> ChangeDescriptionExcelFile(UpdateFileRequest request)
        {
            try
            {
                var file = await excelFileRepository.GetExcelFileById(request.IdFile);

                if(file == null)
                {
                    return new BaseResponse<AddFileResponse>
                    {
                        StatusCode = Domain.Enums.StatusCode.NotFoundExcelFile,
                        Description = "Файл с таким id не найден",
                        Data = new AddFileResponse()
                    };
                }

                file.Description = request.Description;

                var updatedFile = await excelFileRepository.Update(request.IdFile, file);

                return new BaseResponse<AddFileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Обновили описание",
                    Data = new AddFileResponse 
                    { 
                        Id = updatedFile.Id,
                        Description = updatedFile.Description,
                        IsSelected = updatedFile.IsSelected,
                        Name = updatedFile.Name
                    }
                };
            }
            catch
            {
                return new BaseResponse<AddFileResponse>
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера",
                    Data = new AddFileResponse()
                };
            }
        }

        public async Task<DataResponse> DeleteFile(DeleteFileRequest request)
        {
            try
            {   
                var file = await excelFileRepository.GetExcelFileById(request.IdFile);

                if(file == null)
                {
                    return new DataResponse
                    {
                        StatusCode = Domain.Enums.StatusCode.NotFoundExcelFile,
                        Description = "Не нашли файли по id"
                    };
                }

                await excelFileRepository.DeleteExcelFile(file);
                
                //await hubContext.Clients.Group("FileUploadOrDelete").SendAsync("ReceiveSheduleChanging", "Расписание обновилось");
                await hubContext.Clients.All.SendAsync("ReceiveSheduleChanging", "Расписание обновилось");
                
                return new DataResponse
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Удалили файл"
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

        public async Task<BaseResponse<IEnumerable<AddFileResponse>>> GetAllFiles()
        {
            try
            {
                var excelFiles = await excelFileRepository.GetAllExcelFiles();

                return new BaseResponse<IEnumerable<AddFileResponse>>
                {
                    Description = "Получили все файлы",
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Data = excelFiles == null ? new List<AddFileResponse>() : excelFiles.Select(x => new AddFileResponse
                    {
                        Description= x.Description,
                        Id = x.Id,
                        IsSelected = x.IsSelected,
                        Name = x.Name
                    })
                };
            }
            catch
            {
                return new BaseResponse<IEnumerable<AddFileResponse>>
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Data = new List<AddFileResponse>()
                };
            }
        }

        public async Task<DataResponse> SendEmailAboutChanging()
        {
            try
            {
                var profiles = await profileRepository.GetSubscribeleProfile();

                if(profiles == null)
                {
                    return new DataResponse
                    {
                        StatusCode = Domain.Enums.StatusCode.InvalidData,
                        Description = "Нету кому отсласть"
                    };
                }

                if(profiles.Count() > 0)
                {
                    foreach(var profile in profiles)
                    {
                        emailService.NotificationAboutChangingSheduleFiles(profile.Email);
                    }
                }

                return new DataResponse
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Письма отправлены"
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