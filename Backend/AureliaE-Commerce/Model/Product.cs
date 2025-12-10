using AureliaE_Commerce.Model.AttributeProduct;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace AureliaE_Commerce.Model
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        [JsonPropertyName("id")]
        public string id { get; set; }             // id: UUID
        public string name { get; set; }           // name
        public string type { get; set; }           // type (jewelry, fashion,...)
        public string subcategory { get; set; }    // subcategory (earrings,...)
        public string brand { get; set; }          // brand (Hermès,...)
        public string origin { get; set; }         // origin (Japan,...)    // sizes ["6","7","8"]
        public double price { get; set; }          // price
        public string description { get; set; }    // description
        public float rating { get; set; }            // rating (1-5)
        public int stock { get; set; }             // stock
        public DateTime createdAt { get; set; }    // createdAt
        public DateTime updatedAt { get; set; }    // updatedAt
        public string thumbnail { get; set; }      // thumbnail URL
        public List<string> images { get; set; }   // images list
        public string material { get; set; }
        public List<variant>? variants { get; set; }
        public int sold { get; set; }
        public decimal? discountValue { get; set; } = null;
        public string? discountType { get; set; }
        public string? season { get; set; }
    }
}
