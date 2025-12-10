using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class GetAIAdvice : ControllerBase
    {
        private readonly IMongoCollection<Client> _clientCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly ILogger<GetAIAdvice> _logger;

        public GetAIAdvice(MongoDbContext dbContext, ILogger<GetAIAdvice> logger)
        {
            _clientCollection = dbContext.Client;
            _productCollection = dbContext.SanPham;
            _logger = logger;
        }

        public enum Size
        {
            Unknown = 0,
            XS = 1,
            S = 2,
            M = 3,
            L = 4,
            XL = 5
        }

        [NonAction]
        private string? GetUserIdFromToken(string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = token.Substring("Bearer ".Length).Trim();
            }

            if (string.IsNullOrWhiteSpace(token))
                return null;

            try
            {
                var jwt = new JwtSecurityTokenHandler();
                if (!jwt.CanReadToken(token))
                    return null;

                var userId = jwt.ReadJwtToken(token).Claims.FirstOrDefault(a => a.Type == "sub")?.Value;
                return userId;
            }
            catch
            {
                return null;
            }
        }

        [NonAction]
        private Size GetSizeFromBody(double soDo, string type, string name)
        {
            var topSizes = new[]
            {
                new { Size = Size.XS, BustMin = 76, BustMax = 80, ShoulderMin = 34, ShoulderMax = 36 },
                new { Size = Size.S, BustMin = 81, BustMax = 84, ShoulderMin = 36, ShoulderMax = 37 },
                new { Size = Size.M, BustMin = 85, BustMax = 88, ShoulderMin = 37, ShoulderMax = 38 },
                new { Size = Size.L, BustMin = 89, BustMax = 92, ShoulderMin = 38, ShoulderMax = 39 },
                new { Size = Size.XL, BustMin = 93, BustMax = 96, ShoulderMin = 39, ShoulderMax = 40 },
            };

            var dressSizes = new[]
            {
                new { Size = Size.XS, BustMin = 76, BustMax = 80, WaistMin = 60, WaistMax = 64, HipMin = 82, HipMax = 86 },
                new { Size = Size.S, BustMin = 81, BustMax = 84, WaistMin = 65, WaistMax = 68, HipMin = 87, HipMax = 90 },
                new { Size = Size.M, BustMin = 85, BustMax = 88, WaistMin = 69, WaistMax = 72, HipMin = 91, HipMax = 94 },
                new { Size = Size.L, BustMin = 89, BustMax = 92, WaistMin = 73, WaistMax = 76, HipMin = 95, HipMax = 98 },
                new { Size = Size.XL, BustMin = 93, BustMax = 96, WaistMin = 77, WaistMax = 80, HipMin = 99, HipMax = 102 },
            };

            if (type == "top")
            {
                foreach (var t in topSizes)
                {
                    if (name == "Bust" && soDo >= t.BustMin && soDo <= t.BustMax)
                        return t.Size;
                    if (name == "Shoulder" && soDo >= t.ShoulderMin && soDo <= t.ShoulderMax)
                        return t.Size;
                }
            }
            else if (type == "dress")
            {
                foreach (var d in dressSizes)
                {
                    if (name == "Bust" && soDo >= d.BustMin && soDo <= d.BustMax)
                        return d.Size;
                    if (name == "Waist" && soDo >= d.WaistMin && soDo <= d.WaistMax)
                        return d.Size;
                    if (name == "Hip" && soDo >= d.HipMin && soDo <= d.HipMax)
                        return d.Size;
                }
            }

            return Size.Unknown;
        }

        [HttpPost("GetAdviceSize")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAdviceSize(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] ProductGetAdviceFromUserDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(ApiResponse.Error("Token không được để trống"));
                }

                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (dto == null || string.IsNullOrWhiteSpace(dto.type) || string.IsNullOrWhiteSpace(dto.subCategory))
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu sản phẩm không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                if (client.SoDoNgDUng == null)
                {
                    return BadRequest(ApiResponse.Error("Người dùng chưa có số đo. Vui lòng đo số đo trước."));
                }

                if (!double.TryParse(client.SoDoNgDUng.nguc, out var bust) ||
                    !double.TryParse(client.SoDoNgDUng.eo, out var waist) ||
                    !double.TryParse(client.SoDoNgDUng.hong, out var hip) ||
                    !double.TryParse(client.SoDoNgDUng.vai, out var shoulder))
                {
                    return BadRequest(ApiResponse.Error("Số đo không hợp lệ"));
                }

                if (dto.type == "top" && dto.subCategory.Contains("top"))
                {
                    var sizeBust = GetSizeFromBody(bust, "top", "Bust");
                    var sizeShoulder = GetSizeFromBody(shoulder, "top", "Shoulder");

                    if (sizeBust == sizeShoulder)
                    {
                        _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, sizeBust);
                        return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {sizeBust}" }, "Gợi ý size thành công"));
                    }

                    if (Math.Abs((int)sizeBust - (int)sizeShoulder) == 1)
                    {
                        _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, sizeShoulder);
                        return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {sizeShoulder}" }, "Gợi ý size thành công"));
                    }

                    var bigger = (int)sizeBust > (int)sizeShoulder ? sizeBust : sizeShoulder;
                    _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, bigger);
                    return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {bigger}" }, "Gợi ý size thành công"));
                }
                else if (dto.type == "d" && dto.subCategory.Contains("dress"))
                {
                    var sizeBust = GetSizeFromBody(bust, "dress", "Bust");
                    var sizeWaist = GetSizeFromBody(waist, "dress", "Waist");
                    var sizeHip = GetSizeFromBody(hip, "dress", "Hip");

                    if (sizeBust == sizeWaist && sizeWaist == sizeHip)
                    {
                        _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, sizeBust);
                        return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {sizeBust}" }, "Gợi ý size thành công"));
                    }

                    if (sizeWaist == sizeBust || sizeWaist == sizeHip)
                    {
                        _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, sizeWaist);
                        return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {sizeWaist}" }, "Gợi ý size thành công"));
                    }

                    var finalSize = new[] { sizeBust, sizeWaist, sizeHip }.Max();
                    _logger.LogDebug("Size recommendation for user {UserId}: {Size}", userId, finalSize);
                    return Ok(ApiResponse<object>.SuccessResponse(new { message = $"AI gợi ý size: {finalSize}" }, "Gợi ý size thành công"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { message = "Sản phẩm không thể ước tính size" }, "Không thể gợi ý size cho loại sản phẩm này"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting AI size advice");
                throw;
            }
        }
    }
}
