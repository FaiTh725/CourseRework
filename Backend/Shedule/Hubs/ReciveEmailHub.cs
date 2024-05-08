using Microsoft.AspNetCore.SignalR;
using Shedule.Services.Interfaces;

namespace Shedule.Hubs
{
    public class ReciveEmailHub : Hub
    {

        public async Task SubscrybeReciveMessage(UserSubscrybe model)
        {

            if (!model.OnSubscrybe)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "FileUploadOrDelete");
            }
            else
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FileUploadOrDelete");
            }
        }

        public async Task SendEmailAboutChangingShedule(string message)
        {
            await Clients.Group("FileUploadOrDelete").SendAsync("ReceiveSheduleChanging", message);
        }
    }

}
