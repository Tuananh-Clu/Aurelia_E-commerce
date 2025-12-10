namespace AureliaE_Commerce.Model
{
    public class Coupon
    {
        public string id { get; set; }
        public string Code { get; set; }
        public string LoaiGiam { get; set; }
        public float Value { get; set; }
        public string Decribe { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
    }
}
