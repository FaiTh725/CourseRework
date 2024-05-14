namespace Shedule.MiddleWares
{
    public class AddBearerHeaderMiddleWare
    {
        private readonly RequestDelegate next;

        public AddBearerHeaderMiddleWare(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // request section
            var authHeader = context.Request.Headers["Authorization"];

            if (!string.IsNullOrEmpty(authHeader) && !authHeader.ToString().StartsWith("Bearer"))
            {
                context.Request.Headers.Remove("Authorization");
                context.Request.Headers.Add("Authorization", $"Bearer {authHeader}");
            }

            Task task =  next(context);

            // response section

            await task;
        }
    }
}
