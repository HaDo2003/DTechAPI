
namespace DTech.Application.DTOs
{
    public class AdvertisementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int? Order { get; set; }
    }
}
