using AureliaE_Commerce.Context;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MovieTicket API",
        Version = "v1"
    });
});
builder.Services.AddSingleton<ProductItemsService>();
builder.Services.AddSingleton<ShopService>();
builder.Services.AddControllers();
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var settings = builder.Configuration
        .GetSection("MongoDbSettings")
        .Get<MongoDbSettings>();

    var client = new MongoClient(settings.ConnectionString);
    return client.GetDatabase(settings.DatabaseName);
});

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddCors(a =>
{
    a.AddPolicy("AllowFrontEnd", s =>
    {
        s.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
    return new MongoClient(settings.ConnectionString);
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieTicket API v1");
        c.RoutePrefix = string.Empty; // truy cập trực tiếp bằng http://localhost:5173/ 
    });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontEnd");
app.MapHub<NotifyHub>("/notifyHub");
app.UseAuthentication(); // ✅ cần thêm
app.UseAuthorization();

app.MapControllers();

app.Run();
