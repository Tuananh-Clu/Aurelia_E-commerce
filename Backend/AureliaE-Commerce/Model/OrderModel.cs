using AureliaE_Commerce.Model.CouponProperty;

namespace AureliaE_Commerce.Model
{
    public class OrderModel
    {
        public string orderId { get; set; }
        public string status { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string payment { get; set; }
        public List<MaGiamGia>? voucherUsed { get; set; }
        public DateTime NgayTaoDon { get; set; }
        public  float lat { get; set; }
        public float ion { get; set; }
        public List<ItemOrder> product { get; set; }
        public UpdateTracking tracking { get; set; }
    }
}
