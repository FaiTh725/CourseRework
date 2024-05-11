using Shedule.Domain.Entities;

namespace Shedule.Models.Shedule
{
    public class GetSheduleGroupResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int DayOfWeek { get; set; }

        public List<SheduleDayOfWeek> WeekShedules { get; set; } = new();
    }

    public class SheduleDayOfWeekResponse
    {
        public int Id { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public List<Subject> Subjects = new();
    }

    public class SubjectResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Time { get; set; }
    }
}
