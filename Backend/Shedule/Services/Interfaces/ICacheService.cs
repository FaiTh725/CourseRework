namespace Shedule.Services.Interfaces
{
    public interface ICacheService
    {
        Task<T> GetData<T>(string key);

        Task<bool> SetData<T>(string key, T value, DateTimeOffset expirationTime);

        Task<bool> RemoveData<T>(string key);
    }
}
