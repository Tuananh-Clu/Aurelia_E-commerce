using MongoDB.Bson.Serialization.Attributes;

namespace AureliaE_Commerce.Model.Shop
{
    public class Notifycation
    {
        [BsonId]
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string shopId { get; set; }
        public string  type { get; set; }
        public string message { get; set; }
        public bool isChecked { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
