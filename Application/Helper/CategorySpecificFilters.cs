using DTech.Application.DTOs.Request;
using DTech.Domain.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace DTech.Application.Helper
{
    internal static class CategorySpecificFilters
    {
        public static IQueryable<Product> ApplyCategorySpecificFilters(
            this IQueryable<Product> query,
            string categorySlug,
            FilterReqDto filter
        )
        {
            return categorySlug switch
            {
                "laptop" => query.ApplyLaptopFilters(filter),
                "smart-phone" => query.ApplySmartphoneFilters(filter),
                "tablet" => query.ApplyTabletFilters(filter),
                "keyboard" => query.ApplyKeyboardFilters(filter),
                "mouse" => query.ApplyMouseFilters(filter),
                "headphone" => query.ApplyHeadphoneFilters(filter),
                _ => query
            };
        }

        private static IQueryable<Product> ApplyLaptopFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.OperatingSystem?.Count > 0)
            {
                var osPatterns = filter.OperatingSystem.Select(os => $"%{os.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Operating System" &&
                        s.Detail != null &&
                        osPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if(filter.Screen?.Count > 0)
            {
                var screenPatterns = filter.Screen.Select(ss => $"%{ss.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Screen Size" && s.Detail != null &&
                        screenPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Cpu?.Count > 0)
            {
                var cpuPatterns = filter.Cpu.Select(cpu => $"%{cpu.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "CPU" && s.Detail != null &&
                        cpuPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Ram?.Count > 0)
            {
                var ramPatterns = filter.Ram.Select(ram => $"%{ram.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "RAM" && s.Detail != null &&
                        ramPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Storage?.Count > 0)
            {
                var storagePatterns = filter.Storage.Select(storage => $"%{storage.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Storage" && s.Detail != null &&
                        storagePatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            return query;
        }

        private static IQueryable<Product> ApplySmartphoneFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.Screen?.Count > 0)
            {
                var screenPatterns = filter.Screen.Select(ss => $"%{ss.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Screen Size" && s.Detail != null &&
                        screenPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Battery?.Count > 0)
            {
                var batteryPatterns = filter.Battery.Select(bat => $"%{bat.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Battery" && s.Detail != null &&
                        batteryPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Camera?.Count > 0)
            {
                var cameraPatterns = filter.Camera.Select(cam => $"%{cam.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Camera" && s.Detail != null &&
                        cameraPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            return query;
        }

        private static IQueryable<Product> ApplyTabletFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.Display?.Count > 0)
            {
                var displayPatterns = filter.Display.Select(disp => $"%{disp.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Display" && s.Detail != null &&
                        displayPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Storage?.Count > 0)
            {
                var storagePatterns = filter.Storage.Select(storage => $"%{storage.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Storage" && s.Detail != null &&
                        storagePatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            if (filter.Connectivity?.Count > 0)
            {
                var connectivityPatterns = filter.Connectivity.Select(conn => $"%{conn.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Connectivity" && s.Detail != null &&
                        connectivityPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }
            return query;
        }

        private static IQueryable<Product> ApplyKeyboardFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.SwitchType?.Count > 0)
            {
                var switchTypePatterns = filter.SwitchType.Select(st => $"%{st.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Switch Type" && s.Detail != null &&
                        switchTypePatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }
            if (filter.Backlight?.Count > 0)
            {
                var backlightPatterns = filter.Backlight.Select(bl => $"%{bl.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Backlight" && s.Detail != null &&
                        backlightPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            return query;
        }

        private static IQueryable<Product> ApplyMouseFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.Dpi?.Count > 0)
            {
                var dpiPatterns = filter.Dpi.Select(dpi => $"%{dpi.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "DPI" && s.Detail != null &&
                        dpiPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }
            if (filter.SensorType?.Count > 0)
            {
                var sensorTypePatterns = filter.SensorType.Select(sensor => $"%{sensor.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Sensor Type" && s.Detail != null &&
                        sensorTypePatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            return query;
        }

        private static IQueryable<Product> ApplyHeadphoneFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.Type?.Count > 0)
            {
                var typePatterns = filter.Type.Select(type => $"%{type.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Type" && s.Detail != null &&
                        typePatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }
            if (filter.NoiseCancelling?.Count > 0)
            {
                var noiseCancellingPatterns = filter.NoiseCancelling.Select(nc => $"%{nc.ToLower()}%").ToList();
                query = query.Where(p =>
                    p.Specifications.Any(s =>
                        s.SpecName == "Noise Cancelling" && s.Detail != null &&
                        noiseCancellingPatterns.Any(pattern => EF.Functions.Like(s.Detail.ToLower(), pattern))
                    )
                );
            }

            return query;
        }
    }
}
