using OfficeOpenXml;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;
using Shedule.Domain.Response;
using Shedule.Models.Shedule;
using Shedule.Services.Interfaces;

namespace Shedule.Services.Implementations
{
    public class SheduleService : ISheduleService
    {
        private readonly ISheduleRepository sheduleRepository;
        private readonly IWebHostEnvironment environment;
        private readonly IProfileRepository profileRepository;
        private readonly ICacheService cacheService;

        public SheduleService(ISheduleRepository sheduleRepository,
            IWebHostEnvironment environment,
            IProfileRepository profileRepository,
            ICacheService cacheService)
        {
            this.sheduleRepository = sheduleRepository;
            this.environment = environment;
            this.profileRepository = profileRepository;
            this.cacheService = cacheService;
        }

        public async Task<BaseResponse<GroupsResponse>> AddFolovingGroup(FolovingGroupRequest request)
        {
            try
            {
                var profile = await profileRepository.GetPorofileById(request.IdProfile);
                var shedule = await sheduleRepository.GetSheduleById(request.IdShedule);


                if (profile == null || shedule == null)
                {
                    return new BaseResponse<GroupsResponse>
                    {
                        Description = "Профиль или группа не найдены",
                        StatusCode = Domain.Enums.StatusCode.NotFoundGroup,
                        Data = new()
                    };
                }

                if (profile.FolovingGroup.FirstOrDefault(x => x.Id == shedule.Id) != null)
                {
                    return new BaseResponse<GroupsResponse>
                    {
                        Description = "Группа уже добавлена",
                        StatusCode = Domain.Enums.StatusCode.GroupIsFoloving,
                        Data = new GroupsResponse()
                    };
                }

                var newFolovingShedule = await profileRepository.AddFolovingGroup(profile.Id, shedule);
                await cacheService.RemoveData<ProfileEntity>($"profile - {request.IdProfile}");

                return new BaseResponse<GroupsResponse>
                {
                    Description = "Добавили группу",
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Data = new GroupsResponse
                    {
                        Id = newFolovingShedule.Id,
                        Group = int.Parse(newFolovingShedule.Name.Split(" ", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)[1])
                    }
                };

            }
            catch
            {
                return new BaseResponse<GroupsResponse>
                {
                    Data = new(),
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError
                };
            }
        }

        public async Task<DataResponse> DeleteFolovingGroup(FolovingGroupRequest request)
        {
            try
            {
                var profile = await profileRepository.GetPorofileById(request.IdProfile);
                var shedule = await sheduleRepository.GetSheduleById(request.IdShedule);

                if (profile == null || shedule == null)
                {
                    return new DataResponse
                    {
                        Description = "Профиль или группа не сущесвуют",
                        StatusCode = Domain.Enums.StatusCode.InvalidData
                    };
                }

                await profileRepository.DeleteFolovingGroup(profile.Id, shedule);
                await cacheService.RemoveData<ProfileEntity>($"profile - {request.IdProfile}");

                return new DataResponse
                {
                    Description = "Удалили отслеживаемую группу",
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

        public async Task<BaseResponse<IEnumerable<CoursesResponse>>> GetAllCourses()
        {
            try
            {
                var courses = await cacheService.GetData<List<CoursesResponse>>("courses");

                if (courses == null)
                {
                    courses = (await sheduleRepository.GetAllShedule())
                                     .DistinctBy(x => x.Course)
                                     .Select(x => new CoursesResponse
                                     {
                                         Course = x.Course
                                     })
                                     .ToList();

                    await cacheService.SetData("courses", courses, DateTimeOffset.Now.AddMinutes(5));
                }



                return new BaseResponse<IEnumerable<CoursesResponse>>
                {
                    Data = courses,
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Получили все курсы"
                };
            }
            catch
            {
                return new BaseResponse<IEnumerable<CoursesResponse>>
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера",
                    Data = new List<CoursesResponse>()
                };
            }
        }

        public async Task<BaseResponse<IEnumerable<GroupsResponse>>> GetAllGroup(int course)
        {
            try
            {
                var groups = await cacheService.GetData<List<GroupsResponse>>($"groups - {course}");

                if (groups == null)
                {
                    groups = (await sheduleRepository.GetAllShedule())
                                   .Where(x => x.DayOfWeek == 1 && x.Course == course)
                                   .Select(x => new GroupsResponse
                                   {
                                       Id = x.Id,
                                       Group = int.Parse(x.Name.Split(" ", StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)[1]),
                                   })
                                   .ToList();

                    await cacheService.SetData($"group - {course}", groups, DateTimeOffset.Now.AddMinutes(5));
                }


                return new BaseResponse<IEnumerable<GroupsResponse>>
                {
                    Description = "Получили все группы",
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Data = groups
                };
            }
            catch
            {
                return new BaseResponse<IEnumerable<GroupsResponse>>
                {
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Description = "Ошибка сервера",
                    Data = new List<GroupsResponse>()
                };
            }
        }

        public async Task<BaseResponse<IEnumerable<GroupsResponse>>> GetFolovingGroup(int idProfile)
        {
            try
            {
                var profile = await cacheService.GetData<ProfileEntity>($"profile - {idProfile}");

                if (profile == null)
                {
                    profile = await profileRepository.GetPorofileById(idProfile);

                    await cacheService.SetData($"profile - {idProfile}", profile, DateTimeOffset.Now.AddMinutes(5));

                    if (profile == null)
                    {
                        return new BaseResponse<IEnumerable<GroupsResponse>>
                        {
                            Description = "Профиль не найден",
                            StatusCode = Domain.Enums.StatusCode.NotFountProfile,
                            Data = new List<GroupsResponse>()
                        };
                    }
                }


                return new BaseResponse<IEnumerable<GroupsResponse>>
                {
                    Description = "Получили отслеживаемые группы",
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Data = profile.FolovingGroup.Select(x => new GroupsResponse
                    {
                        Id = x.Id,
                        Group = int.Parse(x.Name.Split(" ", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)[1])
                    })
                };
            }
            catch
            {
                return new BaseResponse<IEnumerable<GroupsResponse>>
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Data = new List<GroupsResponse>()
                };
            }
        }

        public async Task<BaseResponse<IEnumerable<GetSheduleGroupResponse>>> GetSheduleGroup(int idGroup)
        {
            try
            {
                var sheduleGroup = await cacheService.GetData<IEnumerable<SheduleGroup>>($"SheduleGroup - {idGroup}");

                if (sheduleGroup == null)
                {
                    sheduleGroup = await sheduleRepository.GetGroupSheduleById(idGroup);
                    await cacheService.SetData($"SheduleGroup - {idGroup}", sheduleGroup, DateTimeOffset.Now.AddMinutes(5));
                }

                return new BaseResponse<IEnumerable<GetSheduleGroupResponse>>
                {
                    StatusCode = Domain.Enums.StatusCode.Ok,
                    Description = "Получили полностью расписание всей группы",
                    Data = sheduleGroup.Select(x => new GetSheduleGroupResponse
                    {
                        Id = x.Id,
                        Name = x.Name,
                        DayOfWeek = x.DayOfWeek,
                        WeekShedules = x.WeekShedules.Select(y => new SheduleDayOfWeekResponse
                        {
                            DayOfWeek = y.DayOfWeek,
                            Id = y.Id,
                            SubjectsDayOfWeek = y.Subjects.Select(z => new SubjectResponse
                            {
                                Id = z.Id,
                                Name = z.Name,
                                Time = z.Time
                            }).ToList()
                        }).ToList()
                    })
                };
            }
            catch
            {
                return new BaseResponse<IEnumerable<GetSheduleGroupResponse>>
                {
                    Description = "Ошибка сервера",
                    StatusCode = Domain.Enums.StatusCode.ServerError,
                    Data = new List<GetSheduleGroupResponse>()
                };
            }
        }

        public async Task<bool> ParseExcelFileOfShedule(string selectedFileName)
        {
            var excelFilePath = Path.Combine(environment.WebRootPath, "files", selectedFileName);

            var existFile = new FileInfo(excelFilePath);
            using (var package = new ExcelPackage(existFile))
            {
                List<SheduleGroup> sheduleGroups = new();
                // проход по страницам
                foreach (var worksheet in package.Workbook.Worksheets)
                {
                    int colCount = worksheet.Dimension.End.Column;
                    int colRow = worksheet.Dimension.End.Row;

                    var nameWorkShet = worksheet.Name.Split(" ", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

                    List<SheduleGroup> group = new();

                    try
                    {
                        // проход по группам
                        for (int i = 3; i <= colCount; i += 6)
                        {
                            if (worksheet.Cells[2, i].Value is not null)
                            {
                                group.Add(new SheduleGroup
                                {
                                    Name = worksheet.Cells[2, i].Value.ToString(),
                                    Course = int.Parse(nameWorkShet[0]),
                                    DayOfWeek = int.Parse(nameWorkShet[2])
                                });

                                group[^1].WeekShedules = new();

                                // Заполняем дни недели
                                int intDayOfWeek = 1;
                                for (int j = 3; j <= colRow; j += 2)
                                {
                                    if (worksheet.Cells[j, 1].Value is not null)
                                    {
                                        // добавили название дней
                                        group[^1].WeekShedules.Add(new SheduleDayOfWeek
                                        {
                                            DayOfWeek = (DayOfWeek)intDayOfWeek,
                                            Subjects = new()
                                        });

                                        intDayOfWeek++;

                                        // добавление время - предмет

                                        for (int k = j; k <= colRow; k++)
                                        {
                                            if (worksheet.Cells[k, 1].Value is not null & k != j)
                                            {
                                                break;
                                            }
                                            if (worksheet.Cells[k, i].Value != null)
                                            {
                                                if (worksheet.Cells[k, 2].Value == null)
                                                {
                                                    group[^1].WeekShedules[^1].Subjects.Add(new Subject()
                                                    {
                                                        Time = group[^1].WeekShedules[^1].Subjects[^1].Time,
                                                        Name = worksheet.Cells[k, i].Value.ToString()!,
                                                    });
                                                }
                                                else
                                                {
                                                    group[^1].WeekShedules[^1].Subjects.Add(new Subject()
                                                    {
                                                        Time = worksheet.Cells[k, 2].Value.ToString(),
                                                        Name = worksheet.Cells[k, i].Value.ToString()
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        sheduleGroups.AddRange(group);

                    }
                    catch
                    {
                        return false;
                    }
                }

                await sheduleRepository.ClearSelectedShedule();
                await sheduleRepository.AddShedule(sheduleGroups);
            }

            return true;
        }
    }
}
