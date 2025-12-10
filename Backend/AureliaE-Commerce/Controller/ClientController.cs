using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ClientController : ControllerBase
    {
        private readonly IMongoCollection<Client> _clientCollection;
        private readonly IMongoCollection<Shop> _shopCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly IHubContext<NotifyHub> _hubContext;
        private readonly IMongoCollection<MaGiamGia> _voucherCollection;
        private readonly ILogger<ClientController> _logger;

        public ClientController(
            MongoDbContext dbContext,
            IHubContext<NotifyHub> hubContext,
            ILogger<ClientController> logger)
        {
            _clientCollection = dbContext.Client;
            _hubContext = hubContext;
            _shopCollection = dbContext.Shop;
            _productCollection = dbContext.SanPham;
            _voucherCollection = dbContext.MaGiamGiaVoucher;
            _logger = logger;
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
                var handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(token))
                    return null;

                var jwtToken = handler.ReadJwtToken(token);
                return jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            }
            catch
            {
                return null;
            }
        }

        [HttpGet("LayThongTinNguoiDung")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserData([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { user = client }, "Lấy thông tin người dùng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user data");
                throw;
            }
        }

        [HttpPost("AddItems")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddFavoriteItem(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] Product product)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (product == null)
                {
                    return BadRequest(ApiResponse.Error("Sản phẩm không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var update = Builders<Client>.Update.Push(c => c.SanPhamYeuThich, product);
                var result = await _clientCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                _logger.LogInformation("Favorite item added for user {UserId}: {ProductId}", userId, product.id);
                return Ok(ApiResponse.Success("Thêm sản phẩm yêu thích thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding favorite item");
                throw;
            }
        }

        [HttpPost("AutoAddGioHangKhiLog")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AutoAddToCart(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] List<ItemOrder> products)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (products == null || !products.Any())
                {
                    return BadRequest(ApiResponse.Error("Danh sách sản phẩm không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var update = Builders<Client>.Update.PushEach(a => a.GioHangCuaBan, products);
                await _clientCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Auto added {Count} items to cart for user {UserId}", products.Count, userId);
                return Ok(ApiResponse<object>.SuccessResponse(new { products }, "Thêm vào giỏ hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error auto adding to cart");
                throw;
            }
        }

        [HttpDelete("XoaGioHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ClearCart([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var update = Builders<Client>.Update.Set(c => c.GioHangCuaBan, new List<ItemOrder>());
                await _clientCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Cart cleared for user {UserId}", userId);
                return Ok(ApiResponse.Success("Đã xóa toàn bộ giỏ hàng"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                throw;
            }
        }

        [HttpGet("GetItemFavourite")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<Product>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetFavoriteItems([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var favorites = client.SanPhamYeuThich ?? new List<Product>();
                return Ok(ApiResponse<List<Product>>.SuccessResponse(favorites, "Lấy danh sách sản phẩm yêu thích thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving favorite items");
                throw;
            }
        }

        [HttpPost("AddDonHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddOrder(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] OrderModel order,
            [FromQuery] string shopId)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (order == null || order.product == null || !order.product.Any())
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu đơn hàng không hợp lệ"));
                }

                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var update = Builders<Client>.Update.Push("DonHangCuaBan", order);
                var result = await _clientCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                string shopGroup = $"Shop_{shopId}";
                string message = $"Đơn hàng mới #{order.orderId} từ {order.name}";
                var totalValue = order.product.Sum(a => a.price * a.quantity);

                var points = totalValue switch
                {
                    <= 100_000_000 => 100,
                    <= 500_000_000 => 500,
                    <= 1_000_000_000 => 1000,
                    _ => 2000
                };

                var pointUpdate = Builders<Client>.Update.Set(a => a.Point, points);
                await _clientCollection.UpdateOneAsync(filter, pointUpdate);

                var firstProductId = order.product.Select(a => a.Itemid).FirstOrDefault();
                var quantity = order.product.Where(a => a.Itemid == firstProductId).Sum(a => a.quantity);

                var shopFilter = Builders<Shop>.Filter.And(
                    Builders<Shop>.Filter.Eq(a => a.shopId, shopId),
                    Builders<Shop>.Filter.ElemMatch(a => a.products, s => s.productId == firstProductId)
                );

                if (order.voucherUsed != null && order.voucherUsed.Any())
                {
                    var voucherCode = order.voucherUsed[0].code;
                    var voucherFilter = Builders<MaGiamGia>.Filter.Eq(a => a.code, voucherCode);
                    var voucherUpdate = Builders<MaGiamGia>.Update.Inc(a => a.soLuong, -1);
                    await _voucherCollection.UpdateOneAsync(voucherFilter, voucherUpdate);
                }

                var shopUpdate = Builders<Shop>.Update.Inc("products.$.sold", quantity);
                await _shopCollection.UpdateOneAsync(shopFilter, shopUpdate);

                await _hubContext.Clients.Group(shopGroup).SendAsync("NotificationOrder", new { message });

                _logger.LogInformation("Order added for user {UserId}, OrderId: {OrderId}", userId, order.orderId);
                return Ok(ApiResponse.Success("Thêm đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding order");
                throw;
            }
        }

        [HttpGet("LayDonHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<OrderModel>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrders([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var orders = client.DonHangCuaBan ?? new List<OrderModel>();
                return Ok(ApiResponse<List<OrderModel>>.SuccessResponse(orders, "Lấy danh sách đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders");
                throw;
            }
        }

        [HttpGet("LayDonHangGanDay")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetRecentOrder([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null || client.DonHangCuaBan == null || !client.DonHangCuaBan.Any())
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy đơn hàng nào"));
                }

                var recentOrder = client.DonHangCuaBan
                    .SelectMany(a => a.product ?? new List<ItemOrder>())
                    .OrderByDescending(o => o.dateBuy)
                    .FirstOrDefault();

                if (recentOrder == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy đơn hàng gần đây"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { ngayMoiNhat = recentOrder.dateBuy }, "Lấy đơn hàng gần đây thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent order");
                throw;
            }
        }

        [HttpGet("GetSoLuongDonHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderStatistics([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var activeOrders = client.DonHangCuaBan?.Where(a => a.status != "Đã Hủy").ToList() ?? new List<OrderModel>();
                var soLuongDon = activeOrders.Count;
                var tongTien = activeOrders
                    .SelectMany(dh => dh.product ?? new List<ItemOrder>())
                    .Sum(p => p.quantity * p.price);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    SoLuongDon = soLuongDon,
                    TongTien = tongTien
                }, "Lấy thống kê đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order statistics");
                throw;
            }
        }

        [HttpPost("UpMeasure")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<Measure>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> SaveMeasurements(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] Measure measure)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (measure == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu số đo không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var update = Builders<Client>.Update.Set("SoDoNgDUng", measure);
                await _clientCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Measurements saved for user {UserId}", userId);
                return Ok(ApiResponse<Measure>.SuccessResponse(measure, "Lưu số đo thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving measurements");
                throw;
            }
        }

        [HttpGet("GetSoDo")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<Measure>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMeasurements([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                if (client.SoDoNgDUng == null)
                {
                    return NotFound(ApiResponse.Error("Người dùng chưa có số đo"));
                }

                var measure = new Measure
                {
                    vai = client.SoDoNgDUng.vai ?? "",
                    eo = client.SoDoNgDUng.eo ?? "",
                    chieuCao = client.SoDoNgDUng.chieuCao ?? "",
                    nguc = client.SoDoNgDUng.nguc ?? "",
                    hong = client.SoDoNgDUng.hong ?? ""
                };

                return Ok(ApiResponse<Measure>.SuccessResponse(measure, "Lấy số đo thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving measurements");
                throw;
            }
        }

        [HttpPost("AddCuocHenUser")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddAppointment(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] ClientAppointment clientAppointment)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (clientAppointment == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu lịch hẹn không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var update = Builders<Client>.Update.Push("LichSuCuocHen", clientAppointment);
                await _clientCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Appointment added for user {UserId}", userId);
                return Ok(ApiResponse.Success("Thêm lịch hẹn thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding appointment");
                throw;
            }
        }

        [HttpGet("LayCuocHenUser")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<ClientAppointment>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAppointments([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var client = await _clientCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var appointments = client.LichSuCuocHen?.ToList() ?? new List<ClientAppointment>();

                if (!appointments.Any())
                {
                    return Ok(ApiResponse<List<ClientAppointment>>.SuccessResponse(appointments, "Chưa có cuộc hẹn nào"));
                }

                return Ok(ApiResponse<List<ClientAppointment>>.SuccessResponse(appointments, "Lấy danh sách lịch hẹn thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments");
                throw;
            }
        }

        [HttpPost("LuuDiaChi")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> SaveAddress(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] ThongTinCaNhan addressInfo)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (addressInfo == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu địa chỉ không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var update = Builders<Client>.Update.Push(a => a.ThongTinDatHang, addressInfo);
                await _clientCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Address saved for user {UserId}", userId);
                return Ok(ApiResponse.Success("Lưu địa chỉ thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving address");
                throw;
            }
        }

        [HttpGet("LayDiaChi")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<ThongTinCaNhan>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAddresses([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var addresses = client.ThongTinDatHang ?? new List<ThongTinCaNhan>();
                return Ok(ApiResponse<List<ThongTinCaNhan>>.SuccessResponse(addresses, "Lấy danh sách địa chỉ thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving addresses");
                throw;
            }
        }

        [HttpDelete("XoaDiaChi")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAddress(
            [FromHeader(Name = "Authorization")] string? token,
            [FromBody] ThongTinCaNhan addressInfo)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (addressInfo == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu địa chỉ không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var update = Builders<Client>.Update.PullFilter(
                    c => c.ThongTinDatHang,
                    td => td.HoVaTen == addressInfo.HoVaTen &&
                          td.DiaChi == addressInfo.DiaChi &&
                          td.Email == addressInfo.Email &&
                          td.SoDT == addressInfo.SoDT
                );

                var result = await _clientCollection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy địa chỉ để xóa"));
                }

                _logger.LogInformation("Address deleted for user {UserId}", userId);
                return Ok(ApiResponse.Success("Xóa địa chỉ thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting address");
                throw;
            }
        }

        [HttpPut("UpdateProfile")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfile(
            [FromBody] UpdateProfileCustomer updateProfileCustomer,
            [FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (updateProfileCustomer == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu cập nhật không được để trống"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var update = Builders<Client>.Update
                    .Set(s => s.Name, updateProfileCustomer.hovaten)
                    .Set(s => s.Email, updateProfileCustomer.email)
                    .Set(s => s.SoDt, updateProfileCustomer.soDt)
                    .Set(s => s.DiaChi, updateProfileCustomer.address)
                    .Set(s => s.Avatar, updateProfileCustomer.avatarUrl);

                await _clientCollection.UpdateOneAsync(filter, update);

                var updatedClient = new
                {
                    id = client.Id,
                    name = updateProfileCustomer.hovaten,
                    email = updateProfileCustomer.email,
                    soDt = updateProfileCustomer.soDt,
                    address = updateProfileCustomer.address,
                    avatar = updateProfileCustomer.avatarUrl,
                    point = client.Point,
                    tier = client.Tier,
                    thongTinDatHang = client.ThongTinDatHang,
                    ngayTaoTaiKhoan = client.NgayTaoTaiKhoan,
                    sanPhamYeuThich = client.SanPhamYeuThich,
                    lichSuCuocHen = client.LichSuCuocHen,
                    donHangCuaBan = client.DonHangCuaBan,
                    soDoNguoiDung = client.SoDoNgDUng
                };

                _logger.LogInformation("Profile updated for user {UserId}", userId);
                return Ok(ApiResponse<object>.SuccessResponse(new { user = updatedClient }, Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                throw;
            }
        }

        [HttpPost("UpdateTier")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTier([FromHeader(Name = "Authorization")] string? token)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
                var client = await _clientCollection.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy người dùng"));
                }

                var points = client.Point;
                var tier = points switch
                {
                    <= 1000 => Constants.UserTiers.BRONZE,
                    <= 5000 => "Silver",
                    <= 10000 => "Gold",
                    <= 20000 => "Diamond",
                    _ => "Royal"
                };

                var update = Builders<Client>.Update.Set(s => s.Tier, tier);
                await _clientCollection.UpdateOneAsync(filter, update);

                var benefit = tier switch
                {
                    "Bronze" => new benefit { name = "Ưu đãi sinh nhật 3%", freeShipping = false, value = 3 },
                    "Silver" => new benefit { name = "Miễn phí vận chuyển đơn đầu tiên + Ưu đãi sinh nhật 5%", freeShipping = true, value = 5 },
                    "Gold" => new benefit { name = "Giảm 10% cho tất cả sản phẩm + Ưu tiên hỗ trợ khách hàng", freeShipping = true, value = 10 },
                    "Diamond" => new benefit { name = "Giảm 15% + Quà tri ân mỗi quý", freeShipping = true, value = 15 },
                    "Royal" => new benefit { name = "Giảm 20% + Ưu đãi sự kiện VIP + Hỗ trợ riêng 24/7", freeShipping = true, value = 20 },
                    "Royal Plus" => new benefit { name = "Giảm 30% + Quà tặng độc quyền + Trải nghiệm cao cấp", freeShipping = true, value = 30 },
                    _ => null
                };

                if (benefit != null)
                {
                    var benefitUpdate = Builders<Client>.Update.Set(a => a.Benefits, benefit);
                    await _clientCollection.UpdateOneAsync(filter, benefitUpdate);
                }

                _logger.LogInformation("Tier updated for user {UserId}: {Tier}", userId, tier);
                return Ok(ApiResponse.Success($"Cập nhật tier thành công: {tier}"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tier");
                throw;
            }
        }

        [HttpPost("HuyDonHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CancelOrder(
            [FromHeader(Name = "Authorization")] string? token,
            [FromQuery] string orderId)
        {
            try
            {
                var userId = GetUserIdFromToken(token);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(ApiResponse.Error("Token không hợp lệ"));
                }

                if (string.IsNullOrWhiteSpace(orderId))
                {
                    return BadRequest(ApiResponse.Error("Order ID không được để trống"));
                }

                var clientFilter = Builders<Client>.Filter.And(
                    Builders<Client>.Filter.Eq(c => c.Id, userId),
                    Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, d => d.orderId == orderId)
                );

                var clientUpdate = Builders<Client>.Update.Set("DonHangCuaBan.$.status", "Đã Hủy");
                var clientResult = await _clientCollection.UpdateOneAsync(clientFilter, clientUpdate);

                if (clientResult.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy đơn hàng"));
                }

                var shopFilter = Builders<Shop>.Filter.ElemMatch(a => a.Orders, s => s.orderId == orderId);
                var shopUpdate = Builders<Shop>.Update.Set("Orders.$.status", "Đã Hủy");
                await _shopCollection.UpdateOneAsync(shopFilter, shopUpdate);

                var client = await _clientCollection.Find(clientFilter).FirstOrDefaultAsync();
                if (client?.DonHangCuaBan != null)
                {
                    var order = client.DonHangCuaBan.FirstOrDefault(o => o.orderId == orderId);
                    if (order?.product != null && order.product.Any())
                    {
                        var firstProduct = order.product.First();
                        var quantity = firstProduct.quantity;
                        var size = firstProduct.size;
                        var productId = firstProduct.Itemid;
                        var color = firstProduct.color;

                        var productFilter = Builders<Product>.Filter.And(
                            Builders<Product>.Filter.Eq(a => a.id, productId),
                            Builders<Product>.Filter.Eq("variants.color", color),
                            Builders<Product>.Filter.Eq("variants.sizes.size", size)
                        );

                        var productUpdate = Builders<Product>.Update.Inc("variants.$[v].sizes.$[s].quantity", quantity);
                        var arrayFilters = new List<ArrayFilterDefinition>
                        {
                            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("v.color", color)),
                            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("s.size", size))
                        };
                        var updateOptions = new UpdateOptions { ArrayFilters = arrayFilters };
                        await _productCollection.UpdateOneAsync(productFilter, productUpdate, updateOptions);
                    }
                }

                _logger.LogInformation("Order cancelled: {OrderId} by user {UserId}", orderId, userId);
                return Ok(ApiResponse.Success("Hủy đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order");
                throw;
            }
        }
    }
}
