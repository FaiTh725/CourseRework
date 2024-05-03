namespace Shedule.Models.File
{
    public class AddFileResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; } = string.Empty; 

        public bool IsSelected { get; set; } = false;   
    }
}
