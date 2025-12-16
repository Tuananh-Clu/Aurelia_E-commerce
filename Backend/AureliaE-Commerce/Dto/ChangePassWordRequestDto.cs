namespace AureliaE_Commerce.Model
{
    public class ChangePassWordRequestDto
    {
        public string token { get; set; }
        public string email { get; set; }
        public string newPassword { get; set; }
    }
}