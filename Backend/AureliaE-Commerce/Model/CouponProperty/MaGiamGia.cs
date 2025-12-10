using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace AureliaE_Commerce.Model.CouponProperty
{
    public class MaGiamGia
    {
        [BsonId]
        public string id { get; set; }

        public string code { get; set; }
        public DateTime ngayBatDau { get; set; }
        public DateTime ngayKetThuc { get; set; }
        public string? phamViApDung { get; set; }
        public int? giaTri { get; set; }
        public float? giaTriDeApDung { get; set; }
        public string? typeCoupon { get; set; }
        public string? dieuKienApDung { get; set; }
        public string? moTa { get; set; }
        public bool isActive { get; set; }
        public int soLuong { get; set; }
        public string reuse { get; set; }
        public string loaiGiam { get; set; }
        public string? apDungChoLoai { get; set; }
        public string? apDungChoMua { get; set; }
    }
}
