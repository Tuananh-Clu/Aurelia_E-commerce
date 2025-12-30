using AureliaE_Commerce.Context;
using AureliaE_Commerce.Controller;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

if(builder.Environment.IsDevelopment())
{
   dotenv.net.DotEnv.Load();
}
builder.Configuration["MongoDbSettings:ConnectionString"] = Environment.GetEnvironmentVariable("MONGODB_URI");
builder.Configuration["Jwt:Key"] = Environment.GetEnvironmentVariable("JWT_KEY");
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
var mongoUri = Environment.GetEnvironmentVariable("MONGODB_URI");
var dbName   = Environment.GetEnvironmentVariable("DataBaseName");
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client =sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(dbName);
});

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddCors(a =>
{
    a.AddPolicy("AllowFrontEnd", s =>
    {
                s.WithOrigins(
            "https://aureliashop.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
var firebaseJson =Environment.GetEnvironmentVariable("FIREBASE_CREDENTIALS_JSON");
firebaseJson = firebaseJson.Replace("\\n", "\n");
if (string.IsNullOrWhiteSpace(firebaseJson))
{
    throw new Exception("Missing FIREBASE_CREDENTIALS_JSON environment variable");
}

if (FirebaseApp.DefaultInstance == null)
{
    if (string.IsNullOrWhiteSpace(firebaseJson))
    {
        throw new Exception("Missing FIREBASE_CREDENTIALS_JSON environment variable");
    }

    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential
            .FromJson(firebaseJson)
            .CreateScoped("https://www.googleapis.com/auth/cloud-platform")
    });
}
builder.Services.AddSingleton<IMongoClient>(_ =>
{
   return new MongoClient(mongoUri);
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
        options.Events=new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if(context.Request.Query.TryGetValue("access_token",out var token))
                {
                    context.Token = token;
                }
                return System.Threading.Tasks.Task.CompletedTask;
            }
        };

    });
builder.Services.AddSignalR();
var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieTicket API v1");
        c.RoutePrefix = string.Empty; 
    });

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");


app.UseRouting();

app.UseCors("AllowFrontEnd");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<NotifyHub>("/notifyHub");
app.MapControllers();

app.Run();