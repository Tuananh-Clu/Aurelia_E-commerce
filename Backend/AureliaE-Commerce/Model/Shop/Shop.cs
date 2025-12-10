using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AureliaE_Commerce.Model.Shop
{
    public class Shop
    {
        [BsonId]
        public ObjectId id { get; set; }
        public string shopId { get; set; }
        public string shopName { get; set; }
        public List<ProductAtShop> products { get; set; } = new List<ProductAtShop>();
        public string owner { get; set; }
        public string address { get; set; }
        public string openingHours { get; set; }
        public string phone { get; set; }
        public List<string> services { get; set; }
        public string city { get; set; }
        public List<string> slot { get; set; }
        public List<ServiceAppointment> appointmentServices { get; set; } = new List<ServiceAppointment>();
        public List<Appointment> appoiments { get; set; } = new List<Appointment>();
        public double lat { get; set; }
        public double lng { get; set; }
        public List<OrderModel> Orders { get; set; } = new List<OrderModel>();
        public List<Notifycation> Notifycation { get; set; } = new List<Notifycation>();
        public float reviews { get; set; }
        public decimal rating { get; set; }
    }
}
