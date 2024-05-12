namespace Shedule.Domain.Entities
{
    public class SheduleGroup
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Course { get; set; }

        public int DayOfWeek { get; set; }

        public List<SheduleDayOfWeek> WeekShedules { get; set; } = new();

        public List<ProfileEntity> Profiles = new ();
    }

    public class SheduleDayOfWeek
    {
        public int Id { get; set; }

        public DayOfWeek DayOfWeek { get; set;}

        public int IdSheduleGroup { get; set; }

        public SheduleGroup SheduleGroup { get; set; }


        public List<Subject> Subjects { get; set; } = new(); 
    }

    public class Subject
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Time { get; set; }

        public int IdSheduleDayOfWeek;

        public SheduleDayOfWeek SheduleDayOfWeek { get; set; }
    }
}
