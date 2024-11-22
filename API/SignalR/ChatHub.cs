using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Application.Comments;
using Microsoft.AspNetCore.Server.IIS.Core;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients
                .Group(command.ActivityId.ToString()) //in clients who we wants to send
                .SendAsync("ReceiveComment", comment.Value);//第一個參數代表在client端要接command的方法，第二個參數是要傳送得的值
        }

        public override async Task OnConnectedAsync()
        {
            //get activityId from query strings
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"]; //spelling is important

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId); //add connected clients to the group
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)}); //send those comment belones to activityId to the clents
            await Clients.Caller.SendAsync("LoadComments", result.Value); //Client (caller the person making this request) is who we want to send List<Comment> to
        }
    }
}