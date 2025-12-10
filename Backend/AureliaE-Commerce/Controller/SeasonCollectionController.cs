using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonCollectionController : ControllerBase
    {
        private readonly IMongoCollection<LuxuryCollection> mongoCollection;
        private readonly IMongoCollection<Product> sanpham;
        public SeasonCollectionController(MongoDbContext dbContext)
        {
            mongoCollection = dbContext.SeasonCollection;
            sanpham = dbContext.SanPham;
        }
        [HttpGet("GetCollection")]
        public async Task<IActionResult> GetCollection()
        {
            var data = await mongoCollection.Find(_ => true).ToListAsync();
            return Ok(data);
        }
        [HttpPost("AddSeason")]
        public async Task<IActionResult> AddProduct(IFormFile formFile)
        {
            if (formFile == null || formFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using var reader = new StreamReader(formFile.OpenReadStream());
            var json = await reader.ReadToEndAsync();
            List<LuxuryCollection>? result;
            try
            {
                result = JsonSerializer.Deserialize<List<LuxuryCollection>>(json);
            }
            catch (JsonException)
            {
                return BadRequest("Invalid JSON format.");
            }

            if (result == null || result.Count == 0)
            {
                return BadRequest("No valid season data found.");
            }
            await mongoCollection.DeleteManyAsync(_ => true);
            await mongoCollection.InsertManyAsync(result);
            return Ok(new { message = "Season data added successfully.", count = result.Count });
        }

        [HttpGet("GetProductWithId")]
        public async Task<IActionResult> Getproduct([FromQuery] string id)
        {
            var data = await mongoCollection.Find(_ => true).ToListAsync();
            var sanphams = await sanpham.Find(_ => true).ToListAsync();

            var productDict = sanphams.ToDictionary(p => p.id, p => p);

            var seasonCollectionsWithProducts = data.Where(a => a.id == id).Select(season => new
            {
                Season = season,
                Products =
                    season.products
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
            await mongoCollection.UpdateOneAsync(filter, update);

            return Ok(new
            {
                SeasonCollectionsWithProducts = seasonCollectionsWithProducts
            });
        }
        [HttpGet("GetStatCollection")]
        public async Task<IActionResult> GetStatCollection()
        {
            var data = await mongoCollection.Find(_ => true).ToListAsync();
            var totalCollection = data.Count;
            var totalProduct = data.Sum(a => a.products.Count);
            var rating = data.Average(a => a.rate);
            var views = data.Average(a => a.views);
            return Ok(
                new
                {
                    totalCollection=totalCollection,
                    totalProduct=totalProduct,
                    totalRating=rating,
                    totalViews=views
                });
        }
        [HttpPost("AddCollection")]
        public async Task<IActionResult> AddCollection([FromBody]LuxuryCollection luxuryCollection)
        {
            await mongoCollection.InsertOneAsync(luxuryCollection);
            return Ok("Thêm Thành Công");
        }
        [HttpPut("UpdateCollection")]
        public async Task<IActionResult> UpdateCollection([FromBody] LuxuryCollection luxuryCollection)
        {
            try
            {
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

                var result = await mongoCollection.UpdateOneAsync(filter, update);
                if (result.MatchedCount == 0)
                {
                    return NotFound("Collection not found.");
                }
                return Ok("Cập Nhật Thành Công!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("DeleteCollection")]
        public async Task<IActionResult> DeleteCollection([FromQuery] string collectionId)
        {
            await mongoCollection.DeleteOneAsync(a => a.id == collectionId);
            return Ok("Xóa Thành Công!");
        }
    }
}
