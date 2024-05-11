using Microsoft.EntityFrameworkCore;
using OfficeOpenXml.Utils;
using Shedule.Dal.Interfaces;
using Shedule.Domain.Entities;
using Shedule.Services.Interfaces;

namespace Shedule.Dal.Implementations
{
    public class SheduleRepository : ISheduleRepository
    {
        private readonly AppDbContext context;

        public SheduleRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task AddShedule(IEnumerable<SheduleGroup> shedules)
        {
            await context.SheduleGroups.AddRangeAsync(shedules);
            await context.SaveChangesAsync();
        }

        public async Task ClearSelectedShedule()
        {
            var removedValue = await context.SheduleGroups.ToListAsync();

            context.SheduleGroups.RemoveRange(removedValue);
            
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SheduleGroup>> GetAllShedule()
        {
            return await context.SheduleGroups.ToListAsync();
        }

        public async Task<SheduleGroup> GetSheduleById(int idShedule)
        {
            return await context.SheduleGroups.FirstOrDefaultAsync(x => x.Id == idShedule);
        }
    }
}
