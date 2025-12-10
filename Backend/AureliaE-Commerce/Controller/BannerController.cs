using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model.Banner;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly IMongoCollection<MainBanner> mongoCollection;
        private readonly IMongoCollection<StoryBanner> mongo;
        public BannerController(MongoDbContext dbContext)
        {
            mongo = dbContext.StoryBanner;
            mongoCollection = dbContext.MainBanner;
        }
        [HttpGet("GetBanner")]
        public async Task<IActionResult> GetAllBanner()
        {
            var dataMainBanner = await mongoCollection.Find(_ => true).ToListAsync();
            var storyMainBanner = await mongo.Find(_ => true).ToListAsync();
            return Ok(new
            {
                mainBanner = dataMainBanner,
                storyBanner = storyMainBanner,
            });
        }
        [HttpPost("AddMainBanner")]
        public async Task<IActionResult> AddBanner([FromBody]MainBanner mainBanner)
        {
            await mongoCollection.InsertOneAsync(mainBanner);
            return Ok("Thêm Thành Công!");
        }
        [HttpPost("AddStoryBanner")]
        public async Task<IActionResult> AddStoryBanner([FromBody]StoryBanner story)
        {
            await mongo.InsertOneAsync(story);
            return Ok("Thêm Thành Công!");
        }
        [HttpPost("AdjustMainBanner")]
        public async Task<IActionResult> AdjustBanner([FromBody] MainBanner mainBanner)
        {
            var filter = Builders<MainBanner>.Filter.Eq(a => a.Id, mainBanner.Id);
            var update = Builders<MainBanner>.Update
                .Set(a => a.LinkUrl, mainBanner.LinkUrl)
                .Set(a => a.MainTitle, mainBanner.MainTitle)
                .Set(a => a.H1, mainBanner.H1)
                .Set(a => a.Pagaraph, mainBanner.Pagaraph)
                .Set(a => a.TextInButton, mainBanner.TextInButton)
                .Set(a => a.Active, mainBanner.Active)
                .Set(a => a.Layout, mainBanner.Layout)
                .Set(a => a.ColorMainTitle, mainBanner.ColorMainTitle)
                .Set(a => a.ColorText, mainBanner.ColorText);

            var result = await mongoCollection.UpdateOneAsync(filter, update);

            if (result.ModifiedCount > 0)
                return Ok("Cập nhật thành công!");
            else
                return NotFound("Không tìm thấy banner để cập nhật.");
        }
        [HttpPost("AdjustStoryBanner")]
        public async Task<IActionResult> AdjustStoryBanner([FromBody] StoryBanner storyBanner)
        {
            var filter = Builders<StoryBanner>.Filter.Eq(a => a.Id, storyBanner.Id);
            var update = Builders<StoryBanner>.Update
                .Set(a => a.LinkUrl, storyBanner.LinkUrl)
                .Set(a => a.MainTitle, storyBanner.MainTitle)
                .Set(a => a.H1, storyBanner.H1)
                .Set(a => a.Pagaraph, storyBanner.Pagaraph)
                .Set(a => a.Active, storyBanner.Active)
                .Set(a => a.Layout, storyBanner.Layout)
                .Set(a => a.ColorMainTitle, storyBanner.ColorMainTitle)
                .Set(a => a.ColorText, storyBanner.ColorText);

            var result = await mongo.UpdateOneAsync(filter, update);

            if (result.ModifiedCount > 0)
                return Ok("Cập nhật thành công!");
            else
                return NotFound("Không tìm thấy banner để cập nhật.");
        }
    }
}
