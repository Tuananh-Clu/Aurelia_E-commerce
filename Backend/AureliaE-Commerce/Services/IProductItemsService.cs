using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;

namespace AureliaE_Commerce.Services
{

    public interface IProductItemsService
    {
        Task AddProduct(List<Product> products);
        Task<List<Product>> GetProduct();

        Task<List<Product>> SearchProduct(string? key);
        Task UpdateQuantityProduct(List<ProductUpdateDto> dtos);
    }
}


