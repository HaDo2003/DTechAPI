
namespace DTech.Application.DTOs
{
    public class AdvertisementDto
    {
        public int AdvertisementId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int? Order { get; set; }
    }
}
