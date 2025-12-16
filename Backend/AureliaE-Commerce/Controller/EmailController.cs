using System.Security.Cryptography;
using AureliaE_Commerce.Context;
using AureliaE_Commerce.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AureliaE_Commerce.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        public readonly IMongoCollection<ResetPassWordHass> resetPassWordHass;
        public readonly IMongoCollection<Client> client;
        public EmailController(MongoDbContext dbContext)
        {
            resetPassWordHass = dbContext.ResetPassWordHass;
            client = dbContext.Client;
        }
        [NonAction]
        public string GenerateRandomToken()
        {
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            token = token.Replace("=", "").Replace("+", "").Replace("/", "");
            return token;
        }
        [NonAction]
        public string GenerateHass(string input)
        {
            using var sha = SHA256.Create();
            return Convert.ToBase64String(sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input)));
        }
        [HttpPost("ResetPassWord")]
        public async Task<IActionResult> ResetPassWord([FromBody] string email)
        {
            var filter = Builders<Client>.Filter.Eq(a => a.Email, email);
            var user = await client.Find(filter).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Email không tồn tại" });
            }
            var token = GenerateRandomToken();
            var tokenHash = GenerateHass(token);
            var resetPassWordHassEntry = new ResetPassWordHass
            {
                idUser = user.Id,
                email = email,
                tokenHash = tokenHash,
                tokenExpiration = DateTime.UtcNow.AddHours(1),
            };
            await resetPassWordHass.InsertOneAsync(resetPassWordHassEntry);
            var resetLink = $"https://localhost:5173/reset-password?token={token}&email={email}";
            var message = new MimeKit.MimeMessage();
            message.From.Add(new MimeKit.MailboxAddress("Aurelia E-Commerce", "no-reply@aureliaecommerce.com"));
            message.To.Add(new MimeKit.MailboxAddress("", email));
            message.Subject = "Đặt lại mật khẩu";
            message.Body = new MimeKit.TextPart("html")
            {
                Text = $"<p>Để đặt lại mật khẩu, vui lòng nhấp vào liên kết sau:</p><p><a href='{resetLink}'>Đặt lại mật khẩu</a></p><p>Liên kết này sẽ hết hạn trong 1 giờ.</p>"
            };
            using var smtpClient = new MailKit.Net.Smtp.SmtpClient();
            await smtpClient.ConnectAsync(
                 "smtp.gmail.com",
                 587,
                  MailKit.Security.SecureSocketOptions.StartTls
                  );


            await smtpClient.AuthenticateAsync("no-reply@aureliaecommerce.com", "");
            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
            return Ok(new { message = "Đã gửi email đặt lại mật khẩu" });
        }
        [HttpPost("ChangePassWord")]
        public async Task<IActionResult> ChangePassWord([FromBody] ChangePassWordRequestDto request)
        {
            var filter = Builders<ResetPassWordHass>.Filter.Eq(a => a.email, request.email);
            var resetEntry = await resetPassWordHass.Find(filter).FirstOrDefaultAsync();
            if (resetEntry == null || resetEntry.tokenExpiration < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
            }
            var tokenHash = GenerateHass(request.token);
            if (tokenHash != resetEntry.tokenHash)
            {
                return BadRequest(new { message = "Liên kết đặt lại mật khẩu không hợp lệ." });
            }
            var userFilter = Builders<Client>.Filter.Eq(a => a.Id, resetEntry.idUser);
            var update = Builders<Client>.Update.Set(a => a.PassWord, request.newPassword);
            await client.UpdateOneAsync(userFilter, update);
            await resetPassWordHass.DeleteOneAsync(filter);
            return Ok(new { message = "Mật khẩu đã được thay đổi thành công." });
        }
    }
}