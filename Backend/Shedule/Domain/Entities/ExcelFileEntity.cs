namespace Shedule.Domain.Entities
{
    public class ExcelFileEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; } = string.Empty;

        public string Path { get; set; }

        public bool IsSelected { get; set; } = false;
    }
}
