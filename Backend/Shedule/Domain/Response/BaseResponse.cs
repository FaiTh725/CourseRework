using Shedule.Domain.Enums;

namespace Shedule.Domain.Response
{
    public class BaseResponse<T> : DataResponse
    {
        public T Data { get; set; }
    }
}
