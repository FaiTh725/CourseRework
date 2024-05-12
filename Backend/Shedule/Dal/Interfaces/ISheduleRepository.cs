using Shedule.Domain.Entities;

namespace Shedule.Dal.Interfaces
{
    public interface ISheduleRepository
    {
        public Task AddShedule(IEnumerable<SheduleGroup> shedules);

        public Task ClearSelectedShedule();

        public Task<IEnumerable<SheduleGroup>> GetAllShedule();

        public Task<SheduleGroup> GetSheduleById(int idShedule);

        public Task<IEnumerable<SheduleGroup>> GetGroupSheduleById(int idGroup);
    }
}
