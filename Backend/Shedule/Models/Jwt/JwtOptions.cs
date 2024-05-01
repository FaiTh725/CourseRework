namespace Shedule.Models.Jwt
{
    public class JwtOptions
    {
        public string Issuerr { get; set; }

        public string Audience { get; set; }

        public string SecretKey { get; set; }
    }
}
