using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IMongoCollection<Client> _clientCollection;
        private readonly IMongoCollection<ShopAccount> _shopAccountCollection;
        private readonly IMongoCollection<Shop> _shopCollection;
        private readonly IMongoCollection<AdminAccount> _adminAccountCollection;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(
            MongoDbContext dbContext,
            IConfiguration configuration,
            ILogger<AuthenticationController> logger)
        {
            _clientCollection = dbContext.Client;
            _shopAccountCollection = dbContext.ShopAccount;
            _shopCollection = dbContext.Shop;
            _adminAccountCollection = dbContext.AdminAccount;
            _configuration = configuration;
            _logger = logger;
        }

        #region JWT Token Generation

        private string GenerateJwtToken(Client client)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, client.Id),
                    new Claim(JwtRegisteredClaimNames.Email, client.Email),
                    new Claim(ClaimTypes.Name, client.Name),
                }),
                Expires = DateTime.UtcNow.AddDays(Constants.JWT_EXPIRATION_DAYS),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateJwtToken(ShopAccount shop)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, shop.id),
                    new Claim(JwtRegisteredClaimNames.Email, shop.email),
                    new Claim(ClaimTypes.Name, shop.shopId),
                }),
                Expires = DateTime.UtcNow.AddDays(Constants.JWT_EXPIRATION_DAYS),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateJwtToken(AdminAccount adminAccount)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, adminAccount.Id),
                    new Claim(JwtRegisteredClaimNames.Email, adminAccount.Email),
                }),
                Expires = DateTime.UtcNow.AddDays(Constants.JWT_EXPIRATION_DAYS),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        #endregion

        #region User Authentication

        [HttpPost("LogIn")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogIn([FromBody] LoginDto loginDto)
        {
            try
            {
                if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT, 
                        new List<string> { "Email và mật khẩu không được để trống" }));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Email, loginDto.Email);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    _logger.LogWarning("Login attempt with non-existent email: {Email}", loginDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse("Không tìm thấy tài khoản với email này"));
                }

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, client.PassWord))
                {
                    _logger.LogWarning("Invalid password attempt for email: {Email}", loginDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_CREDENTIALS));
                }

                var token = GenerateJwtToken(client);
                _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token,
                    user = new
                    {
                        id = client.Id,
                        email = client.Email,
                        name = client.Name,
                        point = client.Point,
                        tier = client.Tier,
                        avatar = client.Avatar,
                        NgayTaoTaiKhoan = client.NgayTaoTaiKhoan,
                        SanPhamYeuThich = client.SanPhamYeuThich,
                        GioHangCuaBan = client.GioHangCuaBan,
                        SoDoNguoiDung = client.SoDoNgDUng
                    }
                }, Constants.SuccessMessages.LOGIN_SUCCESS));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                throw;
            }
        }

        [HttpPost("Register")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] SignUpDto signUpDto)
        {
            try
            {
                if (signUpDto == null || 
                    string.IsNullOrWhiteSpace(signUpDto.UserName) || 
                    string.IsNullOrWhiteSpace(signUpDto.Email) || 
                    string.IsNullOrWhiteSpace(signUpDto.Password))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT,
                        new List<string> { "Tên, Email và Mật khẩu không được để trống" }));
                }

                var existingUser = await _clientCollection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration attempt with existing email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password, workFactor: Constants.BCRYPT_WORK_FACTOR);
                var client = new Client
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = signUpDto.Email,
                    PassWord = passwordHash,
                    Name = signUpDto.UserName,
                    Point = 0,
                    Tier = Constants.UserTiers.BRONZE,
                    NgayTaoTaiKhoan = DateTime.UtcNow
                };

                await _clientCollection.InsertOneAsync(client);
                var token = GenerateJwtToken(client);
                _logger.LogInformation("New user registered: {Email}", signUpDto.Email);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token,
                    user = new
                    {
                        id = client.Id,
                        email = client.Email,
                        name = client.Name,
                        point = client.Point,
                        tier = client.Tier,
                        avatar = client.Avatar,
                        NgayTaoTaiKhoan = client.NgayTaoTaiKhoan,
                        SanPhamYeuThich = client.SanPhamYeuThich,
                        GioHangCuaBan = client.GioHangCuaBan,
                        SoDoNguoiDung = client.SoDoNgDUng
                    }
                }, Constants.SuccessMessages.REGISTER_SUCCESS));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                throw;
            }
        }

        #endregion

        #region Shop Authentication

        [HttpPost("ShopRegister")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ShopRegister([FromBody] ShopSignUpDTo signUpDto)
        {
            try
            {
                if (signUpDto == null || 
                    string.IsNullOrWhiteSpace(signUpDto.Email) || 
                    string.IsNullOrWhiteSpace(signUpDto.Password) ||
                    string.IsNullOrWhiteSpace(signUpDto.shopId))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT,
                        new List<string> { "Email, Mật khẩu và Shop ID không được để trống" }));
                }

                // Check if email exists in Client collection
                var existingClient = await _clientCollection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingClient != null)
                {
                    _logger.LogWarning("Shop registration attempt with existing client email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                // Check if email exists in Admin collection
                var existingAdmin = await _adminAccountCollection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingAdmin != null)
                {
                    _logger.LogWarning("Shop registration attempt with existing admin email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                // Check if email exists in ShopAccount collection
                var existingShopAccount = await _shopAccountCollection.Find(u => u.email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingShopAccount != null)
                {
                    _logger.LogWarning("Shop registration attempt with existing shop account email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password, workFactor: Constants.BCRYPT_WORK_FACTOR);
                var shopAccount = new ShopAccount
                {
                    id = Guid.NewGuid().ToString(),
                    email = signUpDto.Email,
                    password = passwordHash,
                    shopId = signUpDto.shopId,
                    NgayTaoTaiKhoan = DateTime.UtcNow
                };

                await _shopAccountCollection.InsertOneAsync(shopAccount);
                _logger.LogInformation("New shop account registered: {Email}, ShopId: {ShopId}", signUpDto.Email, signUpDto.shopId);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    userId = shopAccount.id,
                    user = new
                    {
                        id = shopAccount.id,
                        email = shopAccount.email,
                        shopId = shopAccount.shopId,
                        NgayTaoTaiKhoan = shopAccount.NgayTaoTaiKhoan
                    }
                }, "Đăng ký tài khoản shop thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during shop registration");
                throw;
            }
        }

        [HttpPost("LogInShop")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogInShop([FromBody] LoginDto login)
        {
            try
            {
                if (login == null || string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Password))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT,
                        new List<string> { "Email và mật khẩu không được để trống" }));
                }

                var shopAccount = await _shopAccountCollection.Find(a => a.email == login.Email).FirstOrDefaultAsync();
                if (shopAccount == null)
                {
                    _logger.LogWarning("Shop login attempt with non-existent email: {Email}", login.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse("Email không tồn tại trong hệ thống"));
                }

                if (!BCrypt.Net.BCrypt.Verify(login.Password, shopAccount.password))
                {
                    _logger.LogWarning("Invalid password attempt for shop email: {Email}", login.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_CREDENTIALS));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopAccount.shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();
                var token = GenerateJwtToken(shopAccount);
                
                _logger.LogInformation("Shop logged in successfully: {Email}, ShopId: {ShopId}", login.Email, shopAccount.shopId);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token,
                    dataStore = shop
                }, Constants.SuccessMessages.LOGIN_SUCCESS));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during shop login");
                throw;
            }
        }

        #endregion

        #region Admin Authentication

        [HttpPost("CreateAdminAccount")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAdmin([FromBody] SignUpDto signUpDto)
        {
            try
            {
                if (signUpDto == null || 
                    string.IsNullOrWhiteSpace(signUpDto.UserName) || 
                    string.IsNullOrWhiteSpace(signUpDto.Email) || 
                    string.IsNullOrWhiteSpace(signUpDto.Password))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT,
                        new List<string> { "Tên, Email và Mật khẩu không được để trống" }));
                }

                var existingUser = await _clientCollection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    _logger.LogWarning("Admin creation attempt with existing client email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                var existingAdmin = await _adminAccountCollection.Find(u => u.Email == signUpDto.Email).FirstOrDefaultAsync();
                if (existingAdmin != null)
                {
                    _logger.LogWarning("Admin creation attempt with existing admin email: {Email}", signUpDto.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.EMAIL_EXISTS));
                }

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password, workFactor: Constants.BCRYPT_WORK_FACTOR);
                var admin = new AdminAccount
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = signUpDto.Email,
                    Password = passwordHash,
                };

                await _adminAccountCollection.InsertOneAsync(admin);
                var token = GenerateJwtToken(admin);
                _logger.LogInformation("New admin account created: {Email}", signUpDto.Email);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token
                }, Constants.SuccessMessages.REGISTER_SUCCESS));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during admin account creation");
                throw;
            }
        }

        [HttpPost("LogInAdminSite")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogInAdminSite([FromBody] LoginDto login)
        {
            try
            {
                if (login == null || string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Password))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_INPUT,
                        new List<string> { "Email và mật khẩu không được để trống" }));
                }

                var filter = Builders<AdminAccount>.Filter.Eq(A => A.Email, login.Email);
                var adminAccount = await _adminAccountCollection.Find(filter).FirstOrDefaultAsync();
                
                if (adminAccount == null)
                {
                    _logger.LogWarning("Admin login attempt with non-existent email: {Email}", login.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse("Email không tồn tại trong hệ thống"));
                }

                if (!BCrypt.Net.BCrypt.Verify(login.Password, adminAccount.Password))
                {
                    _logger.LogWarning("Invalid password attempt for admin email: {Email}", login.Email);
                    return BadRequest(ApiResponse<object>.ErrorResponse(Constants.ErrorMessages.INVALID_CREDENTIALS));
                }

                var token = GenerateJwtToken(adminAccount);
                _logger.LogInformation("Admin logged in successfully: {Email}", login.Email);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token
                }, Constants.SuccessMessages.LOGIN_SUCCESS));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during admin login");
                throw;
            }
        }

        #endregion
    }
}
