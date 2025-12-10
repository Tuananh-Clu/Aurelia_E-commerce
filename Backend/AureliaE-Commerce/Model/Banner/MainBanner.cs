using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AureliaE_Commerce.Model.Banner
{
    public class MainBanner
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string LinkUrl { get; set; }
        public string MainTitle { get; set; }
        public string? H1 { get; set; }
        public string? Pagaraph { get; set; }
        public string TextInButton { get; set; }
        public bool Active { get; set; }
        public string Layout { get; set; }
        public string ColorMainTitle { get; set; }
        public string ColorText { get; set; }
    }
}
