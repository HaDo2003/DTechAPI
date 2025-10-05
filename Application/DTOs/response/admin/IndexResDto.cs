namespace DTech.Application.DTOs.Response.Admin
{
    public class IndexResDto<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }
}
