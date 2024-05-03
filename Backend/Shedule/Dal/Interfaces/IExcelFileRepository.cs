using Shedule.Domain.Entities;

namespace Shedule.Dal.Interfaces
{
    public interface IExcelFileRepository
    {
        Task<ExcelFileEntity> AddFile(IFormFile file);

        Task<IEnumerable<ExcelFileEntity>> GetAllExcelFiles();

        Task<ExcelFileEntity> GetExcelFileByName(string name);

        Task<ExcelFileEntity> GetExcelFileById(int id);
        
        Task DeleteExcelFile(ExcelFileEntity excelFile);

        Task<ExcelFileEntity> Update(int idFile, ExcelFileEntity newData);
    }
}
