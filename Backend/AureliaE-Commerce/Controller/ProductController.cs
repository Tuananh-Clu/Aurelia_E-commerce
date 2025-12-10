using AureliaE_Commerce.Context;
using AureliaE_Commerce.Dto;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;

namespace AureliaE_Commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase 
    {
        private readonly ProductItemsService productItemsService;
        private readonly IMongoCollection<Product> mongoCollection;

        public ProductController(ProductItemsService itemsService,MongoDbContext dbContext)
        {
            productItemsService = itemsService;
            mongoCollection = dbContext.SanPham;
        }

        [HttpPost("AddItemProduct")]
        public async Task<IActionResult> AddItem(IFormFile formFile)
        {
            using var reader = new StreamReader(formFile.OpenReadStream());
            var json = await reader.ReadToEndAsync();
            var result = JsonSerializer.Deserialize<List<Product>>(json);

            if (result == null || !result.Any())
                return BadRequest("File JSON không hợp lệ hoặc rỗng");

            await productItemsService.AddProduct(result);
            return Ok("Thêm sản phẩm thành công ✅");
        }
        [HttpPost("PostProduct")]
        public async Task<IActionResult> AddProduct([FromBody]List<Product> products)
        {
            await mongoCollection.InsertManyAsync(products);
            return Ok("Thêm Thành Công!");
        }
        [HttpGet("GetProduct")]
        public async Task<IActionResult> GetProductItem()
        {
            var data = await productItemsService.getProduct();
            return Ok(data); 
        }
        [HttpGet("GetProductBySearch")]
        public async Task<IActionResult> getProductbySearch([FromQuery] string? key)
        {
           var data= await productItemsService.SearchProduct(key);
            return Ok(data);
        }
        [HttpPost("updateQuantityProduct")]
        public async Task<IActionResult> UpdateQuantityProduct([FromBody]List<ProductUpdateDto> products)
        {
            await productItemsService.UpdateQuantityProduct(products);
            return Ok("Cap Nhat Thanh Cong");

        }
        [HttpDelete("DeleteProuct")]
        public async Task<IActionResult> DeleteProduct([FromQuery] string productId)
        {
            await mongoCollection.DeleteManyAsync(a => a.id == productId);
            return Ok("Xóa Thành Công!");
        }
    }
}
