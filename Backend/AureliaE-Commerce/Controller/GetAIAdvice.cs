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
    public class GetAIAdvice : ControllerBase
    {
        private readonly IMongoCollection<Client> _clientCollection;

        public GetAIAdvice(MongoDbContext dbContext)
        {
            _clientCollection = dbContext.Client;
        }
        private enum Size
        {
            XS,
            S,
            M,
            L,
            XL
        }

        private class SizeRule
        {
            public Size Size { get; set; }
            public double Bust { get; set; }
            public double Waist { get; set; }
            public double Hip { get; set; }
            public double Shoulder { get; set; }
        }

        private static readonly List<SizeRule> SizeChart = new()
        {
            new() { Size = Size.XS, Bust = 78, Waist = 62, Hip = 84, Shoulder = 35 },
            new() { Size = Size.S,  Bust = 82, Waist = 66, Hip = 88, Shoulder = 36.5 },
            new() { Size = Size.M,  Bust = 86, Waist = 70, Hip = 92, Shoulder = 37.5 },
            new() { Size = Size.L,  Bust = 90, Waist = 74, Hip = 96, Shoulder = 38.5 },
            new() { Size = Size.XL, Bust = 94, Waist = 78, Hip = 100, Shoulder = 39.5 },
        };

        private (Size size, string note) CalculateFemaleSize(
            double bust,
            double waist,
            double hip,
            double shoulder,
            string productType 
        )
        {
            const double SAFE_GAP = 3.0; 
            var candidates = new List<(Size size, double score, string note)>();

            foreach (var r in SizeChart)
            {
                if (r.Bust < bust - SAFE_GAP) continue;
                if (productType == "dress" && r.Hip < hip - SAFE_GAP) continue;

                double score;
                string note;

                if (productType == "top")
                {
                    score =
                        Math.Abs(r.Bust - bust) * 0.6 +
                        Math.Abs(r.Shoulder - shoulder) * 0.4;

                    note = bust > r.Bust
                        ? "Ưu tiên theo vòng ngực, có thể hơi rộng vai"
                        : "Form vừa ngực và vai";
                }
                else 
                {
                    score =
                        Math.Abs(r.Bust - bust) * 0.4 +
                        Math.Abs(r.Hip - hip) * 0.35 +
                        Math.Abs(r.Waist - waist) * 0.25;

                    if (hip > bust + 4)
                        note = "Dáng hông lớn, chọn theo vòng hông, eo có thể rộng";
                    else if (bust > hip + 4)
                        note = "Dáng ngực lớn, chọn theo vòng ngực";
                    else
                        note = "Form cân đối";
                }

                candidates.Add((r.Size, score, note));
            }

            if (candidates.Any())
                return candidates.OrderBy(c => c.score).Select(c => (c.size, c.note)).First();

            var fallback = SizeChart.Last();
            return (
                fallback.Size,
                "Số đo lệch chuẩn, chọn size lớn nhất để đảm bảo mặc vừa"
            );
        }

        [NonAction]
        private string GetUserIdFromToken(string token)
        {
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();

            var jwt = new JwtSecurityTokenHandler();
            return jwt.ReadJwtToken(token)
                      .Claims.First(c => c.Type == "sub")
                      .Value;
        }

        [HttpPost("GetAdviceSize")]
        public async Task<IActionResult> GetAdviceSize(
            [FromHeader(Name = "Authorization")] string token,
            [FromBody] ProductGetAdviceFromUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(token))
                return Unauthorized();

            var userId = GetUserIdFromToken(token);

            var client = await _clientCollection
                .Find(c => c.Id == userId)
                .FirstOrDefaultAsync();

            if (client?.SoDoNgDUng == null)
                return BadRequest("Người dùng chưa có số đo");

            var sd = client.SoDoNgDUng;

            var bust = double.Parse(sd.nguc);
            var waist = double.Parse(sd.eo);
            var hip = double.Parse(sd.hong);
            var shoulder = double.Parse(sd.vai);

            var productType =
                dto.subCategory.Contains("dress") ? "dress" :
                dto.subCategory.Contains("top") ? "top" :
                null;

            if (productType == null)
            {
                return Ok(new
                {
                    message = "Không thể ước tính size cho sản phẩm này"
                });
            }

            var result = CalculateFemaleSize(
                bust,
                waist,
                hip,
                shoulder,
                productType
            );

            return Ok(new
            {
                size = result.size.ToString(),
                note = result.note,
                message = $"AI gợi ý size: {result.size}"
            });
        }
    }
}
