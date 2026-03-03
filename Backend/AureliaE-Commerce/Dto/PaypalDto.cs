
using AureliaE_Commerce.Model;

namespace AureliaE_Commerce.Dto
{
    public class PaypalDto
{
    public string orderId { get; set; }
    public OrderModel order { get; set; }
}
}
