namespace AureliaE_Commerce.Model
{
    public class ResetPassWordHass
    {
        public string id { get; set; }
        public string idUser { get; set; }
        public string email { get; set; }
        public string tokenHash { get; set; }
        public DateTime tokenExpiration { get; set; }
    }
}