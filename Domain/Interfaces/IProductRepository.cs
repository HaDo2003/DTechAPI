using DTech.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTech.Domain.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetDiscountedProductsAsync();
        Task<List<Product>> GetAccessoriesAsync();
        Task<List<Product>> GetProductsByCategoryIdAsync(List<int> categoryIds);
    }
}
