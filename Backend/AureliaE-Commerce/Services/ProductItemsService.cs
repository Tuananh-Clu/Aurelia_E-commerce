using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using MongoDB.Driver;

namespace AureliaE_Commerce.Services
{
 
    public class ProductItemsService : IProductItemsService
    {
        private readonly IMongoCollection<Product> _mongoCollection;
        private readonly ILogger<ProductItemsService> _logger;

        public ProductItemsService(MongoDbContext dbContext, ILogger<ProductItemsService> logger)
        {
            _mongoCollection = dbContext.SanPham;
            _logger = logger;
        }


        public async Task AddProduct(List<Product> products)
        {
            if (products == null || !products.Any())
            {
                throw new ArgumentException("Products list cannot be null or empty", nameof(products));
            }

            try
            {
                var deleteResult = await _mongoCollection.DeleteManyAsync(_ => true);
                _logger.LogInformation("Deleted {Count} existing products", deleteResult.DeletedCount);

                await _mongoCollection.InsertManyAsync(products);
                _logger.LogInformation("Added {Count} new products", products.Count);
            }
            catch (MongoWriteException ex)
            {
                _logger.LogError(ex, "Error adding products to database");
                throw;
            }
        }

        public async Task<List<Product>> GetProduct()
        {
            try
            {
                var products = await _mongoCollection.Find(_ => true).ToListAsync();
                _logger.LogDebug("Retrieved {Count} products", products.Count);
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                throw;
            }
        }


        public async Task<List<Product>> SearchProduct(string? key)
        {
            try
            {
              
                if (string.IsNullOrWhiteSpace(key))
                {
                    return await GetProduct();
                }

                var searchKey = key.Trim().ToLower();

                var filter = Builders<Product>.Filter.Or(
                    Builders<Product>.Filter.Regex(p => p.name, new MongoDB.Bson.BsonRegularExpression(searchKey, "i")),
                    Builders<Product>.Filter.Regex(p => p.brand, new MongoDB.Bson.BsonRegularExpression(searchKey, "i"))
                );

                var products = await _mongoCollection.Find(filter).ToListAsync();
                _logger.LogDebug("Search for '{Key}' returned {Count} results", key, products.Count);
                
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with key: {Key}", key);
                throw;
            }
        }


        public async Task UpdateQuantityProduct(List<ProductUpdateDto> dtos)
        {
            if (dtos == null || !dtos.Any())
            {
                throw new ArgumentException("Product update list cannot be null or empty", nameof(dtos));
            }

            try
            {
                foreach (var dto in dtos)
                {
                    if (string.IsNullOrWhiteSpace(dto.productId))
                    {
                        _logger.LogWarning("Skipping update with empty product ID");
                        continue;
                    }

                    var filter = Builders<Product>.Filter.Eq(a => a.id, dto.productId);
                    var update = Builders<Product>.Update
                        .Inc(a => a.stock, -dto.quantity)
                        .Inc(s => s.sold, +dto.quantity);

                    var result = await _mongoCollection.UpdateOneAsync(filter, update);
                    
                    if (result.MatchedCount == 0)
                    {
                        _logger.LogWarning("Product with ID {ProductId} not found for quantity update", dto.productId);
                    }
                    else
                    {
                        _logger.LogDebug("Updated quantity for product {ProductId}: -{Quantity} stock, +{Quantity} sold", 
                            dto.productId, dto.quantity, dto.quantity);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product quantities");
                throw;
            }
        }
    }
}

