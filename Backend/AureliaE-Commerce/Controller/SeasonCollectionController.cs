using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SeasonCollectionController : ControllerBase
    {
        private readonly IMongoCollection<LuxuryCollection> _collectionCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly ILogger<SeasonCollectionController> _logger;

        public SeasonCollectionController(MongoDbContext dbContext, ILogger<SeasonCollectionController> logger)
        {
            _collectionCollection = dbContext.SeasonCollection;
            _productCollection = dbContext.SanPham;
            _logger = logger;
        }

        [HttpGet("GetCollection")]
        [ProducesResponseType(typeof(ApiResponse<List<LuxuryCollection>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCollection()
        {
            try
            {
                var collections = await _collectionCollection.Find(_ => true).ToListAsync();
                _logger.LogDebug("Retrieved {Count} collections", collections.Count);
                return Ok(ApiResponse<List<LuxuryCollection>>.SuccessResponse(collections, "Lấy danh sách collection thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving collections");
                throw;
            }
        }

        [HttpPost("AddSeason")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddSeasonFromFile(IFormFile formFile)
        {
            try
            {
                if (formFile == null || formFile.Length == 0)
                {
                    return BadRequest(ApiResponse.Error("File không được để trống"));
                }

                if (!formFile.ContentType.Contains("json"))
                {
                    return BadRequest(ApiResponse.Error("File phải là định dạng JSON"));
                }

                using var reader = new StreamReader(formFile.OpenReadStream());
                var json = await reader.ReadToEndAsync();
                List<LuxuryCollection>? collections;
                
                try
                {
                    collections = JsonSerializer.Deserialize<List<LuxuryCollection>>(json);
                }
                catch (JsonException)
                {
                    return BadRequest(ApiResponse.Error("File JSON không đúng định dạng"));
                }

                if (collections == null || collections.Count == 0)
                {
                    return BadRequest(ApiResponse.Error("Không có dữ liệu collection hợp lệ"));
                }

                await _collectionCollection.DeleteManyAsync(_ => true);
                await _collectionCollection.InsertManyAsync(collections);
                _logger.LogInformation("Imported {Count} collections from file", collections.Count);
                return Ok(ApiResponse.Success($"Thêm {collections.Count} collection thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing collections from file");
                throw;
            }
        }

        [HttpGet("GetProductWithId")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductByCollectionId([FromQuery] string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(ApiResponse.Error("Collection ID không được để trống"));
                }

                var collections = await _collectionCollection.Find(_ => true).ToListAsync();
                var products = await _productCollection.Find(_ => true).ToListAsync();
                var productDict = products.ToDictionary(p => p.id, p => p);

                var seasonCollectionsWithProducts = collections
                    .Where(a => a.id == id)
                    .Select(season => new
                    {
                        Season = season,
                        Products = season.products
                            .Select(pro =>
                            {
                                productDict.TryGetValue(pro.id, out var product);
                                return product;
                            })
                            .Where(prod => prod != null)
                            .ToList()
                    }).ToList();

                var filter = Builders<LuxuryCollection>.Filter.Eq(a => a.id, id);
                var update = Builders<LuxuryCollection>.Update.Inc(a => a.views, 1);
                await _collectionCollection.UpdateOneAsync(filter, update);

                _logger.LogDebug("Retrieved products for collection {CollectionId}", id);
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    SeasonCollectionsWithProducts = seasonCollectionsWithProducts
                }, "Lấy sản phẩm theo collection thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products by collection ID");
                throw;
            }
        }

        [HttpGet("GetStatCollection")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStatCollection()
        {
            try
            {
                var collections = await _collectionCollection.Find(_ => true).ToListAsync();
                var totalCollection = collections.Count;
                var totalProduct = collections.Sum(a => a.products?.Count ?? 0);
                var rating = collections.Any() ? collections.Average(a => a.rate) : 0;
                var views = collections.Any() ? collections.Average(a => a.views) : 0;

                _logger.LogDebug("Retrieved collection statistics");
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    totalCollection,
                    totalProduct,
                    totalRating = rating,
                    totalViews = views
                }, "Lấy thống kê collection thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving collection statistics");
                throw;
            }
        }

        [HttpPost("AddCollection")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddCollection([FromBody] LuxuryCollection luxuryCollection)
        {
            try
            {
                if (luxuryCollection == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu collection không được để trống"));
                }

                await _collectionCollection.InsertOneAsync(luxuryCollection);
                _logger.LogInformation("Collection added: {CollectionId}", luxuryCollection.id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.CREATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding collection");
                throw;
            }
        }

        [HttpPut("UpdateCollection")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCollection([FromBody] LuxuryCollection luxuryCollection)
        {
            try
            {
                if (luxuryCollection == null || string.IsNullOrWhiteSpace(luxuryCollection.id))
                {
                    return BadRequest(ApiResponse.Error("Collection ID không được để trống"));
                }

                var filter = Builders<LuxuryCollection>.Filter.Eq(a => a.id, luxuryCollection.id);
                var update = Builders<LuxuryCollection>.Update
                    .Set(a => a.slug, luxuryCollection.slug)
                    .Set(a => a.name, luxuryCollection.name)
                    .Set(a => a.slogan, luxuryCollection.slogan)
                    .Set(a => a.description, luxuryCollection.description)
                    .Set(a => a.banner, luxuryCollection.banner)
                    .Set(a => a.seasonalAttributes, luxuryCollection.seasonalAttributes)
                    .Set(a => a.products, luxuryCollection.products)
                    .Set(a => a.rate, luxuryCollection.rate)
                    .Set(a => a.active, luxuryCollection.active)
                    .Set(a => a.views, luxuryCollection.views);

                var result = await _collectionCollection.UpdateOneAsync(filter, update);
                
                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Collection updated: {CollectionId}", luxuryCollection.id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating collection");
                throw;
            }
        }

        [HttpDelete("DeleteCollection")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteCollection([FromQuery] string collectionId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(collectionId))
                {
                    return BadRequest(ApiResponse.Error("Collection ID không được để trống"));
                }

                var result = await _collectionCollection.DeleteOneAsync(a => a.id == collectionId);
                
                if (result.DeletedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Collection deleted: {CollectionId}", collectionId);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.DELETED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting collection");
                throw;
            }
        }
    }
}
