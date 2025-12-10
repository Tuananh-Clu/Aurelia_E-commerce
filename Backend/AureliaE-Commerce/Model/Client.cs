using MongoDB.Bson.Serialization.Attributes;
using System.Net.Sockets;

namespace AureliaE_Commerce.Model
{
    public class Client
    {
        [BsonId]
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string? SoDt { get; set; }
        public string? DiaChi { get; set; }
        public string PassWord { get; set; }
        public string Avatar { get; set; }
        public int Point { get; set; }
        public string Tier { get; set; }
        public DateTime NgayTaoTaiKhoan { get; set; }
        public List<ItemOrder> GioHangCuaBan { get; set; } = new List<ItemOrder>();
        public List<Product> SanPhamYeuThich { get; set; } = new List<Product>();
        public List<OrderModel> DonHangCuaBan { get; set; } = new List<OrderModel>();
        public Measure SoDoNgDUng { get; set; }
        public List<ClientAppointment> LichSuCuocHen { get; set; } = new List<ClientAppointment>();
        public List<ThongTinCaNhan> ThongTinDatHang { get; set; } = new List<ThongTinCaNhan>();
        public benefit Benefits { get; set; }
    }
}
