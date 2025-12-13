using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using DnsClient;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IMongoCollection<Client> _collection;
        private readonly IMongoCollection<ShopAccount> mongoCollection;
        private readonly IMongoCollection<Shop> Collection;
        private readonly IMongoCollection<AdminAccount> collection;
        private readonly IConfiguration _configuration;

        public AuthenticationController(MongoDbContext dbContext, IConfiguration configuration)
        {
            _collection = dbContext.Client;
            mongoCollection = dbContext.ShopAccount;
            Collection = dbContext.Shop;
            _configuration = configuration;
            collection = dbContext.AdminAccount;
        }

        private string Generate(Client client)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, client.Id),
                    new Claim(JwtRegisteredClaimNames.Email, client.Email),
                    new Claim(ClaimTypes.Name, client.Name),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private string GenerateAccount(ShopAccount shop)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, shop.id),
                    new Claim(JwtRegisteredClaimNames.Email, shop.email),
                    new Claim(ClaimTypes.Name, shop.shopId),
                }),
                Expires = DateTime.UtcNow.AddDays(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private string GenerateAdminAccount(AdminAccount adminAccount)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, adminAccount.Id),
                    new Claim(JwtRegisteredClaimNames.Email, adminAccount.Email),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("LogIn")]
        public async Task<IActionResult> LogInAccount([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }

            var filter = Builders<Client>.Filter.Eq(a => a.Email, loginDto.Email);
            var data = await _collection.Find(filter).FirstOrDefaultAsync();

            if (data == null)
            {
                return BadRequest(new { success = false, message = "Không tìm thấy Email" });
            }

            if (BCrypt.Net.BCrypt.Verify(loginDto.Password,data.PassWord)==true)
            {
                var token = Generate(data);
                Response.Cookies.Append("access_token_user", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công"
                }
                );
            }

            return BadRequest(new { success = false, message = "Sai Email hoặc Mật khẩu" });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] SignUpDto signUpDto)
        {
            if (signUpDto == null || string.IsNullOrEmpty(signUpDto.UserName) || string.IsNullOrEmpty(signUpDto.Email) || string.IsNullOrEmpty(signUpDto.Password))
            {
                return BadRequest(new { success = false, message = "Không được để trống Tên, Email hoặc Mật khẩu" });
            }

            var existingUser = await _collection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email này đã được đăng ký" });
            }
            var filter = Builders<Client>.Filter.Eq(a => a.Email, signUpDto.Email);
            var data = await _collection.Find(filter).FirstOrDefaultAsync();
            var passwordHasher = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password,workFactor:12);
            var client = new Client
            {
                Id = Guid.NewGuid().ToString(),
                Email = signUpDto.Email,
                PassWord = passwordHasher,
                Name = signUpDto.UserName,
                Point = 0,
                Tier = "Bronze",
                NgayTaoTaiKhoan = DateTime.Now
            };

            await _collection.InsertOneAsync(client);
            var token = Generate(client);
            Response.Cookies.Append("access_token_user", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { success = true, message = "Đăng ký thành công"
            });
        }
        [HttpPost("ShopRegister")]
        public async Task<IActionResult> ShopRegister([FromBody] ShopSignUpDTo signUpDto)
        {
            try
            {
                if (signUpDto == null)
                    return BadRequest(new { success = false, message = "Dữ liệu đăng ký không được để trống" });


                var existingUser = await _collection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                    return BadRequest(new { success = false, message = "Email đã tồn tại trong hệ thống" });

                var existingAdmin = await _collection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingAdmin != null)
                    return BadRequest(new { success = false, message = "Email đã tồn tại trong hệ thống" });
                var passwordHasher = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password, workFactor: 12);
                var newAdmin = new ShopAccount
                {
                    id = Guid.NewGuid().ToString(),
                    email = signUpDto.Email,
                    password = passwordHasher,
                    shopId=signUpDto.shopId,
                    NgayTaoTaiKhoan = DateTime.Now
                };

                await mongoCollection.InsertOneAsync(newAdmin);
                var token = GenerateAccount(newAdmin);
                Response.Cookies.Append("access_token_shop", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new
                {
                    success = true,
                    message = "Đăng ký admin thành công",
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Lỗi đăng ký admin: " + ex.Message);
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }
        [HttpPost("LogInShop")]
        public async Task<IActionResult> LogInShop([FromBody]LoginDto login)
        {
            int currentFactory = 12;

            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                {
                    return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
                }
            var data = await mongoCollection.Find(a => a.email == login.Email).FirstOrDefaultAsync();
            if (data == null)
            {
                return BadRequest(new { success = false, message = "Email Không Tồn Tại " });
            }
            if (BCrypt.Net.BCrypt.Verify(login.Password, data.password) == false)
            {
                return BadRequest(new { success = false, message = "Sai Mật Khẩu " });
            }
            
            var token = GenerateAccount(data);
             Response.Cookies.Append("access_token_shop", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new
                {
                    message = "Đăng Nhập Thành Công",
                });

        }
        [HttpPost("CreateAdminAccount")]
        public async Task<IActionResult> CreateAdmin([FromBody]SignUpDto signUpDto)
        {
            if (signUpDto == null || string.IsNullOrEmpty(signUpDto.UserName) || string.IsNullOrEmpty(signUpDto.Email) || string.IsNullOrEmpty(signUpDto.Password))
            {
                return BadRequest(new { success = false, message = "Không được để trống Tên, Email hoặc Mật khẩu" });
            }

            var existingUser = await _collection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email này đã được đăng ký" });
            }
            var passwordHasher = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password, workFactor: 12);
            var admin = new AdminAccount
            {
                Id = Guid.NewGuid().ToString(),
                Email = signUpDto.Email,
                Password = passwordHasher,
            };

            await collection.InsertOneAsync(admin);
            var token = GenerateAdminAccount(admin);
             Response.Cookies.Append("access_token_admin", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
            return Ok(new
            {
                success = true,
                message = "Đăng ký thành công",
            });
        }
        [HttpPost("LogInAdminSite")]
        public async Task<IActionResult> LogInAdminSite([FromBody]LoginDto login)
        {
            int currentFactory = 12;

            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest(new { success = false, message = "Không được để Email hoặc Mật khẩu trống" });
            }
            var filter = Builders<AdminAccount>.Filter.Eq(A => A.Email, login.Email);
            var data = await collection.Find(filter).FirstOrDefaultAsync();
            if (data == null)
            {
                return BadRequest(new { success = false, message = "Email Không Tồn Tại " });
            }
            if (BCrypt.Net.BCrypt.Verify(login.Password, data.Password) == false)
            {
                return BadRequest(new { success = false, message = "Sai Mật Khẩu " });
            }
            if(BCrypt.Net.BCrypt.Verify(login.Password, data.Password) == true)
            {
                var token = GenerateAdminAccount(data);
                 Response.Cookies.Append("access_token_admin", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new
                {
                    message = "Đăng Nhập Thành Công",
                    token = token,
                });
            }
            else
            {
                return BadRequest("Not Found");
            }

        }
        [HttpGet("GetData")] 
        public async Task<IActionResult> GetAllClients([FromQuery] string typeAccount)
        {
            var token= Request.Cookies[$"access_token_{typeAccount}"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { success = false, message = "Token không hợp lệ hoặc đã hết hạn",tokens=token });
            }
            var handle=new JwtSecurityTokenHandler();
            var jwtToken=handle.ReadJwtToken(token);
            var userId= jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (typeAccount == "client")
            {
                var clients = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _collection.Find(clients).ToListAsync();
                return Ok(clients);
            }
            else if (typeAccount == "shop")
            {
                var shops = Builders<ShopAccount>.Filter.Eq(a => a.id, userId);
                var shop = await mongoCollection.Find(shops).ToListAsync();
                return Ok(shop);
            }
            else if (typeAccount == "admin")
            {
                var admins = Builders<AdminAccount>.Filter.Eq(a => a.Id, userId);
                var admin = await collection.Find(admins).ToListAsync();
                return Ok(admins);
            }
            else
            {
                return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });
            }
        }
    }
}
