using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
    public class ProductItemsService
    {
        public readonly IMongoCollection<Product> mongoCollection;
        public ProductItemsService(MongoDbContext dbContext)
        {
            mongoCollection = dbContext.SanPham;
        }
        public async Task AddProduct(List<Product> products)
        {
            await mongoCollection.DeleteManyAsync(_ => true);
          await mongoCollection.InsertManyAsync(products);
        }
        public async Task<List<Product>> getProduct()
        {
            return await mongoCollection.Find(_ => true).ToListAsync();
        }
        public async Task<List<Product>> SearchProduct(string? key)
        {
            
            var data = await mongoCollection.Find(_ => true).ToListAsync();
            if (string.IsNullOrEmpty(key))
            {
                return data;
            }
            var lower = key.Trim().ToLower();
            var find = data.Where(A => A.name.Trim().ToLower().Contains(lower)).ToList();
            if (find == null)
            {
                find = data.Where(a => a.brand.Trim().ToLower().Contains(lower)).ToList();
            }
            return find;

        }
        public async Task UpdateQuantityProduct(List<ProductUpdateDto> dtos)
        {
            foreach(var dto in dtos){
                var filter = Builders<Product>.Filter.Eq(a => a.id, dto.productId);
                var update = Builders<Product>.Update.Inc(a => a.stock, -dto.quantity).Inc(s => s.sold, +dto.quantity);
                await mongoCollection.UpdateOneAsync(filter, update);
            }
        }
    }
}
