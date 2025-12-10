using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AdminController : ControllerBase
    {
        private readonly IMongoCollection<Shop> _shopCollection;
        private readonly IMongoCollection<Client> _clientCollection;
        private readonly IMongoCollection<Coupon> _couponCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly ILogger<AdminController> _logger;

        public AdminController(MongoDbContext dbContext, ILogger<AdminController> logger)
        {
            _shopCollection = dbContext.Shop;
            _clientCollection = dbContext.Client;
            _couponCollection = dbContext.MaGiamGia;
            _productCollection = dbContext.SanPham;
            _logger = logger;
        }

        [HttpGet("Revenue")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRevenue()
        {
            try
            {
                var shops = await _shopCollection.Find(_ => true).ToListAsync();
                var now = DateTime.UtcNow;
                var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
                var startOfNextMonth = startOfThisMonth.AddMonths(1);
                var startOfLastMonth = startOfThisMonth.AddMonths(-1);

                float totalRevenueThisMonth = 0;
                float totalRevenueLastMonth = 0;
                int totalOrdersThisMonth = 0;
                int totalOrdersLastMonth = 0;

                foreach (var shop in shops)
                {
                    var orders = shop.Orders?.Where(o => o.status != "Đã Hủy").ToList() ?? new List<OrderModel>();

                    var thisMonthOrders = orders
                        .Where(o => o.NgayTaoDon >= startOfThisMonth && o.NgayTaoDon < startOfNextMonth)
                        .ToList();

                    var lastMonthOrders = orders
                        .Where(o => o.NgayTaoDon >= startOfLastMonth && o.NgayTaoDon < startOfThisMonth)
                        .ToList();

                    totalRevenueThisMonth += thisMonthOrders
                        .SelectMany(o => o.product ?? new List<ItemOrder>())
                        .Sum(p => p.price * p.quantity);

                    totalRevenueLastMonth += lastMonthOrders
                        .SelectMany(o => o.product ?? new List<ItemOrder>())
                        .Sum(p => p.price * p.quantity);

                    totalOrdersThisMonth += thisMonthOrders.Count;
                    totalOrdersLastMonth += lastMonthOrders.Count;
                }

                float growthRateRevenue = totalRevenueLastMonth == 0
                    ? 0
                    : ((totalRevenueThisMonth - totalRevenueLastMonth) / totalRevenueLastMonth) * 100;

                float growthRateOrders = totalOrdersLastMonth == 0
                    ? 0
                    : ((float)(totalOrdersThisMonth - totalOrdersLastMonth) / totalOrdersLastMonth) * 100;

                _logger.LogDebug("Retrieved revenue data: {Revenue} this month", totalRevenueThisMonth);
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    TotalRevenue = Math.Round(totalRevenueThisMonth, 2),
                    TotalOrders = totalOrdersThisMonth,
                    GrowthRateRevenue = Math.Round(growthRateRevenue, 2),
                    GrowthRateOrders = Math.Round(growthRateOrders, 2)
                }, "Lấy dữ liệu doanh thu thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving revenue data");
                throw;
            }
        }

        [HttpGet("GetKhachHangAndDiscount")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCustomersAndDiscounts()
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
                var startOfNextMonth = startOfThisMonth.AddMonths(1);
                var startOfLastMonth = startOfThisMonth.AddMonths(-1);

                var clients = await _clientCollection.Find(_ => true)
                    .Project(c => new { c.NgayTaoTaiKhoan })
                    .ToListAsync();

                var coupons = await _couponCollection.Find(_ => true)
                    .Project(c => new { c.NgayBatDau })
                    .ToListAsync();

                float clientsLastMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfLastMonth && c.NgayTaoTaiKhoan < startOfThisMonth);
                float clientsThisMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfThisMonth && c.NgayTaoTaiKhoan < startOfNextMonth);

                float couponsLastMonth = coupons.Count(c => c.NgayBatDau >= startOfLastMonth && c.NgayBatDau < startOfThisMonth);
                float couponsThisMonth = coupons.Count(c => c.NgayBatDau >= startOfThisMonth && c.NgayBatDau < startOfNextMonth);

                float clientGrowthRate = clientsLastMonth == 0 ? 0 : ((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100;
                float couponGrowthRate = couponsLastMonth == 0 ? 0 : ((couponsThisMonth - couponsLastMonth) / couponsLastMonth) * 100;

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    SoLuongKhachDangKy = clientsThisMonth,
                    TyLeKhachHang = Math.Round(clientGrowthRate, 2),
                    SoLuongCoupon = couponsThisMonth,
                    TyLeCoupon = Math.Round(couponGrowthRate, 2)
                }, "Lấy dữ liệu khách hàng và discount thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customers and discounts");
                throw;
            }
        }

        [HttpGet("GetDoanhThuCuaHang")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetShopRevenue()
        {
            try
            {
                var shops = await _shopCollection.Find(_ => true).ToListAsync();
                var now = DateTime.UtcNow;
                var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
                var startOfNextMonth = startOfThisMonth.AddMonths(1);

                var shopRevenues = new List<ListRevenue>();
                foreach (var shop in shops)
                {
                    var orders = shop.Orders?.ToList() ?? new List<OrderModel>();
                    float revenueThisMonth = orders
                        .Where(s => s.status != "Đã Hủy" && s.NgayTaoDon >= startOfThisMonth && s.NgayTaoDon < startOfNextMonth)
                        .SelectMany(a => a.product ?? new List<ItemOrder>())
                        .Sum(s => s.price * s.quantity);

                    shopRevenues.Add(new ListRevenue
                    {
                        ShopName = shop.shopName,
                        Revenue = revenueThisMonth
                    });
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { dataShop = shopRevenues }, "Lấy doanh thu cửa hàng thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop revenue");
                throw;
            }
        }

        [HttpPut("ResetSold")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> ResetSoldProducts()
        {
            try
            {
                var productUpdate = Builders<Product>.Update.Set(a => a.sold, 0);
                var productResult = await _productCollection.UpdateManyAsync(_ => true, productUpdate);

                var shopUpdate = Builders<Shop>.Update.Set("products.$[].sold", 0);
                var shopResult = await _shopCollection.UpdateManyAsync(_ => true, shopUpdate);

                _logger.LogInformation("Reset sold count: {ProductCount} products, {ShopCount} shops", 
                    productResult.ModifiedCount, shopResult.ModifiedCount);
                return Ok(ApiResponse.Success("Reset số lượng bán thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting sold products");
                throw;
            }
        }

        [HttpGet("LaySanPhamBanChay")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBestSellingProducts()
        {
            try
            {
                var products = await _productCollection.Find(_ => true)
                    .Project(s => new { s.sold, s.price, s.name, s.type })
                    .ToListAsync();

                var sortedProducts = products.OrderByDescending(s => s.sold).ToList();

                return Ok(ApiResponse<object>.SuccessResponse(new { listSold = sortedProducts }, "Lấy danh sách sản phẩm bán chạy thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving best selling products");
                throw;
            }
        }

        [HttpGet("InformationShop")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<object>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetShopInformation()
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
                var startOfNextMonth = startOfThisMonth.AddMonths(1);
                var startOfLastMonth = startOfThisMonth.AddMonths(-1);

                var shops = await _shopCollection.Find(_ => true)
                    .Project(s => new
                    {
                        name = s.shopName,
                        address = s.city,
                        orders = s.Orders,
                        sdt = s.phone,
                        rate = s.rating,
                        audience = s.reviews,
                        revenueThisMonth = (s.Orders == null ? 0 : s.Orders
                            .Where(o => o.NgayTaoDon >= startOfThisMonth && o.NgayTaoDon < startOfNextMonth && o.status != "Đã Hủy")
                            .SelectMany(o => o.product ?? new List<ItemOrder>())
                            .Sum(p => (double)p.quantity * (double)p.price)),
                        revenueLastMonth = (s.Orders == null ? 0 : s.Orders
                            .Where(o => o.NgayTaoDon >= startOfLastMonth && o.NgayTaoDon < startOfThisMonth && o.status != "Đã Hủy")
                            .SelectMany(o => o.product ?? new List<ItemOrder>())
                            .Sum(p => (double)p.quantity * (double)p.price)),
                    })
                    .ToListAsync();

                var result = shops.Select(s => new
                {
                    name = s.name,
                    city = s.address,
                    phone = s.sdt,
                    rating = s.rate,
                    s.audience,
                    revenue = s.revenueThisMonth,
                    growth = s.revenueLastMonth == 0 ? 0 :
                             Math.Round(((s.revenueThisMonth - s.revenueLastMonth) / s.revenueLastMonth) * 100, 2)
                }).ToList();

                return Ok(ApiResponse<List<object>>.SuccessResponse(result.Cast<object>().ToList(), "Lấy thông tin shop thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop information");
                throw;
            }
        }

        [HttpGet("DoanhThuCaNam")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetYearlyRevenue()
        {
            try
            {
                var now = DateTime.UtcNow;
                var currentYear = now.Year;
                var shops = await _shopCollection.Find(_ => true).ToListAsync();

                if (shops == null || !shops.Any())
                {
                    return Ok(ApiResponse<object>.SuccessResponse(new
                    {
                        revenue = new List<TotalRevenue>(),
                        stockByType = new List<object>(),
                        AppointMent = new List<object>()
                    }, "Không có dữ liệu"));
                }

                var revenue = new List<TotalRevenue>();

                for (int i = 1; i <= 12; i++)
                {
                    var startOfMonth = new DateTime(currentYear, i, 1);
                    var startOfNextMonth = startOfMonth.AddMonths(1);
                    int monthOrdersCount = 0;
                    decimal monthRevenueTotal = 0;

                    foreach (var shop in shops)
                    {
                        var monthOrders = shop.Orders?
                            .Where(o => o.NgayTaoDon >= startOfMonth
                                     && o.NgayTaoDon < startOfNextMonth
                                     && o.status != "Đã Hủy")
                            .ToList() ?? new List<OrderModel>();

                        var monthRevenue = monthOrders
                            .SelectMany(o => o.product ?? new List<ItemOrder>())
                            .Sum(p => (decimal)p.quantity * (decimal)p.price);

                        monthOrdersCount += monthOrders.Count;
                        monthRevenueTotal += monthRevenue;
                    }

                    revenue.Add(new TotalRevenue
                    {
                        Thang = i.ToString(),
                        Revenue = monthRevenueTotal,
                        orders = monthOrdersCount
                    });
                }

                var products = await _productCollection
                    .Find(_ => true)
                    .Project(a => new { a.type, a.stock })
                    .ToListAsync();

                var totalStock = products.Sum(s => s.stock);

                var stockByType = products
                    .GroupBy(p => p.type)
                    .Select(g => new
                    {
                        Type = g.Key,
                        TotalStock = g.Sum(x => x.stock),
                        Value = totalStock == 0 ? 0 : Math.Round((double)g.Sum(x => x.stock) / totalStock * 100, 2)
                    })
                    .ToList();

                var allAppointments = shops
                    .Where(s => s.appoiments != null)
                    .SelectMany(s => s.appoiments)
                    .ToList();

                var appointments = allAppointments
                    .GroupBy(a => a.Service)
                    .Select(g => new
                    {
                        service = g.Key,
                        TotalUse = g.Count()
                    })
                    .OrderByDescending(a => a.TotalUse)
                    .ToList();

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    revenue,
                    stockByType,
                    AppointMent = appointments
                }, "Lấy doanh thu cả năm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving yearly revenue");
                throw;
            }
        }
    }
}
