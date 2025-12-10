using Microsoft.AspNetCore.SignalR;

namespace AureliaE_Commerce.Hubs
{
    public class NotifyHub : Hub
    {
        public async Task JoinGroupShop(string shopId)
        {
            string groupName = $"Shop_{shopId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"✅ Client {Context.ConnectionId} joined group: {groupName}");
        }

        public async Task LeaveGroupShop(string shopId)
        {
            string groupName = $"Shop_{shopId}";
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"❌ Client {Context.ConnectionId} left group: {groupName}");
        }
        public async Task JoinGroupShopAppointment(string shopId)
        {
            string groupName = $"Shop_Appointment{shopId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"✅ Client {Context.ConnectionId} joined group: {groupName}");
        }
    }
}
