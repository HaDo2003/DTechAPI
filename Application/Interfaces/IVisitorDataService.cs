using DTech.Application.DTOs.Response.Admin;

namespace DTech.Application.Interfaces
{
    public interface IVisitorDataService
    {
        Task<IndexResDto<object?>> UpdateVisitorCountAsync();
    }
}
