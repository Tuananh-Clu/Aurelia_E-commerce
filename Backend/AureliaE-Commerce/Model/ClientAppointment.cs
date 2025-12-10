namespace AureliaE_Commerce.Model
{
    public class ClientAppointment
    {
        public string Id { get; set; }
        public string ShopName { get; set; }
        public string Address { get; set; }
        public string ItemName { get; set; }
        public string itemImage { get; set; }
        public string Service { get; set; }
        public string Date { get; set; }
        public int Duration { get; set; }
        public string Slot { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; } 
        public string? Notes { get; set; }
    }
}
