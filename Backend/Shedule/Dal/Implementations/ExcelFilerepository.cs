using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OfficeOpenXml.Utils;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;

namespace Shedule.Dal.Implementations
{
    public class ExcelFilerepository : IExcelFileRepository
    {
        private readonly AppDbContext context;
        private readonly IWebHostEnvironment environment;

        public ExcelFilerepository(AppDbContext context, IWebHostEnvironment environment)
        {
            this.context = context;
            this.environment = environment;
        }

        public async Task<ExcelFileEntity> AddFile(IFormFile file)
        {
            string path = "/files/" + file.FileName;

            using (var fileStream = new FileStream(environment.WebRootPath+path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var createFile = context.ExcelFiles.Add(new ExcelFileEntity
            {
                Name = file.FileName,
                Path = path,
            });

            await context.SaveChangesAsync();

            return createFile.Entity;
        }

        public async Task DeleteExcelFile(ExcelFileEntity excelFile)
        {
            var filePath = environment.WebRootPath + excelFile.Path;

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }


            context.ExcelFiles.Remove(excelFile);

            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ExcelFileEntity>> GetAllExcelFiles()
        {
            return await context.ExcelFiles.ToListAsync();
        }

        public async Task<ExcelFileEntity> GetExcelFileById(int id)
        {
            return await context.ExcelFiles.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<ExcelFileEntity> GetExcelFileByName(string name)
        {
            return await context.ExcelFiles.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<ExcelFileEntity> GetSelectedFile()
        {
            return await context.ExcelFiles.FirstOrDefaultAsync(x => x.IsSelected == true);
        }

        public async Task<ExcelFileEntity> Update(int idFile, ExcelFileEntity newData)
        {
            var changingFile = await GetExcelFileById(idFile);

            changingFile.Path = newData.Path;
            changingFile.Name = newData.Name;
            changingFile.Description = newData.Description;
            changingFile.IsSelected = newData.IsSelected;
            
            await context.SaveChangesAsync();

            return changingFile;
        }
    }
}
