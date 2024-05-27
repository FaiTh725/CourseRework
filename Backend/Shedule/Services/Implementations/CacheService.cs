
using Newtonsoft.Json;
using Shedule.Services.Interfaces;
using StackExchange.Redis;

namespace Shedule.Services.Implementations
{
    public class CacheService : ICacheService
    {
        private readonly IDatabase cacheDb;
        private readonly ConnectionMultiplexer connectionMultiplexer;

        public CacheService(IConfiguration configuration)
        {
            var redis = ConnectionMultiplexer.Connect(configuration.GetConnectionString("RedisConnection"));
            //var redis = ConnectionMultiplexer.Connect(configuration.GetConnectionString("RedisConnectionDefault"));

            this.cacheDb = redis.GetDatabase();
            this.connectionMultiplexer = redis;
        }

        public async Task ClearCacheWithPrefix(string prefix)
        {
            var server = connectionMultiplexer.GetServer(cacheDb.Multiplexer.GetEndPoints()[0]);
            var keys = server.Keys(pattern: $"{prefix}*");

            foreach (var key in keys)
            {
                await cacheDb.KeyDeleteAsync(key);
            }
            throw new NotImplementedException();
        }

        public async Task<T> GetData<T>(string key)
        {
            var value = await cacheDb.StringGetAsync(key);

            if (!string.IsNullOrEmpty(value))
            {
                return JsonConvert.DeserializeObject<T>(value);
            }

            return default(T);
        }

        public async Task<bool> RemoveData<T>(string key)
        {
            if (await cacheDb.KeyExistsAsync(key))
            {
                await cacheDb.KeyDeleteAsync(key);

                return true;
            }

            return false;
        }

        public Task<bool> SetData<T>(string key, T value, DateTimeOffset expirationTime)
        {
            var expirtyTime = expirationTime.DateTime.Subtract(DateTime.Now);

            return cacheDb.StringSetAsync(key, JsonConvert.SerializeObject(value, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        }), 
                        expirtyTime);
        }
    }
}
