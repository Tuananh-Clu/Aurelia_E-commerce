using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.AttributeProduct;
using AureliaE_Commerce.Model.Shop;
using MongoDB.Driver;
using System.Drawing;

namespace AureliaE_Commerce.Services
{
    public class ShopService
    {
        public readonly IMongoCollection<Shop> Shoppe;
        public ShopService(MongoDbContext dbContext)
        {
            Shoppe=dbContext.Shop;
        }
        public async Task AddShop(List<Shop> shop)
        {
            await Shoppe.DeleteManyAsync(_ => true);   
            await Shoppe.InsertManyAsync(shop);

        }
        public async Task<List<Shop>> Shops(ShopFindDto dto)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq("products.productId", dto.idProduct),
                Builders<Shop>.Filter.Eq("products.variants.sizes.size", dto.ProductSize)
            );

            return await Shoppe.Find(filter).ToListAsync();
        }
        public async Task<List<Shop>> Shop(string id)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(a=>a.shopId, id)
            );

            return await Shoppe.Find(filter).ToListAsync();
        }


    }
}
