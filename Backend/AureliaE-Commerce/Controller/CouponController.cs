using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly IMongoCollection<MaGiamGia> voucher;
        private readonly IMongoCollection<Client> Customer;
        private readonly IMongoCollection<Product> product;
        public CouponController(MongoDbContext dbContext)
        {
            voucher = dbContext.MaGiamGiaVoucher;
            Customer = dbContext.Client;
            product = dbContext.SanPham;
        }
        [HttpGet("LaytatCaVoucher")]
        public async Task<IActionResult> GetVoucher()
        {
            var data = await voucher.Find(_ => true).ToListAsync();
            return Ok(data);
        }
        [HttpPost("AddVoucher")]
        public async Task<IActionResult> AddVoucher([FromBody] MaGiamGia maGiamGia)
        {
            await voucher.InsertOneAsync(maGiamGia);
            return Ok(new { message = "Thêm Thành Công" });

        }
        [HttpPost("AddListVoucher")]
        public async Task<IActionResult> AddListVoucher([FromBody] List<MaGiamGia> maGiamGia)
        {
            await voucher.InsertManyAsync(maGiamGia);
            return Ok(new { message = "Thêm Thành Công" });
        }
        [HttpPost("AdjustVoucher")]
        public async Task<IActionResult> AdjustVoucher([FromBody] MaGiamGia maGiamGia)
        {
            var filter = Builders<MaGiamGia>.Filter.Eq(a => a.id, maGiamGia.id);
            var update = Builders<MaGiamGia>.Update
                .Set(s => s.giaTri, maGiamGia.giaTri)
                .Set(s => s.ngayBatDau, maGiamGia.ngayBatDau)
                .Set(s => s.ngayKetThuc, maGiamGia.ngayKetThuc)
                .Set(s => s.soLuong, maGiamGia.soLuong)
                .Set(s => s.phamViApDung, maGiamGia.phamViApDung)
                .Set(s => s.giaTriDeApDung, maGiamGia.giaTriDeApDung)
                .Set(s => s.typeCoupon, maGiamGia.typeCoupon)
                .Set(s => s.isActive, maGiamGia.isActive)
                .Set(s => s.reuse, maGiamGia.reuse)
                .Set(s => s.code, maGiamGia.code)
                .Set(s => s.typeCoupon, maGiamGia.typeCoupon);
            var result = await voucher.UpdateOneAsync(filter, update);
            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "Cập nhật thành công" });
            }
            return NotFound(new { message = "Không tìm thấy voucher" });
        }
        [HttpDelete("DeleteVoucher")]
        public async Task<IActionResult> DeleteVoucher([FromQuery] string voucherId)
        {
            var filter = Builders<MaGiamGia>.Filter.Eq(a => a.id, voucherId);
            await voucher.DeleteOneAsync(filter);
            return Ok(new { message = "Xóa Thành Công" });
        }
         [HttpPost("UpdateStatusVoucher")]
        public async Task<IActionResult> UpdateStatusVoucher([FromBody] CouponDto dto)
        { 
            var filter = Builders<MaGiamGia>.Filter.Eq(a => a.id,dto.id);
            var update = Builders<MaGiamGia>.Update.Set(a => a.isActive, dto.Active);
            var result = await voucher.UpdateOneAsync(filter, update);
            if (result.ModifiedCount > 0)
            {
                return Ok(new { message = "Cập nhật thành công" });
            }
            return NotFound(new { message = "Không tìm thấy voucher" });
        }
        [HttpPost("SuggestVoucher")]
        public async Task<IActionResult> SuggestVoucher([FromBody] OrderModel orderModel, [FromQuery] string id)
        {
            var allVouchers = await voucher.Find(_ => true).ToListAsync();

            var customer = await Customer.Find(Builders<Client>.Filter.Eq(a => a.Id, id)).FirstOrDefaultAsync();
            if (customer == null)
                return NotFound("Không tìm thấy khách hàng.");

            var itemIds = orderModel.product.Select(p => p.Itemid).ToList();
            var dataProduct = await product.Find(Builders<Product>.Filter.In(p => p.id, itemIds)).ToListAsync();

            var productTypes = dataProduct.Select(p => p.type).Where(t => !string.IsNullOrEmpty(t)).Distinct().ToList();
            var productSeasons = dataProduct.Select(p => p.season).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList();

            var totalOrderValue = orderModel.product.Sum(p => p.price * p.quantity);
            var now = DateTime.Now;

            var activeVouchers = allVouchers.Where(v =>
                v.isActive &&
                v.ngayBatDau <= now &&
                v.ngayKetThuc >= now &&
                totalOrderValue >= (v.giaTriDeApDung ?? 0)
            ).ToList();

            var filteredVouchers = activeVouchers.Where(v =>
                v.reuse == "true" ||
                (customer.DonHangCuaBan == null || !customer.DonHangCuaBan.Any(d => d.voucherUsed?.Any(u => u.code == v.code) ?? false))
            ).ToList();

            var firstOrderVouchers = filteredVouchers.Where(v =>
                v.phamViApDung == "First" &&
                (customer.DonHangCuaBan == null || !customer.DonHangCuaBan.Any())
            ).ToList();

  
           var loyalVouchers = filteredVouchers.Where(v =>
                v.phamViApDung == "Loyal" && customer.Point > 10
            ).ToList();


            var matchedVouchers = filteredVouchers.Where(v =>
                (v.phamViApDung == "Category" && v.apDungChoLoai != null && productTypes.Contains(v.apDungChoLoai)) ||
                (v.phamViApDung == "Season" && v.apDungChoMua != null && productSeasons.Contains(v.apDungChoMua))
            ).ToList();

            var allVouchersApply = filteredVouchers.Where(v => v.phamViApDung == "All").ToList();

            var result = firstOrderVouchers
                .Union(loyalVouchers)
                .Union(matchedVouchers)
                .Union(allVouchersApply)
                .Distinct()
                .ToList();

            return Ok(result);
        }
    }
}
