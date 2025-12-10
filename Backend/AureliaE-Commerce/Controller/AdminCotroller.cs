using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IMongoCollection<Shop> _shops;
        private readonly IMongoCollection<Client> _clients;
        private readonly IMongoCollection<Coupon> _coupons;
        private readonly IMongoCollection<Product> sanpham;
        public AdminController(MongoDbContext dbContext)
        {
            _shops = dbContext.Shop;
            _clients = dbContext.Client;
            _coupons = dbContext.MaGiamGia;
            sanpham = dbContext.SanPham;
        }

        [HttpGet("Revenue")]
        public async Task<IActionResult> GetRevenue()
        {
            var shops = await _shops.Find(_ => true).ToListAsync();

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
                var orders = shop.Orders?.Where(o => o.status != "Đã Hủy").ToList();

                var thisMonthOrders = orders
                    .Where(o => o.NgayTaoDon >= startOfThisMonth && o.NgayTaoDon < startOfNextMonth)
                    .ToList();


                var lastMonthOrders = orders
                    .Where(o => o.NgayTaoDon >= startOfLastMonth && o.NgayTaoDon < startOfThisMonth)
                    .ToList();


                totalRevenueThisMonth += thisMonthOrders.SelectMany(o => o.product)
                    .Sum(p => p.price * p.quantity);

                totalRevenueLastMonth += lastMonthOrders.SelectMany(o => o.product)
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

            return Ok(new
            {
                TotalRevenue = Math.Round(totalRevenueThisMonth, 2),
                TotalOrders = totalOrdersThisMonth,
                GrowthRateRevenue = Math.Round(growthRateRevenue, 2),
                GrowthRateOrders = Math.Round(growthRateOrders, 2)
            });
        }


        [HttpGet("GetKhachHangAndDiscount")]
        public async Task<IActionResult> GetKhachHangAndDiscount()
        {
            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfNextMonth = startOfThisMonth.AddMonths(1);
            var startOfLastMonth = startOfThisMonth.AddMonths(-1);

            var clients = await _clients.Find(_ => true)
                .Project(c => new { c.NgayTaoTaiKhoan })
                .ToListAsync();

            var coupons = await _coupons.Find(_ => true)
                .Project(c => new { c.NgayBatDau })
                .ToListAsync();

            float clientsLastMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfLastMonth && c.NgayTaoTaiKhoan < startOfThisMonth);
            float clientsThisMonth = clients.Count(c => c.NgayTaoTaiKhoan >= startOfThisMonth && c.NgayTaoTaiKhoan < startOfNextMonth);

  
            float couponsLastMonth = coupons.Count(c => c.NgayBatDau >= startOfLastMonth && c.NgayBatDau < startOfThisMonth);
            float couponsThisMonth = coupons.Count(c => c.NgayBatDau >= startOfThisMonth && c.NgayBatDau < startOfNextMonth);


            float clientGrowthRate = clientsLastMonth == 0 ? 0 : ((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100;
            float couponGrowthRate = couponsLastMonth == 0 ? 0 : ((couponsThisMonth - couponsLastMonth) / couponsLastMonth) * 100;

            return Ok(new
            {
                SoLuongKhachDangKy = clientsThisMonth,
                TyLeKhachHang = Math.Round(clientGrowthRate, 2),
                SoLuongCoupon = couponsThisMonth,
                TyLeCoupon = Math.Round(couponGrowthRate, 2)
            });
        }
        [HttpGet("GetDoanhThuCuaHang")]
        public async Task<IActionResult> GetDoanhThu()
        {
            var shops = await _shops.Find(_ => true).ToListAsync();
            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfNextMonth = startOfThisMonth.AddMonths(1);
            List<ListRevenue> dataShop = new List<ListRevenue>();
            foreach(var shop in shops)
            {
                var order = shop.Orders.ToList();
                float revenueThisMonth = order.Where(s => s.status != "Đã Hủy"&&s.NgayTaoDon>startOfThisMonth).SelectMany(a => a.product).Sum(s => s.price * s.quantity);
                var bruh = new ListRevenue
                {
                    ShopName = shop.shopName,
                    Revenue = revenueThisMonth
                };
                dataShop.Add(bruh);
            }
            return Ok(new
            {
                dataShop = dataShop
            });
        }
        [HttpGet("ResetSold")]
        public async Task Reset()
        {
            var updateproduct = Builders<Product>.Update.Set(a => a.sold, 0);
            await sanpham.UpdateManyAsync(_ => true, updateproduct);
            var updateShop = Builders<Shop>.Update.Set("products.$[].sold", 0);
            await _shops.UpdateManyAsync(_ => true, updateShop);
        }
        [HttpGet("LaySanPhamBanChay")]

        public async Task<IActionResult> LaySanPhamBanChay()
        {
            var product = await sanpham.Find(_ => true).Project(s=>new { s.sold,s.price,s.name,s.type}).ToListAsync();
            var list = product.OrderByDescending(s=>s.sold);
            return Ok(new
            {
                listSold = list
            });
        }
        [HttpGet("InformationShop")]
        public async Task<IActionResult> GetInformationShop()
        {
            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfNextMonth = startOfThisMonth.AddMonths(1);
            var startOfLastMonth = startOfThisMonth.AddMonths(-1);

            var data = await _shops.Find(_ => true)
                .Project(s => new
                {
                    name = s.shopName,
                    address = s.city,
                    orders = s.Orders,
                    sdt = s.phone,
                    rate = s.rating,
                    audience = s.reviews,

                    revenueThisMonth = s.Orders
                        .Where(o => o.NgayTaoDon >= startOfThisMonth && o.NgayTaoDon < startOfNextMonth && o.status != "Đã Hủy")
                        .SelectMany(o => o.product)
                        .Sum(p => (double)p.quantity * (double)p.price),

                    revenueLastMonth = s.Orders
                        .Where(o => o.NgayTaoDon >= startOfLastMonth && o.NgayTaoDon < startOfThisMonth && o.status != "Đã Hủy")
                        .SelectMany(o => o.product)
                        .Sum(p => (double)p.quantity * (double)p.price),
                })
                .ToListAsync();

            var result = data.Select(s => new
            {
                name=s.name,
                city=s.address,
                phone =s.sdt,
               rating= s.rate,
                s.audience,
                revenue = s.revenueThisMonth,
                growth = s.revenueLastMonth == 0 ? 0 :
                         Math.Round(((s.revenueThisMonth - s.revenueLastMonth) / s.revenueLastMonth) * 100, 2)
            });

            return Ok(result);
        }
        [HttpGet("DoanhThuCaNam")]
        public async Task<IActionResult> GetRevenueYear()
        {
            var now = DateTime.UtcNow;
            var currentYear = now.Year;
            var data = await _shops.Find(_ => true).ToListAsync();

            if (data == null)
            {
                return Ok(new
                {
                    revenue = new List<TotalRevenue>(),
                    stockByType = new List<object>(),
                    AppointMent = new List<object>()
                });
            }
            var revenue = new List<TotalRevenue>();

            for (int i = 1; i <= 12; i++)
            {
                var startOfMonth = new DateTime(currentYear, i, 1);
                var startOfNextMonth = startOfMonth.AddMonths(1);
                int monthOrdersCount = 0;
                decimal monthRevenueTotal = 0;

                foreach (var shop in data)
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

            var products = await sanpham
                .Find(_ => true)
                .Project(a => new { a.type, a.stock })
                .ToListAsync();

            var totalStock = products.Sum(s => s.stock);

            var stockByType =
                products
                    .GroupBy(p => p.type)
                    .Select(g => new
                    {
                        Type = g.Key,
                        TotalStock = g.Sum(x => x.stock),
                        Value = totalStock == 0 ? 0 : Math.Round((double)g.Sum(x => x.stock) / totalStock * 100, 2)
                    })
                    .ToList();

            var allAppointments = data
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

            return Ok(new
            {
                revenue = revenue,
                stockByType = stockByType,
                AppointMent = appointments
            });
        }

    }
}
