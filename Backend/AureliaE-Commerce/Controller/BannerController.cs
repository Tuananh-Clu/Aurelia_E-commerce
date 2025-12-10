using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model.Banner;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BannerController : ControllerBase
    {
        private readonly IMongoCollection<MainBanner> _mainBannerCollection;
        private readonly IMongoCollection<StoryBanner> _storyBannerCollection;
        private readonly ILogger<BannerController> _logger;

        public BannerController(MongoDbContext dbContext, ILogger<BannerController> logger)
        {
            _mainBannerCollection = dbContext.MainBanner;
            _storyBannerCollection = dbContext.StoryBanner;
            _logger = logger;
        }

        [HttpGet("GetBanner")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllBanner()
        {
            try
            {
                var mainBanners = await _mainBannerCollection.Find(_ => true).ToListAsync();
                var storyBanners = await _storyBannerCollection.Find(_ => true).ToListAsync();
                
                _logger.LogDebug("Retrieved {MainCount} main banners and {StoryCount} story banners", 
                    mainBanners.Count, storyBanners.Count);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    mainBanner = mainBanners,
                    storyBanner = storyBanners,
                }, "Lấy danh sách banner thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving banners");
                throw;
            }
        }

        [HttpPost("AddMainBanner")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddMainBanner([FromBody] MainBanner mainBanner)
        {
            try
            {
                if (mainBanner == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu banner không được để trống"));
                }

                await _mainBannerCollection.InsertOneAsync(mainBanner);
                _logger.LogInformation("Main banner added: {BannerId}", mainBanner.Id);

                return Ok(ApiResponse.Success(Constants.SuccessMessages.CREATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding main banner");
                throw;
            }
        }

        [HttpPost("AddStoryBanner")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddStoryBanner([FromBody] StoryBanner storyBanner)
        {
            try
            {
                if (storyBanner == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu story banner không được để trống"));
                }

                await _storyBannerCollection.InsertOneAsync(storyBanner);
                _logger.LogInformation("Story banner added: {BannerId}", storyBanner.Id);

                return Ok(ApiResponse.Success(Constants.SuccessMessages.CREATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding story banner");
                throw;
            }
        }

        [HttpPut("AdjustMainBanner")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateMainBanner([FromBody] MainBanner mainBanner)
        {
            try
            {
                if (mainBanner == null || string.IsNullOrWhiteSpace(mainBanner.Id))
                {
                    return BadRequest(ApiResponse.Error("Banner ID không được để trống"));
                }

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

                var result = await _mainBannerCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Main banner updated: {BannerId}", mainBanner.Id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating main banner");
                throw;
            }
        }

        [HttpPut("AdjustStoryBanner")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateStoryBanner([FromBody] StoryBanner storyBanner)
        {
            try
            {
                if (storyBanner == null || string.IsNullOrWhiteSpace(storyBanner.Id))
                {
                    return BadRequest(ApiResponse.Error("Story banner ID không được để trống"));
                }

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

                var result = await _storyBannerCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Story banner updated: {BannerId}", storyBanner.Id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating story banner");
                throw;
            }
        }
    }
}
