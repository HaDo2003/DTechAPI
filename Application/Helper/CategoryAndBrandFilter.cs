using DTech.Domain.Entities;

namespace DTech.Application.Helper
{
    internal static class CategoryAndBrandFilter
    {
        public static IQueryable<Product> ApplyCategoryAndBrandFilter(
            this IQueryable<Product> query,
            string categorySlug,
            string? brandSlug
        )
        {
            if (categorySlug != "all-products")
                query = query.Where(p => p.Category != null && p.Category.Slug == categorySlug);

            if (!string.IsNullOrWhiteSpace(brandSlug))
                query = query.Where(p => p.Brand != null && p.Brand.Slug == brandSlug);

            return query;
        }
    }
}
