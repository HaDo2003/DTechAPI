namespace DTech.Application.DTOs.Request
{
    public class FilterReqDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 15;
        public string SortOrder { get; set; } = "newest";

        public decimal? MinPrice { get; set; } = 0;
        public decimal? MaxPrice { get; set; } = decimal.MaxValue;
        public bool? InStock { get; set; }
        public int? Rating { get; set; }

        // Laptop
        public List<string>? Cpu { get; set; }
        public List<string>? Ram { get; set; }
        public List<string>? Storage { get; set; }
        public List<string>? OperatingSystem { get; set; }

        // Smartphone
        public List<string>? Screen { get; set; }
        public List<string>? Battery { get; set; }
        public List<string>? Camera { get; set; }

        // Tablet
        public List<string>? Display { get; set; }
        public List<string>? Connectivity { get; set; }

        // Keyboard
        public List<string>? SwitchType { get; set; }
        public List<string>? Backlight { get; set; }

        // Mouse
        public List<string>? Dpi { get; set; }
        public List<string>? SensorType { get; set; }

        // Headphone
        public List<string>? Type { get; set; }
        public List<string>? NoiseCancelling { get; set; }
    }
}
