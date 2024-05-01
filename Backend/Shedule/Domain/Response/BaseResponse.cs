using Shedule.Domain.Enums;

namespace Shedule.Domain.Response
{
    public class BaseResponse<T>
    {
        public string Description { get; set; }

        public T Data { get; set; }

        public StatusCode StatusCode {  get; set; }   
    }
}
