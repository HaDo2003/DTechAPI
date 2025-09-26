namespace DTech.Application.DTOs.response.admin
{
    public class IndexResDto<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }
}
