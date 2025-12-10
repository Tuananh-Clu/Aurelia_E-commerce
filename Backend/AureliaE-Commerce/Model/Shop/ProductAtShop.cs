using AureliaE_Commerce.Model.AttributeProduct;

namespace AureliaE_Commerce.Model.Shop
{
    public class ProductAtShop
    {
        public string productId { get; set; }
        public string name { get; set; }
        public string brand { get; set; }
        public int sold { get; set; }
        public List<variant> variants { get; set; }
    }
}
