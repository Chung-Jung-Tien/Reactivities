using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseAPIController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> Result)
        {
            if(Result == null)
            {
                return NotFound();
            }
            if (Result.IsSccess && Result.Value != null)
            {
                return Ok(Result.Value);
            }
            if(Result.IsSccess && Result.Value == null)
            {
                return NotFound();
            }
            
            return BadRequest(Result.Error);
        }
    }
}