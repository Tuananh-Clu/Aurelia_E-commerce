using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Model.Shop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        public readonly IMongoCollection<Client> mongoCollection;
        public readonly IMongoCollection<Shop> mongo;
        public readonly IMongoCollection<Product> mongos;
        public readonly IHubContext<NotifyHub> hubContext;
        public readonly IMongoCollection<MaGiamGia> voucher;
        public ClientController(MongoDbContext dbContext, IHubContext<NotifyHub> hubContexts)
        {
            mongoCollection = dbContext.Client;
            hubContext = hubContexts;
            mongo = dbContext.Shop;
            mongos = dbContext.SanPham;
            voucher = dbContext.MaGiamGiaVoucher;
        }
         [NonAction]
        private string? GetUserIdFromCookie(string typeAccount = "user")
        {
            string cookieName = typeAccount switch
            {
                "user" => "access_token_user",
                "shop" => "access_token_shop",
                "admin" => "access_token_admin",
                _ => "access_token_user"
            };

            if (!Request.Cookies.TryGetValue(cookieName, out var token))
                return null;

            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
                return null;

            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            return userId;
        }

        [HttpGet("LayThongTinNguoiDung")]
        public async Task<IActionResult> GetDataUser()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized("Chưa đăng nhập");

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            return Ok(new { user = data });
        }

        [HttpPost("AddItems")]
        public async Task<IActionResult> AddItems([FromBody] Product product)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var update = Builders<Client>.Update.Push(c => c.SanPhamYeuThich, product);
            var result = await mongoCollection.UpdateOneAsync(filter, update);
            if (result.ModifiedCount > 0) return Ok(new { message = "Thêm sản phẩm thành công" });

            return BadRequest(new { message = "Không tìm thấy user hoặc thêm thất bại" });
        }

        [HttpPost("AutoAddGioHangKhiLog")]
        public async Task<IActionResult> AddDon([FromBody] List<ItemOrder> Product)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var update = Builders<Client>.Update.PushEach(a => a.GioHangCuaBan, Product);
            await mongoCollection.UpdateOneAsync(filter, update);

            return Ok(new { s = "Add thành công", p = Product });
        }

        [HttpDelete("XoaGioHang")]
        public async Task<IActionResult> XoaGioHang()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var update = Builders<Client>.Update.Set(c => c.GioHangCuaBan, new List<ItemOrder>());
            await mongoCollection.UpdateOneAsync(filter, update);

            return Ok("Đã xóa toàn bộ giỏ hàng");
        }

        [HttpGet("GetItemFavourite")]
        public async Task<IActionResult> GetItemFavourite()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var client = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (client == null) return NotFound("Client not found");

            return Ok(client.SanPhamYeuThich);
        }

        [HttpPost("AddDonHang")]
        public async Task<IActionResult> AddDonHang([FromBody] OrderModel order, [FromQuery] string shopId)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var update = Builders<Client>.Update.Push("DonHangCuaBan", order);
            var result = await mongoCollection.UpdateOneAsync(filter, update);

            string shopGroup = $"Shop_{shopId}";
            string messages = $"Đơn hàng mới #{order.orderId} từ {order.name}";
            var value = order.product.Sum(a => a.price * a.quantity);

            var point = value switch
            {
                <= 100_000_000 => 100,
                <= 500_000_000 => 500,
                <= 1_000_000_000 => 1000,
                _ => 2000
            };

            var productId = order.product.Select(a => a.Itemid).FirstOrDefault();
            var updates = Builders<Client>.Update.Set(a => a.Point, point);
            await mongoCollection.UpdateOneAsync(filter, updates);

            var quantity = order.product.Where(a => a.Itemid == productId).Sum(a => a.quantity);

            var filters = Builders<Shop>.Filter.And(
                Builders<Shop>.Filter.Eq(a => a.shopId, shopId),
                Builders<Shop>.Filter.ElemMatch(a => a.products, s => s.productId == productId)
            );

            var filterVoucher = Builders<MaGiamGia>.Filter.Eq(a => a.code, order.voucherUsed != null && order.voucherUsed.Count > 0 ? order.voucherUsed[0].code : "");
            var updateVoucher = Builders<MaGiamGia>.Update.Inc(a => a.soLuong, -1);
            await voucher.UpdateOneAsync(filterVoucher, updateVoucher);

            var updatess = Builders<Shop>.Update.Inc("products.$.sold", quantity);
            await mongo.UpdateOneAsync(filters, updatess);

            var dataNotify = new { message = messages };
            await hubContext.Clients.Group(shopGroup).SendAsync("NotificationOrder", dataNotify);

            if (result.ModifiedCount > 0) return Ok(new { message = "Thêm sản phẩm thành công" });
            return BadRequest(new { message = "Không tìm thấy user hoặc thêm thất bại" });
        }

        [HttpGet("LayDonHang")]
        public async Task<IActionResult> LayDonHang()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            return Ok(data.DonHangCuaBan);
        }

        [HttpGet("LayDonHangGanDay")]
        public async Task<IActionResult> LayDonHangGanDay()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();

            if (data == null || data.DonHangCuaBan == null || !data.DonHangCuaBan.Any())
                return NotFound("Không tìm thấy đơn hàng nào");

            var orderGanDay = data.DonHangCuaBan.SelectMany(a => a.product)
                .OrderByDescending(o => o.dateBuy)
                .FirstOrDefault();

            return Ok(new { ngayMoiNhat = orderGanDay.dateBuy });
        }

        [HttpGet("GetSoLuongDonHang")]
        public async Task<IActionResult> GetSoLuongDonHang()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (data == null) return NotFound(new { message = "User not found" });

            var soLuongDon = data.DonHangCuaBan.Count(a => a.status != "Đã Hủy");
            var tongTien = data.DonHangCuaBan
                .Where(a => a.status != "Đã Hủy")
                .SelectMany(dh => dh.product)
                .Sum(p => p.quantity * p.price);

            return Ok(new { SoLuongDon = soLuongDon, TongTien = tongTien });
        }

        [HttpPost("UpMeasure")]
        public async Task<IActionResult> UpMeasure([FromBody] Measure measure)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var update = Builders<Client>.Update.Set("SoDoNgDUng", measure);
            await mongoCollection.UpdateOneAsync(filter, update);
            return Ok(measure);
        }

        [HttpGet("GetSoDo")]
        public async Task<IActionResult> GetSoDo()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (data.SoDoNgDUng == null) return BadRequest();

            var das = data.SoDoNgDUng;
            return Ok(new Measure
            {
                vai = das.vai ?? "",
                eo = das.eo ?? "",
                chieuCao = das.chieuCao ?? "",
                nguc = das.nguc ?? "",
                hong = das.hong ?? ""
            });
        }

        [HttpPost("AddCuocHenUser")]
        public async Task<IActionResult> AddCuocHen([FromBody] ClientAppointment clientAppointment)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var update = Builders<Client>.Update.Push("LichSuCuocHen", clientAppointment);
            await mongoCollection.UpdateOneAsync(filter, update);

            return Ok(new { message = "Thêm Lịch Hẹn Thành Công!" });
        }

        [HttpGet("LayCuocHenUser")]
        public async Task<IActionResult> LayCuocHen()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await mongoCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) return NotFound(new { message = "Người dùng không tồn tại" });

            var appointments = user.LichSuCuocHen?.ToList();
            if (appointments == null || !appointments.Any())
                return Ok(new { message = "Chưa có cuộc hẹn nào" });

            return Ok(appointments);
        }

        [HttpPost("LuuDiaChi")]
        public async Task<IActionResult> LuuAddress([FromBody] ThongTinCaNhan thongTinCaNhan)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var update = Builders<Client>.Update.Push(a => a.ThongTinDatHang, thongTinCaNhan);
            await mongoCollection.UpdateOneAsync(filter, update);
            return Ok(new { message = "Lưu Thành Công" });
        }

        [HttpGet("LayDiaChi")]
        public async Task<IActionResult> LayDiaChi()
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(a => a.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            return Ok(data.ThongTinDatHang);
        }

        [HttpPost("XoaDiaChi")]
        public async Task<IActionResult> XoaDiaChi([FromBody] ThongTinCaNhan thongTinCaNhan)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var update = Builders<Client>.Update.PullFilter(
                c => c.ThongTinDatHang,
                td => td.HoVaTen == thongTinCaNhan.HoVaTen &&
                      td.DiaChi == thongTinCaNhan.DiaChi &&
                      td.Email == thongTinCaNhan.Email &&
                      td.SoDT == thongTinCaNhan.SoDT
            );

            var result = await mongoCollection.UpdateOneAsync(filter, update);
            if (result.ModifiedCount > 0) return Ok(new { message = "Xóa thành công" });
            return NotFound(new { message = "Không tìm thấy địa chỉ" });
        }

        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCustomer updateProfileCustomer)
        {
            var userId = GetUserIdFromCookie("user");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = Builders<Client>.Filter.Eq(c => c.Id, userId);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();

            var update = Builders<Client>.Update
                .Set(s => s.Name, updateProfileCustomer.hovaten)
                .Set(s => s.Email, updateProfileCustomer.email)
                .Set(s => s.SoDt, updateProfileCustomer.soDt)
                .Set(s => s.DiaChi, updateProfileCustomer.address)
                .Set(s => s.Avatar, updateProfileCustomer.avatarUrl);

            await mongoCollection.UpdateOneAsync(filter, update);

            data.Name = updateProfileCustomer.hovaten;
            data.Email = updateProfileCustomer.email;
            data.SoDt = updateProfileCustomer.soDt;
            data.DiaChi = updateProfileCustomer.address;
            data.Avatar = updateProfileCustomer.avatarUrl;

            return Ok(new { message = "Cập Nhật Thành Công", user = data });
        }
        [HttpPost("UpdateTier")]
        public async Task UpdateTier()
        {
            var userToken = GetUserIdFromCookie("user");
            var filter = Builders<Client>.Filter.Eq(c => c.Id, userToken);
            var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
            var point = data.Point;
            var tier = point switch
            {
                <= 1000 => "Bronze",
                <= 5000 => "Silver",
                <= 10000 => "Gold",
                <= 20000 => "Diamond",
                _ => "Royal"
            };
            var update = Builders<Client>.Update.Set(s => s.Tier, tier);
            await mongoCollection.UpdateOneAsync(filter, update);
            var dataBenfit = new benefit
            {
                name = "",
                freeShipping = true,
                value=0
            };
            benefit dataBenefit = tier switch
            {
                "Bronze" => new benefit { name = "Ưu đãi sinh nhật 3%", freeShipping = false, value = 3 },
                "Silver" => new benefit { name = "Miễn phí vận chuyển đơn đầu tiên + Ưu đãi sinh nhật 5%", freeShipping = true, value = 5 },
                "Gold" => new benefit { name = "Giảm 10% cho tất cả sản phẩm + Ưu tiên hỗ trợ khách hàng", freeShipping = true, value = 10 },
                "Diamond" => new benefit { name = "Giảm 15% + Quà tri ân mỗi quý", freeShipping = true, value = 15 },
                "Royal" => new benefit { name = "Giảm 20% + Ưu đãi sự kiện VIP + Hỗ trợ riêng 24/7", freeShipping = true, value = 20 },
                "Royal Plus" => new benefit { name = "Giảm 30% + Quà tặng độc quyền + Trải nghiệm cao cấp", freeShipping = true, value = 30 },
                _ => null
            };

            if (dataBenefit != null)
            {
                var updates = Builders<Client>.Update.Set(a => a.Benefits, dataBenefit);
                await mongoCollection.UpdateOneAsync(filter, updates);
            }

        }
        [HttpPost("HuyDonHang")]
        public async Task<IActionResult> HuyDonHang( [FromQuery] string orderId)
        {
            try
            {
                var userToken = GetUserIdFromCookie("user");
                var filter = Builders<Client>.Filter.And(Builders<Client>.Filter.Eq(c => c.Id, userToken),
                     Builders<Client>.Filter.ElemMatch(c => c.DonHangCuaBan, d => d.orderId == orderId));
                var update = Builders<Client>.Update.Set("DonHangCuaBan.$.status", "Đã Hủy");
                await mongoCollection.UpdateOneAsync(filter, update);

                var filterShop = Builders<Shop>.Filter.ElemMatch(a => a.Orders, s => s.orderId == orderId);
                var updateShop = Builders<Shop>.Update.Set("Orders.$.status", "Đã Hủy");
                await mongo.UpdateOneAsync(filterShop, updateShop);

                var data = await mongoCollection.Find(filter).FirstOrDefaultAsync();
                var quantity = data.DonHangCuaBan.SelectMany(a => a.product).Select(a => a.quantity).First();
                var size = data.DonHangCuaBan.SelectMany(a => a.product).Select(a => a.size).First();
                var productID = data.DonHangCuaBan.SelectMany(a => a.product).Select(a => a.Itemid).First();
                var color = data.DonHangCuaBan.SelectMany(a => a.product).Select(a => a.color).First();
                var filterSanPham = Builders<Product>.Filter.And(
                    Builders<Product>.Filter.Eq(a => a.id, productID),
                    Builders<Product>.Filter.Eq("variants.color", color),
                    Builders<Product>.Filter.Eq("variants.sizes.size", size)
                    );
                var updatesanpham = Builders<Product>.Update.Inc("variants.$[v].sizes.$[s].quantity", quantity);
                var arrayFilters = new List<ArrayFilterDefinition>
                {
                    new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("v.color", color)),
                    new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("s.size", size))
                };
                var updateOptions = new UpdateOptions { ArrayFilters = arrayFilters };
                await mongos.UpdateOneAsync(filterSanPham, updatesanpham,updateOptions);
                return Ok(new { message = "Đã Hủy Thành Công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }


}
