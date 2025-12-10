using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System.Text.Json;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ShopController : ControllerBase
    {
        private readonly ShopService _shopService;
        private readonly IMongoCollection<Shop> _shopCollection;
        private readonly IMongoCollection<Client> _clientCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly IHubContext<NotifyHub> _hubContext;
        private readonly ILogger<ShopController> _logger;

        public ShopController(
            ShopService service,
            MongoDbContext dbContext,
            IHubContext<NotifyHub> hubContext,
            ILogger<ShopController> logger)
        {
            _shopService = service;
            _shopCollection = dbContext.Shop;
            _clientCollection = dbContext.Client;
            _productCollection = dbContext.SanPham;
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpPost("AddShop")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddShop(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(ApiResponse.Error("File không được để trống"));
                }

                if (!file.ContentType.Contains("json"))
                {
                    return BadRequest(ApiResponse.Error("File phải là định dạng JSON"));
                }

                using var reader = new StreamReader(file.OpenReadStream());
                var json = await reader.ReadToEndAsync();
                var shops = JsonSerializer.Deserialize<List<Shop>>(json);

                if (shops == null || !shops.Any())
                {
                    return BadRequest(ApiResponse.Error("File JSON không hợp lệ hoặc rỗng"));
                }

                await _shopService.AddShop(shops);
                _logger.LogInformation("Imported {Count} shops from file", shops.Count);
                return Ok(ApiResponse.Success($"Thêm {shops.Count} cửa hàng thành công"));
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error parsing JSON file");
                return BadRequest(ApiResponse.Error("File JSON không đúng định dạng"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing shops from file");
                throw;
            }
        }

        [HttpPost("GetShop")]
        [ProducesResponseType(typeof(ApiResponse<List<Shop>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetShop([FromBody] ShopFindDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu tìm kiếm không được để trống"));
                }

                var shops = await _shopService.Shops(dto);
                _logger.LogDebug("Retrieved {Count} shops", shops.Count);
                return Ok(ApiResponse<List<Shop>>.SuccessResponse(shops, "Lấy danh sách shop thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shops");
                throw;
            }
        }

        [HttpGet("GetSHopById")]
        [ProducesResponseType(typeof(ApiResponse<Shop>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetShopById([FromQuery] string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var shops = await _shopService.Shop(id);
                var shop = shops.FirstOrDefault();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogDebug("Retrieved shop: {ShopId}", id);
                return Ok(ApiResponse<Shop>.SuccessResponse(shop, "Lấy thông tin shop thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop by ID");
                throw;
            }
        }

        [HttpPost("AddAppointment")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddAppointment([FromBody] Appointment appointment, [FromQuery] string shopId)
        {
            try
            {
                if (appointment == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu lịch hẹn không được để trống"));
                }

                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var update = Builders<Shop>.Update.Push(a => a.appoiments, appointment);
                var result = await _shopCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                string shopAppointment = $"Shop_Appointment{appointment.ShopId}";
                string message = $"Có Lịch Hẹn Của Khách {appointment.CustomerName} - Dịch Vụ: {appointment.Service}";
                
                await _hubContext.Clients.Group(shopAppointment).SendAsync("AppointmentBooking", new { message });
                _logger.LogInformation("Appointment added for shop {ShopId}", shopId);

                return Ok(ApiResponse.Success("Thêm lịch hẹn thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding appointment");
                throw;
            }
        }

        [HttpPost("LayNgayHen")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAppointmentDates([FromBody] UploadGetAppointment getAppointment)
        {
            try
            {
                if (getAppointment == null || string.IsNullOrWhiteSpace(getAppointment.ShopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, getAppointment.ShopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null || shop.appoiments == null || !shop.appoiments.Any())
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new List<DateTime>(), "Không có lịch hẹn"));
                }

                var slots = shop.appoiments.Select(a => a.CreatedAt).ToList();
                return Ok(ApiResponse<object>.SuccessResponse(slots, "Lấy danh sách ngày hẹn thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment dates");
                throw;
            }
        }

        [HttpPost("LayTatCaSlotTheoNgay")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<object>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSlotsByDate([FromBody] GetSlotDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.And(
                    Builders<Shop>.Filter.Eq(a => a.shopId, dto.shopId),
                    Builders<Shop>.Filter.ElemMatch(s => s.appoiments, ap => ap.Date == dto.Date)
                );

                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop hoặc không có appointment trong ngày này"));
                }

                var appointmentsInDate = shop.appoiments
                    .Where(a => a.Date == dto.Date)
                    .Select(a => new
                    {
                        slot = a.Slot,
                        duration = a.Duration
                    })
                    .ToList();

                return Ok(ApiResponse<List<object>>.SuccessResponse(
                    appointmentsInDate.Cast<object>().ToList(),
                    "Lấy danh sách slot thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving slots by date");
                throw;
            }
        }

        [NonAction]
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            double dLat = (lat2 - lat1) * Math.PI / 180;
            double dLon = (lon2 - lon1) * Math.PI / 180;
            var lat1Rad = lat1 * Math.PI / 180;
            var lat2Rad = lat2 * Math.PI / 180;
            var a = Math.Pow(Math.Sin(dLat / 2), 2) + Math.Cos(lat1Rad) * Math.Cos(lat2Rad) * Math.Pow(Math.Sin(dLon / 2), 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        [HttpPost("SapXepDonChoCuaHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignOrderToShop([FromBody] OrderModel orderModel, [FromQuery] bool estimateOnly = false)
        {
            try
            {
                if (orderModel == null || orderModel.product == null || !orderModel.product.Any())
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu đơn hàng không hợp lệ"));
                }

                var stores = await _shopCollection.Find(_ => true).ToListAsync();
                Shop? nearestStore = null;
                double nearestDistance = double.MaxValue;

                foreach (var store in stores)
                {
                    bool hasStock = orderModel.product.All(orderProduct =>
                        store.products?.Any(p =>
                            p.productId == orderProduct.Itemid &&
                            p.variants?.Any(v =>
                                v.sizes?.Any(s =>
                                    s.size == orderProduct.size && s.quantity >= orderProduct.quantity
                                ) ?? false
                            ) ?? false
                        ) ?? false
                    );

                    if (!hasStock) continue;

                    double distance = CalculateDistance(orderModel.lat, orderModel.ion, store.lat, store.lng);

                    if (distance < nearestDistance)
                    {
                        nearestDistance = distance;
                        nearestStore = store;
                    }
                }

                if (nearestStore == null)
                {
                    return NotFound(ApiResponse.Error("Không có cửa hàng nào còn đủ hàng để xử lý đơn"));
                }

                float totalAmount = orderModel.product.Sum(a => a.quantity * a.price);
                decimal shippingFee = CalculateShippingFee(totalAmount, nearestDistance);

                if (estimateOnly)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new
                    {
                        Message = "Ước lượng chi phí vận chuyển",
                        StoreId = nearestStore.shopId,
                        Distance = Math.Round(nearestDistance, 2),
                        ShippingFee = shippingFee
                    }, "Ước lượng phí vận chuyển thành công"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, nearestStore.shopId);
                var update = Builders<Shop>.Update.Push("Orders", orderModel);
                await _shopCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Order assigned to shop {ShopId}, Distance: {Distance}km", nearestStore.shopId, nearestDistance);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    Message = "Đã gán đơn cho cửa hàng",
                    StoreId = nearestStore.shopId,
                    Distance = Math.Round(nearestDistance, 2),
                    ShippingFee = shippingFee
                }, "Gán đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning order to shop");
                throw;
            }
        }

        [NonAction]
        private decimal CalculateShippingFee(float totalAmount, double distance)
        {
            if (totalAmount > 1000000000)
            {
                return 0;
            }
            else if (distance <= 5)
            {
                return 0;
            }
            else if (distance <= 100)
            {
                return 25000;
            }
            else if (distance <= 200)
            {
                return 35000;
            }
            else if (distance <= 1000)
            {
                return 45000;
            }
            else
            {
                return 55000;
            }
        }

        [HttpGet("LayDonHangTheoId")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrderById([FromQuery] string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(ApiResponse.Error("Order ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.ElemMatch(o => o.Orders, order => order.orderId == id);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy đơn hàng"));
                }

                var order = shop.Orders?.FirstOrDefault(o => o.orderId == id);
                if (order == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy đơn hàng"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    shopName = shop.shopName,
                    address = shop.address,
                    lat = shop.lat,
                    lng = shop.lng,
                    data = order
                }, "Lấy thông tin đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order by ID");
                throw;
            }
        }

        [HttpGet("DataForDashBoard")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDashboardData([FromQuery] string shopId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                var customers = await _clientCollection.Find(_ => true).ToListAsync();
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);
                var yesterday = today.AddDays(-1);

                var fetchAppointment = shop.appoiments?.Count(a => a.CreatedAt >= today && a.CreatedAt < tomorrow) ?? 0;
                var fetchOrder = shop.Orders?.Count(a => a.NgayTaoDon >= today && a.NgayTaoDon < tomorrow) ?? 0;
                var fetchOrderYesterday = shop.Orders?.Count(a => a.NgayTaoDon >= yesterday && a.NgayTaoDon < today) ?? 0;

                var doanhSoHomNay = shop.Orders?
                    .Where(a => a.NgayTaoDon >= today && a.NgayTaoDon < tomorrow)
                    .Sum(a => a.product?.Sum(p => p.price * p.quantity) ?? 0) ?? 0;

                var doanhSoHomQua = shop.Orders?
                    .Where(a => a.NgayTaoDon >= yesterday && a.NgayTaoDon < today)
                    .Sum(a => a.product?.Sum(p => p.price * p.quantity) ?? 0) ?? 0;

                var fetchCustomer = customers.Count(a => a.NgayTaoTaiKhoan >= today && a.NgayTaoTaiKhoan < tomorrow);
                var lichCho = shop.appoiments?.Count(a => a.CreatedAt >= today && a.CreatedAt < tomorrow && a.Status == "Pending") ?? 0;

                double phanTramTang = doanhSoHomQua == 0 ? 100 : ((double)(doanhSoHomNay - doanhSoHomQua) / doanhSoHomQua) * 100;
                double donHomNay = fetchOrderYesterday == 0 ? 0 : (fetchOrder - fetchOrderYesterday);
                double userCreateToday = fetchCustomer == 0 ? 0 : fetchCustomer;

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    doanhThu = doanhSoHomNay,
                    doanhSoPhanTram = $"{Math.Round(phanTramTang, 2)}%",
                    orderHomNay = fetchOrder,
                    soDon = donHomNay,
                    SoLichHen = fetchAppointment,
                    SoLichCho = lichCho,
                    SoUser = fetchCustomer,
                    SoLuongTang = userCreateToday
                }, "Lấy dữ liệu dashboard thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard data");
                throw;
            }
        }

        [HttpGet("LayDanhSachLichHenVaDonHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAppointmentsAndOrders([FromQuery] string shopId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                var listAppointment = shop.appoiments?.OrderByDescending(a => a.CreatedAt).ToList() ?? new List<Appointment>();
                var listOrder = shop.Orders?.OrderByDescending(a => a.NgayTaoDon).ToList() ?? new List<OrderModel>();

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    listOrder,
                    ListAppoinment = listAppointment
                }, "Lấy danh sách lịch hẹn và đơn hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments and orders");
                throw;
            }
        }

        [HttpPost("UpdateTrangThai")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateStatusDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.OrderId) || string.IsNullOrWhiteSpace(dto.ShopId))
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu không hợp lệ"));
                }

                var shopFilter = Builders<Shop>.Filter.And(
                    Builders<Shop>.Filter.Eq(s => s.shopId, dto.ShopId),
                    Builders<Shop>.Filter.ElemMatch(s => s.Orders, o => o.orderId == dto.OrderId)
                );

                var clientFilter = Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, o => o.orderId == dto.OrderId);

                var shopUpdate = Builders<Shop>.Update
                    .Set("Orders.$.status", dto.status)
                    .Set("Orders.$.tracking.UpdateTime", DateTime.UtcNow);

                var clientUpdate = Builders<Client>.Update
                    .Set("DonHangCuaBan.$.status", dto.status)
                    .Set("DonHangCuaBan.$.tracking.UpdateTime", DateTime.UtcNow);

                await _shopCollection.UpdateOneAsync(shopFilter, shopUpdate);
                await _clientCollection.UpdateOneAsync(clientFilter, clientUpdate);

                string message = dto.status switch
                {
                    "Xác Nhận" => "Xác Nhận Thành Công!",
                    "Đóng gói" => "Đóng Gói Thành Công",
                    _ => "Bàn Giao Cho Đơn Vị Vận Chuyển Thành Công"
                };

                _logger.LogInformation("Order status updated: {OrderId}, Status: {Status}", dto.OrderId, dto.status);
                return Ok(ApiResponse.Success(message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status");
                throw;
            }
        }

        [HttpGet("LaySanPham")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProducts([FromQuery] string shopId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filterShop = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filterShop).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                var productIds = shop.products?.Select(p => p.productId).ToList() ?? new List<string>();
                if (!productIds.Any())
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new
                    {
                        tongSanPham = 0,
                        tongSoLuongKho = 0,
                        tongGiaTriKho = 0,
                        danhSachSanPham = new List<Product>(),
                        shopData = shop
                    }, "Shop chưa có sản phẩm"));
                }

                var filterProducts = Builders<Product>.Filter.In(a => a.id, productIds);
                var products = await _productCollection.Find(filterProducts).ToListAsync();

                int tongSanPham = products.Count;
                int tongSoLuongKho = shop.products?
                    .Where(p => p.variants != null)
                    .SelectMany(p => p.variants)
                    .Where(v => v.sizes != null)
                    .SelectMany(v => v.sizes)
                    .Sum(s => s.quantity) ?? 0;

                double tongGiaTriKho = 0;
                foreach (var prod in products)
                {
                    var shopProduct = shop.products?.FirstOrDefault(p => p.productId == prod.id);
                    if (shopProduct != null)
                    {
                        int soLuong = shopProduct.variants?
                            .SelectMany(v => v.sizes ?? new List<dynamic>())
                            .Sum(s => (int)(s.quantity ?? 0)) ?? 0;
                        tongGiaTriKho += prod.price * soLuong;
                    }
                }

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    tongSanPham,
                    tongSoLuongKho,
                    tongGiaTriKho,
                    danhSachSanPham = products,
                    shopData = shop
                }, "Lấy danh sách sản phẩm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop products");
                throw;
            }
        }

        [HttpPost("UploadSanPham")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadProduct([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
                if (product == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu sản phẩm không được để trống"));
                }

                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                await _productCollection.InsertOneAsync(product);
                var productAtShop = new ProductAtShop
                {
                    productId = product.id,
                    brand = product.brand,
                    name = product.name,
                    sold = product.sold,
                    variants = product.variants
                };

                var updateShop = Builders<Shop>.Update.Push(a => a.products, productAtShop);
                await _shopCollection.UpdateOneAsync(filter, updateShop);

                _logger.LogInformation("Product uploaded to shop {ShopId}: {ProductId}", shopId, product.id);
                return Ok(ApiResponse.Success("Upload sản phẩm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading product to shop");
                throw;
            }
        }

        [HttpPut("SuaSanPham")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
                if (product == null || string.IsNullOrWhiteSpace(product.id))
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu sản phẩm không hợp lệ"));
                }

                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.And(
                    Builders<Shop>.Filter.Eq(a => a.shopId, shopId),
                    Builders<Shop>.Filter.ElemMatch(a => a.products, p => p.productId == product.id)
                );

                var filterProduct = Builders<Product>.Filter.Eq(a => a.id, product.id);
                var updateProduct = Builders<Product>.Update
                    .Set(p => p.name, product.name)
                    .Set(p => p.type, product.type)
                    .Set(p => p.subcategory, product.subcategory)
                    .Set(p => p.brand, product.brand)
                    .Set(p => p.origin, product.origin)
                    .Set(p => p.price, product.price)
                    .Set(p => p.description, product.description)
                    .Set(p => p.rating, product.rating)
                    .Set(p => p.stock, product.stock)
                    .Set(p => p.updatedAt, DateTime.UtcNow)
                    .Set(p => p.thumbnail, product.thumbnail)
                    .Set(p => p.images, product.images)
                    .Set(p => p.sold, product.sold)
                    .Set(p => p.variants, product.variants);

                await _productCollection.UpdateOneAsync(filterProduct, updateProduct);

                var updatedProduct = new ProductAtShop
                {
                    productId = product.id,
                    name = product.name,
                    brand = product.brand,
                    variants = product.variants,
                    sold = product.sold
                };

                var update = Builders<Shop>.Update.Set("products.$", updatedProduct);
                var result = await _shopCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy sản phẩm để cập nhật"));
                }

                _logger.LogInformation("Product updated in shop {ShopId}: {ProductId}", shopId, product.id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product in shop");
                throw;
            }
        }

        [HttpPost("PostMessage")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PostNotification([FromBody] Notifycation notification)
        {
            try
            {
                if (notification == null || string.IsNullOrWhiteSpace(notification.shopId))
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu thông báo không hợp lệ"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, notification.shopId);
                var update = Builders<Shop>.Update.Push(a => a.Notifycation, notification);
                var result = await _shopCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                await _hubContext.Clients.Group(notification.shopId)
                    .SendAsync("ReceiveNotification", notification);

                _logger.LogInformation("Notification sent to shop {ShopId}", notification.shopId);
                return Ok(ApiResponse.Success("Gửi thông báo thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting notification");
                throw;
            }
        }

        [HttpGet("GetNoti")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<Notifycation>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetNotifications([FromQuery] string shopId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                var notifications = shop.Notifycation?.ToList() ?? new List<Notifycation>();
                return Ok(ApiResponse<List<Notifycation>>.SuccessResponse(notifications, "Lấy danh sách thông báo thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications");
                throw;
            }
        }

        [HttpPost("CheckNotifycation")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckNotification([FromBody] AddCheckDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.shop_ID) || string.IsNullOrWhiteSpace(dto.idNotifycation))
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu không hợp lệ"));
                }

                var filter = Builders<Shop>.Filter.And(
                    Builders<Shop>.Filter.Eq(a => a.shopId, dto.shop_ID),
                    Builders<Shop>.Filter.ElemMatch(a => a.Notifycation, s => s.id == dto.idNotifycation)
                );

                var update = Builders<Shop>.Update.Set("Notifycation.$.isChecked", true);
                var result = await _shopCollection.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy thông báo"));
                }

                _logger.LogDebug("Notification checked: {NotificationId}", dto.idNotifycation);
                return Ok(ApiResponse.Success("Đánh dấu đã đọc thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking notification");
                throw;
            }
        }

        [HttpGet("GetAllCustomer")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _clientCollection.Find(_ => true).ToListAsync();
                var totalCustomer = customers.Count;

                var totalDoanhThu = customers
                    .SelectMany(a => a.DonHangCuaBan ?? new List<OrderModel>())
                    .SelectMany(a => a.product ?? new List<ItemOrder>())
                    .Sum(a => a.quantity * a.price);

                double averageChiTieuKhachHang = totalCustomer > 0 ? totalDoanhThu / (double)totalCustomer : 0;

                _logger.LogDebug("Retrieved {Count} customers", totalCustomer);
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    listCustomer = customers,
                    totalCustomer,
                    totalDoanhThu,
                    averageChiTieuKhachHang
                }, "Lấy danh sách khách hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all customers");
                throw;
            }
        }

        [HttpGet("GetShopDataAcoountByID")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<Shop>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetShopDataByAccountId([FromQuery] string shopId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(shopId))
                {
                    return BadRequest(ApiResponse.Error("Shop ID không được để trống"));
                }

                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shop = await _shopCollection.Find(filter).FirstOrDefaultAsync();

                if (shop == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy shop"));
                }

                return Ok(ApiResponse<Shop>.SuccessResponse(shop, "Lấy dữ liệu shop thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop data by account ID");
                throw;
            }
        }
    }
}
