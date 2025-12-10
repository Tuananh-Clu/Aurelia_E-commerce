using AureliaE_Commerce.Common;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;

namespace AureliaE_Commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ProductController : ControllerBase
    {
        private readonly IProductItemsService _productItemsService;
        private readonly IMongoCollection<Product> _mongoCollection;
        private readonly ILogger<ProductController> _logger;

        public ProductController(
            IProductItemsService productItemsService,
            MongoDbContext dbContext,
            ILogger<ProductController> logger)
        {
            _productItemsService = productItemsService;
            _mongoCollection = dbContext.SanPham;
            _logger = logger;
        }

        [HttpPost("AddItemProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddItemFromFile(IFormFile formFile)
        {
            try
            {
                if (formFile == null || formFile.Length == 0)
                {
                    return BadRequest(ApiResponse.Error("File không được để trống"));
                }

                if (!formFile.ContentType.Contains("json"))
                {
                    return BadRequest(ApiResponse.Error("File phải là định dạng JSON"));
                }

                using var reader = new StreamReader(formFile.OpenReadStream());
                var json = await reader.ReadToEndAsync();
                var products = JsonSerializer.Deserialize<List<Product>>(json);

                if (products == null || !products.Any())
                {
                    return BadRequest(ApiResponse.Error("File JSON không hợp lệ hoặc rỗng"));
                }

                await _productItemsService.AddProduct(products);
                _logger.LogInformation("Imported {Count} products from file", products.Count);

                return Ok(ApiResponse.Success($"Thêm {products.Count} sản phẩm thành công"));
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error parsing JSON file");
                return BadRequest(ApiResponse.Error("File JSON không đúng định dạng"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing products from file");
                throw; // Let middleware handle
            }
        }

        [HttpPost("PostProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddProduct([FromBody] List<Product> products)
        {
            try
            {
                if (products == null || !products.Any())
                {
                    return BadRequest(ApiResponse.Error("Danh sách sản phẩm không được để trống"));
                }

                await _mongoCollection.InsertManyAsync(products);
                _logger.LogInformation("Added {Count} products", products.Count);

                return Ok(ApiResponse.Success($"Thêm {products.Count} sản phẩm thành công"));
            }
            catch (MongoWriteException ex)
            {
                _logger.LogError(ex, "Error adding products");
                return BadRequest(ApiResponse.Error("Lỗi khi thêm sản phẩm vào database"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error adding products");
                throw;
            }
        }

        [HttpGet("GetProduct")]
        [ProducesResponseType(typeof(ApiResponse<List<Product>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var products = await _productItemsService.GetProduct();
                _logger.LogInformation("Retrieved {Count} products", products.Count);

                return Ok(ApiResponse<List<Product>>.SuccessResponse(products, "Lấy danh sách sản phẩm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                throw;
            }
        }

        [HttpGet("GetProductBySearch")]
        [ProducesResponseType(typeof(ApiResponse<List<Product>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchProducts([FromQuery] string? key)
        {
            try
            {
                var products = await _productItemsService.SearchProduct(key);
                _logger.LogInformation("Search for '{Key}' returned {Count} results", key ?? "all", products.Count);

                return Ok(ApiResponse<List<Product>>.SuccessResponse(products, "Tìm kiếm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products");
                throw;
            }
        }

     
        [HttpPut("updateQuantityProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateQuantityProduct([FromBody] List<ProductUpdateDto> products)
        {
            try
            {
                if (products == null || !products.Any())
                {
                    return BadRequest(ApiResponse.Error("Danh sách cập nhật không được để trống"));
                }

                await _productItemsService.UpdateQuantityProduct(products);
                _logger.LogInformation("Updated quantities for {Count} products", products.Count);

                return Ok(ApiResponse.Success("Cập nhật số lượng sản phẩm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product quantities");
                throw;
            }
        }

        [HttpDelete("DeleteProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteProduct([FromQuery] string productId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(productId))
                {
                    return BadRequest(ApiResponse.Error("Product ID không được để trống"));
                }

                var result = await _mongoCollection.DeleteManyAsync(a => a.id == productId);
                
                if (result.DeletedCount == 0)
                {
                    return BadRequest(ApiResponse.Error("Không tìm thấy sản phẩm để xóa"));
                }

                _logger.LogInformation("Deleted product with ID: {ProductId}", productId);

                return Ok(ApiResponse.Success("Xóa sản phẩm thành công"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product");
                throw;
            }
        }
    }
}
