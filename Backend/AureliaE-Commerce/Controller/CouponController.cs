using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.CouponProperty;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CouponController : ControllerBase
    {
        private readonly IMongoCollection<MaGiamGia> _voucherCollection;
        private readonly IMongoCollection<Client> _customerCollection;
        private readonly IMongoCollection<Product> _productCollection;
        private readonly ILogger<CouponController> _logger;

        public CouponController(MongoDbContext dbContext, ILogger<CouponController> logger)
        {
            _voucherCollection = dbContext.MaGiamGiaVoucher;
            _customerCollection = dbContext.Client;
            _productCollection = dbContext.SanPham;
            _logger = logger;
        }

        [HttpGet("LaytatCaVoucher")]
        [ProducesResponseType(typeof(ApiResponse<List<MaGiamGia>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetVouchers()
        {
            try
            {
                var vouchers = await _voucherCollection.Find(_ => true).ToListAsync();
                _logger.LogDebug("Retrieved {Count} vouchers", vouchers.Count);
                return Ok(ApiResponse<List<MaGiamGia>>.SuccessResponse(vouchers, "Lấy danh sách voucher thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vouchers");
                throw;
            }
        }

        [HttpPost("AddVoucher")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddVoucher([FromBody] MaGiamGia maGiamGia)
        {
            try
            {
                if (maGiamGia == null)
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu voucher không được để trống"));
                }

                await _voucherCollection.InsertOneAsync(maGiamGia);
                _logger.LogInformation("Voucher added: {VoucherId}, Code: {Code}", maGiamGia.id, maGiamGia.code);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.CREATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding voucher");
                throw;
            }
        }

        [HttpPost("AddListVoucher")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddListVoucher([FromBody] List<MaGiamGia> maGiamGia)
        {
            try
            {
                if (maGiamGia == null || !maGiamGia.Any())
                {
                    return BadRequest(ApiResponse.Error("Danh sách voucher không được để trống"));
                }

                await _voucherCollection.InsertManyAsync(maGiamGia);
                _logger.LogInformation("Added {Count} vouchers", maGiamGia.Count);
                return Ok(ApiResponse.Success($"Thêm {maGiamGia.Count} voucher thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding list of vouchers");
                throw;
            }
        }

        [HttpPut("AdjustVoucher")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateVoucher([FromBody] MaGiamGia maGiamGia)
        {
            try
            {
                if (maGiamGia == null || string.IsNullOrWhiteSpace(maGiamGia.id))
                {
                    return BadRequest(ApiResponse.Error("Voucher ID không được để trống"));
                }

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
                    .Set(s => s.code, maGiamGia.code);

                var result = await _voucherCollection.UpdateOneAsync(filter, update);
                
                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Voucher updated: {VoucherId}", maGiamGia.id);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating voucher");
                throw;
            }
        }

        [HttpDelete("DeleteVoucher")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteVoucher([FromQuery] string voucherId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(voucherId))
                {
                    return BadRequest(ApiResponse.Error("Voucher ID không được để trống"));
                }

                var filter = Builders<MaGiamGia>.Filter.Eq(a => a.id, voucherId);
                var result = await _voucherCollection.DeleteOneAsync(filter);
                
                if (result.DeletedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Voucher deleted: {VoucherId}", voucherId);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.DELETED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting voucher");
                throw;
            }
        }

        [HttpPut("UpdateStatusVoucher")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateStatusVoucher([FromBody] CouponDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.id))
                {
                    return BadRequest(ApiResponse.Error("Voucher ID không được để trống"));
                }

                var filter = Builders<MaGiamGia>.Filter.Eq(a => a.id, dto.id);
                var update = Builders<MaGiamGia>.Update.Set(a => a.isActive, dto.Active);
                var result = await _voucherCollection.UpdateOneAsync(filter, update);
                
                if (result.MatchedCount == 0)
                {
                    return NotFound(ApiResponse.Error(Constants.ErrorMessages.NOT_FOUND));
                }

                _logger.LogInformation("Voucher status updated: {VoucherId}, Active: {Active}", dto.id, dto.Active);
                return Ok(ApiResponse.Success(Constants.SuccessMessages.UPDATED));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating voucher status");
                throw;
            }
        }

        [HttpPost("SuggestVoucher")]
        [ProducesResponseType(typeof(ApiResponse<List<MaGiamGia>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SuggestVoucher([FromBody] OrderModel orderModel, [FromQuery] string id)
        {
            try
            {
                if (orderModel == null || orderModel.product == null || !orderModel.product.Any())
                {
                    return BadRequest(ApiResponse.Error("Dữ liệu đơn hàng không hợp lệ"));
                }

                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(ApiResponse.Error("Customer ID không được để trống"));
                }

                var allVouchers = await _voucherCollection.Find(_ => true).ToListAsync();
                var customer = await _customerCollection.Find(Builders<Client>.Filter.Eq(a => a.Id, id)).FirstOrDefaultAsync();
                
                if (customer == null)
                {
                    return NotFound(ApiResponse.Error("Không tìm thấy khách hàng"));
                }

                var itemIds = orderModel.product.Select(p => p.Itemid).ToList();
                var products = await _productCollection.Find(Builders<Product>.Filter.In(p => p.id, itemIds)).ToListAsync();

                var productTypes = products.Select(p => p.type).Where(t => !string.IsNullOrEmpty(t)).Distinct().ToList();
                var productSeasons = products.Select(p => p.season).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList();

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

               
                var suggestedVouchers = firstOrderVouchers
                    .Union(loyalVouchers)
                    .Union(matchedVouchers)
                    .Union(allVouchersApply)
                    .Distinct()
                    .ToList();

                _logger.LogDebug("Suggested {Count} vouchers for customer {CustomerId}", suggestedVouchers.Count, id);
                return Ok(ApiResponse<List<MaGiamGia>>.SuccessResponse(suggestedVouchers, "Gợi ý voucher thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error suggesting vouchers");
                throw;
            }
        }
    }
}
