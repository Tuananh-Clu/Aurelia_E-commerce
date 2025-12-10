using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AureliaE_Commerce.Model
{
    public class ProductRef
    {
        public string id { get; set; }
    }

    public class seasonalAttributes
    {
        public List<string> colors { get; set; }
        public List<string> materials { get; set; }
        public string mood { get; set; }
        public string temperature { get; set; }
    }

    public class LuxuryCollection
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        [JsonPropertyName("id")]
        public string id { get; set; }
        public string slug { get; set; }
        public string name { get; set; }
        public string slogan { get; set; }
        public string description { get; set; }
        public string banner { get; set; }
        public seasonalAttributes seasonalAttributes { get; set; }
        public List<ProductRef> products { get; set; }
        public float rate { get; set; }
        public bool active { get; set; }
        public int views { get; set; }
    }
}
