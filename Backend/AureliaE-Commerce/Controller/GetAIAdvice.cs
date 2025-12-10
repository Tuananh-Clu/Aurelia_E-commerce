    using AureliaE_Commerce.Context;
    using AureliaE_Commerce.Dto;
    using AureliaE_Commerce.Model;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using MongoDB.Driver;
    using System.IdentityModel.Tokens.Jwt;

    namespace AureliaE_Commerce.Controller
    {
        [Route("api/[controller]")]
        [ApiController]
        public class GetAIAdvice : ControllerBase
        {
            public readonly IMongoCollection<Client> mongoCollection;
            public readonly IMongoCollection<Product> productCollection;
            public GetAIAdvice(MongoDbContext dbContext)
            {
                mongoCollection = dbContext.Client;
                productCollection = dbContext.SanPham;

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
            public string GetHeader(string token)
            {
                if (token.StartsWith("Bearer "))
                {
                    token = token.Substring("Bearer ".Length).Trim();
                }
                var jwt = new JwtSecurityTokenHandler();
                var userId = jwt.ReadJwtToken(token).Claims.First(a => a.Type == "sub").Value;
                return userId;
            }
                [NonAction]
                public Size GetSizeFromBody(double soDo, string type, string name)
                {
                    var topSizes = new[]
                    {
                new { Size=Size.XS, BustMin=76, BustMax=80, ShoulderMin=34, ShoulderMax=36 },
                new { Size=Size.S,  BustMin=81, BustMax=84, ShoulderMin=36, ShoulderMax=37 },
                new { Size=Size.M,  BustMin=85, BustMax=88, ShoulderMin=37, ShoulderMax=38 },
                new { Size=Size.L,  BustMin=89, BustMax=92, ShoulderMin=38, ShoulderMax=39 },
                new { Size=Size.XL, BustMin=93, BustMax=96, ShoulderMin=39, ShoulderMax=40 },
            };

                    var dressSizes = new[]
                    {
                new { Size=Size.XS, BustMin=76, BustMax=80, WaistMin=60, WaistMax=64, HipMin=82, HipMax=86 },
                new { Size=Size.S,  BustMin=81, BustMax=84, WaistMin=65, WaistMax=68, HipMin=87, HipMax=90 },
                new { Size=Size.M,  BustMin=85, BustMax=88, WaistMin=69, WaistMax=72, HipMin=91, HipMax=94 },
                new { Size=Size.L,  BustMin=89, BustMax=92, WaistMin=73, WaistMax=76, HipMin=95, HipMax=98 },
                new { Size=Size.XL, BustMin=93, BustMax=96, WaistMin=77, WaistMax=80, HipMin=99, HipMax=102 },
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
                public async Task<IActionResult> GetAdvice([FromHeader(Name = "Authorization")] string token, [FromBody] ProductGetAdviceFromUserDto dto)
                {
            if (token == null)
            { return NotFound(); }
            var userId = GetHeader(token);
                    var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                    var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();

                    if (data.SoDoNgDUng == null) return NotFound();

                    var bust = double.Parse(data.SoDoNgDUng.nguc);
                    var waist = double.Parse(data.SoDoNgDUng.eo);
                    var hip = double.Parse(data.SoDoNgDUng.hong);
                    var shoulder = double.Parse(data.SoDoNgDUng.vai);

                    if (dto.type == "top" && dto.subCategory.Contains("top"))
                    {
                        var sizeBust = GetSizeFromBody(bust, "top", "Bust");
                        var sizeShoulder = GetSizeFromBody(shoulder, "top", "Shoulder");

                        if (sizeBust == sizeShoulder)
                            return Ok(new { message = $"AI gợi ý size: {sizeBust}" });

                        if (Math.Abs((int)sizeBust - (int)sizeShoulder) == 1)
                            return Ok(new { message = $"AI gợi ý size: {sizeShoulder}" });

                        var bigger = (int)sizeBust > (int)sizeShoulder ? sizeBust : sizeShoulder;
                        return Ok(new { message = $"AI gợi ý size: {bigger}" });
                    }
                    else if (dto.type == "d" && dto.subCategory.Contains("dress"))
                    {
                        var sizeBust = GetSizeFromBody(bust, "dress", "Bust");
                        var sizeWaist = GetSizeFromBody(waist, "dress", "Waist");
                        var sizeHip = GetSizeFromBody(hip, "dress", "Hip");

                        if (sizeBust == sizeWaist && sizeWaist == sizeHip)
                            return Ok(new { message = $"AI gợi ý size: {sizeBust}" });

                        if (sizeWaist == sizeBust || sizeWaist == sizeHip)
                            return Ok(new { message = $"AI gợi ý size: {sizeWaist}" });

                        var finalSize = new[] { sizeBust, sizeWaist, sizeHip }.Max();
                        return Ok(new { message = $"AI gợi ý size: {finalSize}" });
                    }

                    return Ok(new { message = "Sản phẩm không thể ước tính size" });
                }

        }
    }
