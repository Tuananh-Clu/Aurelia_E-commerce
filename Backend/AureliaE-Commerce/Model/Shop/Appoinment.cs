using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Appointment
{
    [BsonId]
    public string Id { get; set; }         
    public string ShopId { get; set; }
    public string ItemName { get; set; }
    public string itemImage { get; set; }
    public string ShopName { get; set; }     
    public string? CustomerId { get; set; }  
    public string CustomerName { get; set; }
    public string CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string Service { get; set; }    
    public string Date { get; set; }       
    public string Slot { get; set; }
    public int Duration { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }      
}
