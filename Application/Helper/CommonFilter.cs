using DTech.Application.DTOs.Request;
using DTech.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DTech.Application.Helper
{
    internal static class CommonFilter
    {
        public static IQueryable<Product> ApplyCommonFilters(
            this IQueryable<Product> query,
            FilterReqDto filter
        )
        {
            if (filter.MinPrice.HasValue)
            {
                Console.WriteLine($"[DEBUG FILTER] MinPrice filter: {filter.MinPrice.Value}");
                query = query.Where(p => p.PriceAfterDiscount >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue && filter.MaxPrice > 0 && filter.MaxPrice > filter.MinPrice)
            {
                Console.WriteLine($"[DEBUG FILTER] MaxPrice filter: {filter.MaxPrice.Value}");
                query = query.Where(p => p.PriceAfterDiscount <= filter.MaxPrice.Value);
            }

            if (filter.InStock.HasValue)
            {
               Console.WriteLine($"[DEBUG FILTER] InStock filter: {filter.InStock.Value}");
               query = query.Where(p => p.QuantityInStock > 0);
            }

            if (filter.Rating.HasValue)
            {
                Console.WriteLine($"[DEBUG FILTER] Rating filter: {filter.Rating.Value}");
                var minRating = filter.Rating.Value;
                query = query.Where(p =>
                    p.ProductComments.Any() &&
                    p.ProductComments.Average(c => c.Rate ?? 0) >= minRating
                );
            }

            return query;
        }
    }
}
