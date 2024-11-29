using API.Extensions;
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
            if(Result == null) return NotFound();
                        
            if (Result.IsSccess && Result.Value != null) return Ok(Result.Value);
                        
            if(Result.IsSccess && Result.Value == null) return NotFound();
            
            return BadRequest(Result.Error);
        }

        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if(result == null) return NotFound();
                        
            if (result.IsSccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize, result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }
                        
            if(result.IsSccess && result.Value == null) return NotFound();
            
            return BadRequest(result.Error);
        }
    }
}