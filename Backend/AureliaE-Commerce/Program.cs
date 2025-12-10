using AureliaE_Commerce.Context;
using AureliaE_Commerce.Hubs;
using AureliaE_Commerce.Middleware;
using AureliaE_Commerce.Model;
using AureliaE_Commerce.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// Environment Configuration
// ============================================
dotenv.net.DotEnv.Load();
builder.Configuration["MongoDbSettings:ConnectionString"] = Environment.GetEnvironmentVariable("MONGODB_URI") 
    ?? throw new InvalidOperationException("MONGODB_URI environment variable is not set");
builder.Configuration["Jwt:Key"] = Environment.GetEnvironmentVariable("JWT_KEY") 
    ?? throw new InvalidOperationException("JWT_KEY environment variable is not set");

// ============================================
// Services Configuration
// ============================================


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Aurelia E-Commerce API",
        Version = "v1",
        Description = "RESTful API for Aurelia E-Commerce Platform",
        Contact = new OpenApiContact
        {
            Name = "Aurelia Development Team",
            Email = "support@aurelia.com"
        }
    });


    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

var mongoDbSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>()
    ?? throw new InvalidOperationException("MongoDbSettings configuration is missing");


builder.Services.AddSingleton<IMongoClient>(sp =>
{
    if (string.IsNullOrEmpty(mongoDbSettings.ConnectionString))
    {
        throw new InvalidOperationException("MongoDB connection string is not configured");
    }
    return new MongoClient(mongoDbSettings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDbSettings.DatabaseName);
});

// MongoDB Context
builder.Services.AddSingleton<MongoDbContext>();

// Application Services
builder.Services.AddSingleton<IProductItemsService, ProductItemsService>();
builder.Services.AddSingleton<ShopService>();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://localhost:5173",
                "https://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("JWT Key is not configured");

if (jwtKey.Length < 32)
{
    throw new InvalidOperationException("JWT Key must be at least 32 characters long");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero // Remove default 5 minute clock skew
        };
    });

// SignalR
builder.Services.AddSignalR();


var app = builder.Build();




app.UseExceptionHandling();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowFrontEnd");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aurelia E-Commerce API v1");
        c.RoutePrefix = string.Empty;
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.EnableFilter();
    });
}

// SignalR Hub
app.MapHub<NotifyHub>("/notifyHub");

// Controllers
app.MapControllers();


app.Logger.LogInformation("Aurelia E-Commerce API is starting...");
app.Logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
app.Logger.LogInformation("MongoDB Database: {DatabaseName}", mongoDbSettings.DatabaseName);

app.Run();
