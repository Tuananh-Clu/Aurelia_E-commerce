using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Shop;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Text.Json;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        public readonly ShopService shopService;
        public readonly IMongoCollection<Shop> mongoCollection;
        public readonly IMongoCollection<Client> ngoCollection;
        public readonly IMongoCollection<Product> mongo;
        public readonly IHubContext<NotifyHub> hubContexts;
        public ShopController(ShopService service, MongoDbContext dbContext,IHubContext<NotifyHub> hubContext)
        {
            shopService = service;
            mongoCollection = dbContext.Shop;
            ngoCollection = dbContext.Client;
            mongo = dbContext.SanPham;
            hubContexts = hubContext;
        }
        [HttpPost("AddShop")]
        public async Task<IActionResult> AddShop(IFormFile file)
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var json = await reader.ReadToEndAsync();
            var result = JsonSerializer.Deserialize<List<Shop>>(json);
            if (result == null || !result.Any())
                return BadRequest("File JSON không hợp lệ hoặc rỗng");

            await shopService.AddShop(result);
            return Ok("Thêm sản phẩm thành công ✅");
        }
        [HttpPost("GetShop")]
        public async Task<IActionResult> GetShop([FromBody] ShopFindDto dto)
        {
            var data = await shopService.Shops(dto);
            return Ok(data);
        }
        [HttpGet("GetSHopById")]
        public async Task<IActionResult> getShopById([FromQuery] string id)
        {
            var data = await shopService.Shop(id);
            return Ok(data.FirstOrDefault());
        }
        [HttpPost("AddAppointment")]
        public async Task<IActionResult> addAppointment([FromBody] Appointment appointment, [FromQuery] string shopId)
        {
            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
            var update = Builders<Shop>.Update.Push(a=>a.appoiments, appointment);
            await mongoCollection.UpdateOneAsync(filter, update);
            string shopAppointment = "Shop_Appointment" + appointment.ShopId;
            string messages = $"Có Lịch Hẹn Của Khách  {appointment.CustomerName}" +" "+
                $"Dịch Vụ : {appointment.Service}";
            var lol = new
            {
                message = messages
            };
            await hubContexts.Clients.Group(shopAppointment).SendAsync("AppointmentBooking",lol);
            return Ok(new { message = "Thêm Lịch Hẹn Thành Công!" });
        }
        [HttpPost("LayNgayHen")]
        public async Task<IActionResult> LayAppointmentShop([FromBody] UploadGetAppointment getAppointment)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(a => a.shopId, getAppointment.ShopId),
                Builders<Shop>.Filter.ElemMatch(a => a.appoiments.Select(a => a.CreatedAt), getAppointment.NgayTao)
                );
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (data == null)
            {
                return Ok("None");
            }
            var slot = data.appoiments.Select(a => a.CreatedAt);
            return Ok(slot);

        }
        [HttpPost("LayTatCaSlotTheoNgay")]
        public async Task<IActionResult> LaySlotTheoNgay([FromBody] GetSlotDto dto)
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(a => a.shopId, dto.shopId),
                Builders<Shop>.Filter.ElemMatch(s => s.appoiments, ap => ap.Date == dto.Date)
            );

            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();

            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy shop hoặc không có appointment trong ngày này" });
            }

            var appoimentsInDate = data.appoiments.Where(a => a.Date == dto.Date);

            return Ok(
                appoimentsInDate.Select(a => new
                {
                    slot = a.Slot,
                    duration = a.Duration
                })
                );
        }
        [NonAction]
        public async Task<double> CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            double dlat = (lon2 - lon1) * Math.PI / 180;
            double dlon = (lat2 - lat1) * Math.PI / 180;
            var latCus = lat1 * Math.PI / 180;
            var latShop = lat2 * Math.PI / 180;
            var lechChuan = Math.Pow(Math.Sin(dlat / 2), 2) + Math.Cos(latCus) * Math.Cos(latShop) * Math.Pow(Math.Sin(dlon / 2), 2);
            double c = 2 * Math.Atan2(Math.Sqrt(lechChuan), Math.Sqrt(1 - lechChuan));
            return R * c;

        }

        [HttpPost("SapXepDonChoCuaHang")]
        public async Task<IActionResult> SapXepDon([FromBody] OrderModel orderModel, bool nana)
        {
            var stores = await mongoCollection.Find(_ => true).ToListAsync();

            Shop nearestStore = null;
            double nearestDistance = double.MaxValue;

            foreach (var store in stores)
            {
                bool hasStock = orderModel.product.All(orderProduct =>
                    store.products.Any(p =>
                        p.productId == orderProduct.Itemid &&
                        p.variants.Any(v =>
                            v.sizes.Any(s =>
                                s.size == orderProduct.size && s.quantity >= orderProduct.quantity
                            )
                        )
                    )
                );

                if (!hasStock) continue;

                double distance = await CalculateDistance(orderModel.lat, orderModel.ion, store.lat, store.lng);

                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearestStore = store;
                }
            }

            if (nearestStore == null)
            {
                return NotFound("Không có cửa hàng nào còn đủ hàng để xử lý đơn.");
            }

            float TotalAmount = orderModel.product.Sum(a => a.quantity * a.price);
            decimal shippingFee = 0;

            if (TotalAmount > 1000000000)
            {
                shippingFee = 0;
            }
            else if (nearestDistance <= 5)
            {
                shippingFee =0;
            }
            else if (nearestDistance <= 100)
            {
                shippingFee = 25000;
            }
            else if (nearestDistance <= 200)
            {
                shippingFee = 35000;
            }
            else if (nearestDistance <= 1000)
            {
                shippingFee = 45000;
            }
            else
            {
                shippingFee = 55000;
            }
            if (nana)
            {
                return Ok(new
                {
                    Message = "Ước lượng chi phí vận chuyển",
                    StoreId = nearestStore.shopId,
                    Distance = nearestDistance,
                    ShippingFee = shippingFee
                });
            }

            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, nearestStore.shopId);
            var update = Builders<Shop>.Update.Push("Orders", orderModel);

            await mongoCollection.UpdateOneAsync(filter, update);
            Console.WriteLine($"📤 nearestStore.shopId type: {nearestStore.shopId.GetType()}");
            return Ok(new
            {
                Message = "Đã gán đơn cho cửa hàng",
                StoreId = nearestStore.shopId,
                Distance = nearestDistance,
                ShippingFee = shippingFee
            });
        }
        [HttpGet("LayDonHangTheoId")]
        public async Task<IActionResult> GetDonHangTheoId([FromQuery]string id)
        {
            var filter = Builders<Shop>.Filter.ElemMatch(o => o.Orders, order => order.orderId == id);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(new
            {
                shopName=data.shopName,
                address=data.address,
                lat=data.lat,
                ion=data.lng,
                data = data.Orders.FirstOrDefault()
            });
        }
        [HttpGet("DataForDashBoard")]
        public async Task<IActionResult> DateForDashBoard([FromQuery] string shopId)
        {
            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            var customer = await ngoCollection.Find(_ => true).ToListAsync();

            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var yesterday = today.AddDays(-1);
            if(data==null)
            {
                return BadRequest();
            }
            var fetchAppoinment = data.appoiments
                .Count(a => a.CreatedAt >= today && a.CreatedAt < tomorrow);

            var fetchOrder = data.Orders
                .Count(a => a.NgayTaoDon >= today && a.NgayTaoDon < tomorrow);
            var fetchOrderHomQua = data.Orders
               .Count(a => a.NgayTaoDon >= yesterday && a.NgayTaoDon < today);

            var doanhSoHomNay = data.Orders
                .Where(a => a.NgayTaoDon >= today && a.NgayTaoDon < tomorrow)
                .Sum(a => a.product.Sum(p => p.price));

            var doanhSoHomQua = data.Orders
                .Where(a => a.NgayTaoDon >= yesterday && a.NgayTaoDon < today)
                .Sum(a => a.product.Sum(p => p.price));
            var fetchCustomer = customer
             .Count(a => a.NgayTaoTaiKhoan >= today && a.NgayTaoTaiKhoan < tomorrow);

            var lichCho = data.appoiments
                .Count(a => a.CreatedAt >= today && a.CreatedAt < tomorrow && a.Status == "Pending");
            double phanTramTang = doanhSoHomQua == 0 ? 100 : ((double)(doanhSoHomNay - doanhSoHomQua) / doanhSoHomQua) * 100;
            double DonHomNay = fetchOrderHomQua == 0 ? 0 : (fetchOrder - fetchOrderHomQua);
            double UserCreateToday = fetchCustomer == 0 ? 0 : (fetchOrder - fetchOrderHomQua);

            return Ok(new
            {
                doanhThu = doanhSoHomNay,
                doanhSoPhanTram = phanTramTang+"%",
                orderHomNay=fetchOrder,
                soDon=DonHomNay,
                SoLichHen=fetchAppoinment,
                SoLichCho=lichCho,
                SoUser=fetchCustomer,
                SoLuongTang=UserCreateToday
            });
        }
        [HttpGet("LayDanhSachLichHenVaDonHang")]
        public async Task<IActionResult> LayDanhSachLichHen([FromQuery]string shopId)
        {
            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            var ListAppoinment = data.appoiments.OrderByDescending(a => a.CreatedAt).ToList();
            var ListOrder = data.Orders.OrderByDescending(a => a.NgayTaoDon).ToList();
            return Ok(new
            {
                listOrder = ListOrder,
                ListAppoinment = ListAppoinment
            });
        }
        [HttpPost("UpdateTrangThai")] 
        public async Task<IActionResult> UpdateTrangThaiDonHang([FromBody] UpdateStatusDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            var shopFilter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(s => s.shopId, dto.ShopId),
                Builders<Shop>.Filter.ElemMatch(s => s.Orders, o => o.orderId == dto.OrderId)
            );

            var clientFilter = Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, o => o.orderId == dto.OrderId);

 
            var shopUpdate = Builders<Shop>.Update
                .Set("Orders.$.status", dto.status)
                .Set("Orders.$.tracking.UpdateTime", DateTime.Now);

            var clientUpdate = Builders<Client>.Update
                .Set("DonHangCuaBan.$.status", dto.status)
                .Set("DonHangCuaBan.$.tracking.UpdateTime", DateTime.Now);

            await mongoCollection.UpdateOneAsync(shopFilter, shopUpdate);
            await ngoCollection.UpdateOneAsync(clientFilter, clientUpdate);

            string message = dto.status switch
            {
                "Xác Nhận" => "Xác Nhận Thành Công!",
                "Đóng gói" => "Đóng Gói Thành Công",
                _ => "Bàn Giao Cho Đơn Vị Vận Chuyển Thành Công"
            };

            return Ok(new { message });
        }
        [HttpGet("LaySanPham")]
        public async Task<IActionResult> LaySanPham([FromQuery] string shopId)
        {
            try
            {
                var filterShop = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                var shopData = await mongoCollection.Find(filterShop).FirstOrDefaultAsync();

                if (shopData == null)
                    return NotFound("Không tìm thấy shop này.");

                var productIds = shopData.products.Select(p => p.productId).ToList();

                var filterProducts = Builders<Product>.Filter.In(a=>a.id, productIds);
                var products = await mongo.Find(filterProducts).ToListAsync();

 
                int tongSanPham = products.Count;


                int tongSoLuongKho = shopData.products
                    .Where(p => p.variants != null)
                    .SelectMany(p => p.variants)
                    .Where(v => v.sizes != null)
                    .SelectMany(v => v.sizes)
                    .Sum(s => s.quantity);

                double tongGiaTriKho = 0;
                foreach (var prod in products)
                {
                    var shopProduct = shopData.products.FirstOrDefault(p => p.productId == prod.id);
                    if (shopProduct != null)
                    {
                        int soLuong = shopProduct.variants
                            .SelectMany(v => v.sizes)
                            .Sum(s => s.quantity);

                        tongGiaTriKho += prod.price * soLuong;
                    }
                }
                return Ok(new
                {
                    tongSanPham,
                    tongSoLuongKho,
                    tongGiaTriKho,
                    danhSachSanPham = products,
                    shopData=shopData
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("UploadSanPham")]
        public async Task<IActionResult> UploadSanPham([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
                var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
                await mongo.InsertOneAsync(product);
                var data = new ProductAtShop
                {
                    productId = product.id,
                    brand = product.brand,
                    name = product.name,
                    sold = product.sold,
                    variants = product.variants
                };
                var updateShop = Builders<Shop>.Update.Push(a => a.products, data);
                await mongoCollection.UpdateOneAsync(filter, updateShop);
                return Ok(new { message = "Upload Thanh Cong" });
            }
            catch
            {
                return BadRequest(new { message = "Upload Khong Thanh Cong" });
            }


        }
        [HttpPost("SuaSanPham")]
        public async Task<IActionResult> EditSanPham([FromBody] Product product, [FromQuery] string shopId)
        {
            try
            {
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
                await mongo.UpdateOneAsync(filterProduct, updateProduct);
                var updatedProduct = new ProductAtShop
                {
                    productId=product.id,
                    name=product.name,
                    brand=product.brand,
                    variants=product?.variants,
                    sold=product.sold
                   
                };
                var update = Builders<Shop>.Update
                    .Set("products.$", updatedProduct);
                var result = await mongoCollection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount > 0)
                    return Ok(new { message = "Cập nhật sản phẩm thành công!" });
                else
                    return NotFound(new { message = "Không tìm thấy sản phẩm để cập nhật." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật sản phẩm.", error = ex.Message });
            }
        }
        [HttpPost("PostMessage")]
        public async Task<IActionResult> PostNotifycation([FromBody] Notifycation notifycation)
        {
            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, notifycation.shopId);
            var update = Builders<Shop>.Update.Push(a => a.Notifycation, notifycation);
            var result = await mongoCollection.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
                return NotFound("Shop not found");
            await hubContexts.Clients.Group(notifycation.shopId)
                .SendAsync("ReceiveNotification", notifycation);

            return Ok("Notification sent and saved");
        }
        [HttpGet("GetNoti")]
        public async Task<IActionResult> GetNoti([FromQuery]string shopId)
        {
            var filter = Builders<Shop>.Filter.Eq(a => a.shopId, shopId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            return Ok(data.Notifycation.ToList());
        }
        [HttpPost("CheckNotifycation")]
        public async Task CheckNotifycation([FromBody]AddCheckDto dto )
        {
            var filter = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(a => a.shopId, dto.shop_ID),
                Builders<Shop>.Filter.ElemMatch(a => a.Notifycation, s => s.id == dto.idNotifycation));
            var update = Builders<Shop>.Update.Set("Notifycation.$.isChecked", true);
            await mongoCollection.UpdateOneAsync(filter, update);
        }
        [HttpGet("GetAllCustomer")]
        public async Task<IActionResult> GetAllCustomer()
        {
            var data = await ngoCollection.Find(_ => true).ToListAsync();

            var totalCustomer = data.Count();

            var totalDoanhThu = data
                .SelectMany(a => a.DonHangCuaBan)
                .SelectMany(a => a.product)
                .Sum(a => a.quantity * a.price);

            double averageChiTieuKhachHang = 0;

            if (totalCustomer > 0)
            {
                averageChiTieuKhachHang = totalDoanhThu / (double)totalCustomer;
            }

            return Ok(new
            {
                listCustomer = data,
                totalCustomer,
                totalDoanhThu,
                averageChiTieuKhachHang
            });
        }

    }
}
