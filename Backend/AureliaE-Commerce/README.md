# 🔧 Aurelia E-Commerce Backend API

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![C#](https://img.shields.io/badge/C%23-13-239120?logo=c-sharp)](https://docs.microsoft.com/dotnet/csharp/)

Backend API cho nền tảng thương mại điện tử Aurelia, được xây dựng với ASP.NET Core 9.0 và MongoDB.

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Deployment](#-deployment)

## 🎯 Tổng quan

Backend API cung cấp RESTful API và SignalR Hub cho:
- **Authentication & Authorization**: JWT-based authentication cho User, Shop, và Admin
- **Product Management**: CRUD operations cho sản phẩm
- **Order Management**: Quản lý đơn hàng và tracking
- **User Management**: Quản lý người dùng, profile, địa chỉ
- **Shop Management**: Quản lý cửa hàng, sản phẩm, đơn hàng
- **Admin Management**: Quản lý toàn hệ thống, banner, coupon, collection
- **Real-time Notifications**: SignalR Hub cho thông báo real-time
- **AI Integration**: API cho gợi ý size dựa trên số đo

## ✨ Tính năng

- ✅ RESTful API với ASP.NET Core
- ✅ JWT Authentication & Authorization
- ✅ MongoDB Database với Repository Pattern
- ✅ SignalR Real-time Communication
- ✅ Swagger/OpenAPI Documentation
- ✅ Error Handling & Logging
- ✅ CORS Configuration
- ✅ Password Hashing với BCrypt
- ✅ Input Validation
- ✅ Dependency Injection

## 🛠️ Công nghệ

- **Framework**: ASP.NET Core 9.0
- **Language**: C# 13
- **Database**: MongoDB 7.0
- **ORM**: MongoDB Driver 3.4.3
- **Authentication**: JWT Bearer 9.0.8
- **Real-time**: SignalR 1.2.0
- **API Docs**: Swashbuckle (Swagger) 9.0.4
- **Password Hashing**: BCrypt.Net-Next 4.0.3
- **Environment**: dotenv.net 4.0.0

## 📁 Cấu trúc dự án

```
AureliaE-Commerce/
├── Controller/              # API Controllers
│   ├── Authentication.cs    # Authentication endpoints
│   ├── ProductController.cs # Product management
│   ├── ClientController.cs  # User/Client endpoints
│   ├── ShopController.cs    # Shop management
│   ├── AdminCotroller.cs    # Admin endpoints
│   ├── BannerController.cs  # Banner management
│   ├── CouponController.cs  # Coupon/Voucher management
│   ├── SeasonCollectionController.cs # Collection management
│   └── GetAIAdvice.cs       # AI size recommendation
│
├── Services/                # Business Logic Layer
│   ├── ProductItemsService.cs
│   └── ShopService.cs
│
├── Model/                   # Data Models
│   ├── Client.cs
│   ├── Product.cs
│   ├── OrderModel.cs
│   ├── Shop/
│   │   ├── Shop.cs
│   │   ├── ShopAccount.cs
│   │   └── ...
│   └── ...
│
├── Dto/                     # Data Transfer Objects
│   ├── LoginDto.cs
│   ├── SignUpDto.cs
│   ├── ProductUpdateDto.cs
│   └── ...
│
├── Context/                 # Database Context
│   └── MongoDbContext.cs
│
├── Hubs/                    # SignalR Hubs
│   └── NotifyHub.cs
│
├── Middleware/              # Custom Middleware
│   └── ExceptionHandlingMiddleware.cs
│
├── Common/                  # Shared Utilities
│   ├── ApiResponse.cs      # Standard API Response
│   └── Constants.cs        # Constants
│
├── Program.cs               # Application Entry Point
├── appsettings.json        # Configuration
└── .env                     # Environment Variables
```

## 💻 Cài đặt

### Yêu cầu

- .NET 9.0 SDK
- MongoDB 7.0+ (hoặc MongoDB Atlas account)
- Visual Studio 2022 / VS Code / JetBrains Rider

### Bước 1: Clone và di chuyển vào thư mục

```bash
cd Backend/AureliaE-Commerce
```

### Bước 2: Cài đặt dependencies

```bash
dotnet restore
```

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `Backend/AureliaE-Commerce/`:

```env
MONGODB_URI=mongodb://localhost:27017
# hoặc MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

JWT_KEY=your-super-secret-jwt-key-minimum-32-characters-long
```

**Lưu ý**: 
- `MONGODB_URI`: Connection string đến MongoDB database
- `JWT_KEY`: Secret key cho JWT (tối thiểu 32 ký tự)

### Bước 4: Cấu hình Database Name

Mở `appsettings.json` và cập nhật `DataBaseName`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "",
    "DataBaseName": "Aurelia"
  }
}
```

### Bước 5: Chạy ứng dụng

```bash
dotnet run
```

Ứng dụng sẽ chạy tại:
- **API**: http://localhost:5075
- **Swagger UI**: http://localhost:5075

## ⚙️ Cấu hình

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "MongoDbSettings": {
    "ConnectionString": "",
    "DataBaseName": "Aurelia"
  },
  "Jwt": {
    "Key": ""
  }
}
```

**Lưu ý**: `ConnectionString` và `Key` sẽ được override từ environment variables (`.env` file).

### CORS Configuration

CORS được cấu hình trong `Program.cs` để cho phép frontend origins:

```csharp
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
```

Để thêm origins mới, cập nhật trong `Program.cs`.

## 📡 API Endpoints

### Base URL

```
http://localhost:5075
```

### Authentication

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/Authentication/LogIn` | Đăng nhập User | ❌ |
| POST | `/api/Authentication/Register` | Đăng ký User | ❌ |
| POST | `/api/Authentication/LogInShop` | Đăng nhập Shop | ❌ |
| POST | `/api/Authentication/ShopRegister` | Đăng ký Shop | ❌ |
| POST | `/api/Authentication/LogInAdminSite` | Đăng nhập Admin | ❌ |
| POST | `/api/Authentication/CreateAdminAccount` | Tạo tài khoản Admin | ❌ |

### Products

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Product/GetProduct` | Lấy danh sách sản phẩm | ❌ |
| GET | `/api/Product/GetProductBySearch?key={key}` | Tìm kiếm sản phẩm | ❌ |
| POST | `/api/Product/PostProduct` | Thêm sản phẩm | ✅ |
| POST | `/api/Product/AddItemProduct` | Import sản phẩm từ JSON file | ✅ |
| PUT | `/api/Product/updateQuantityProduct` | Cập nhật số lượng sản phẩm | ✅ |
| DELETE | `/api/Product/DeleteProuct?productId={id}` | Xóa sản phẩm | ✅ |

### Client/User

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Client/LayThongTinNguoiDung` | Lấy thông tin user | ✅ |
| POST | `/api/Client/AddItems` | Thêm sản phẩm yêu thích | ✅ |
| GET | `/api/Client/GetItemFavourite` | Lấy sản phẩm yêu thích | ✅ |
| POST | `/api/Client/AddDonHang` | Tạo đơn hàng | ✅ |
| GET | `/api/Client/GetSoLuongDonHang` | Lấy số lượng đơn hàng | ✅ |
| GET | `/api/Client/LayDonHang` | Lấy danh sách đơn hàng | ✅ |
| GET | `/api/Client/LayDonHangGanDay` | Lấy đơn hàng gần đây | ✅ |
| POST | `/api/Client/UpMeasure` | Lưu số đo cơ thể | ✅ |
| GET | `/api/Client/GetSoDo` | Lấy số đo đã lưu | ✅ |
| POST | `/api/Client/AddCuocHenUser` | Đặt lịch hẹn | ✅ |
| GET | `/api/Client/LayCuocHenUser` | Lấy lịch hẹn | ✅ |
| POST | `/api/Client/LuuDiaChi` | Lưu địa chỉ | ✅ |
| GET | `/api/Client/LayDiaChi` | Lấy địa chỉ | ✅ |
| DELETE | `/api/Client/XoaDiaChi` | Xóa địa chỉ | ✅ |
| PUT | `/api/Client/UpdateProfile` | Cập nhật profile | ✅ |
| PUT | `/api/Client/UpdateTier` | Cập nhật tier | ✅ |
| PUT | `/api/Client/HuyDonHang` | Hủy đơn hàng | ✅ |
| POST | `/api/Client/AutoAddGioHangKhiLog` | Tự động thêm giỏ hàng khi đăng nhập | ✅ |
| DELETE | `/api/Client/XoaGioHang` | Xóa giỏ hàng | ✅ |

### Shop

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Shop/GetShopDataAcoountByID` | Lấy dữ liệu shop | ✅ |
| GET | `/api/Shop/GetShop` | Lấy danh sách shop | ❌ |
| GET | `/api/Shop/GetSHopById?id={id}` | Lấy shop theo ID | ❌ |
| POST | `/api/Shop/AddAppointment` | Thêm lịch hẹn | ✅ |
| GET | `/api/Shop/LayTatCaSlotTheoNgay` | Lấy slot theo ngày | ✅ |
| GET | `/api/Shop/SapXepDonChoCuaHang` | Sắp xếp đơn hàng | ✅ |
| GET | `/api/Shop/LayDonHangTheoId?id={id}` | Lấy đơn hàng theo ID | ✅ |
| GET | `/api/Shop/DataForDashBoard` | Dữ liệu dashboard | ✅ |
| GET | `/api/Shop/LayDanhSachLichHenVaDonHang` | Lấy lịch hẹn và đơn hàng | ✅ |
| PUT | `/api/Shop/UpdateTrangThai` | Cập nhật trạng thái đơn hàng | ✅ |
| GET | `/api/Shop/LaySanPham` | Lấy sản phẩm của shop | ✅ |
| POST | `/api/Shop/UploadSanPham` | Upload sản phẩm | ✅ |
| PUT | `/api/Shop/SuaSanPham` | Sửa sản phẩm | ✅ |
| POST | `/api/Shop/PostMessage` | Gửi thông báo | ✅ |
| GET | `/api/Shop/GetNoti` | Lấy thông báo | ✅ |
| PUT | `/api/Shop/CheckNotifycation` | Đánh dấu đã đọc thông báo | ✅ |
| GET | `/api/Shop/GetAllCustomer` | Lấy tất cả khách hàng | ✅ |

### Admin

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Admin/Revenue` | Doanh thu | ✅ Admin |
| GET | `/api/Admin/GetKhachHangAndDiscount` | Khách hàng và discount | ✅ Admin |
| GET | `/api/Admin/GetDoanhThuCuaHang` | Doanh thu cửa hàng | ✅ Admin |
| PUT | `/api/Admin/ResetSold` | Reset số lượng bán | ✅ Admin |
| GET | `/api/Admin/LaySanPhamBanChay` | Sản phẩm bán chạy | ✅ Admin |
| GET | `/api/Admin/DoanhThuCaNam` | Doanh thu cả năm | ✅ Admin |
| GET | `/api/Admin/InformationShop` | Thông tin shop | ✅ Admin |

### Banner

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Banner/GetBanner` | Lấy banner | ❌ |
| POST | `/api/Banner/AddMainBanner` | Thêm banner chính | ✅ Admin |
| POST | `/api/Banner/AddStoryBanner` | Thêm story banner | ✅ Admin |
| PUT | `/api/Banner/AdjustMainBanner` | Chỉnh sửa banner chính | ✅ Admin |
| PUT | `/api/Banner/AdjustStoryBanner` | Chỉnh sửa story banner | ✅ Admin |

### Coupon

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/Coupon/LaytatCaVoucher` | Lấy tất cả voucher | ❌ |
| POST | `/api/Coupon/AddVoucher` | Thêm voucher | ✅ Admin |
| PUT | `/api/Coupon/AdjustVoucher` | Chỉnh sửa voucher | ✅ Admin |
| DELETE | `/api/Coupon/DeleteVoucher` | Xóa voucher | ✅ Admin |
| PUT | `/api/Coupon/UpdateStatusVoucher` | Cập nhật trạng thái | ✅ Admin |
| POST | `/api/Coupon/SuggestVoucher` | Gợi ý voucher | ❌ |

### Collection

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/SeasonCollection/GetCollection` | Lấy tất cả collection | ❌ |
| GET | `/api/SeasonCollection/GetProductWithId?id={id}` | Lấy sản phẩm theo collection ID | ❌ |
| GET | `/api/SeasonCollection/GetStatCollection` | Thống kê collection | ✅ Admin |
| POST | `/api/SeasonCollection/AddCollection` | Thêm collection | ✅ Admin |
| PUT | `/api/SeasonCollection/UpdateCollection` | Cập nhật collection | ✅ Admin |
| DELETE | `/api/SeasonCollection/DeleteCollection` | Xóa collection | ✅ Admin |

### AI Advice

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/GetAIAdvice/GetAdviceSize` | Gợi ý size dựa trên số đo | ❌ |

## 🔐 Authentication

### JWT Token

API sử dụng JWT Bearer tokens cho authentication. Token có thời hạn 7 ngày.

### Cách sử dụng

1. **Đăng nhập để lấy token:**
   ```http
   POST /api/Authentication/LogIn
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Sử dụng token trong requests:**
   ```http
   GET /api/Client/LayThongTinNguoiDung
   Authorization: Bearer {your-jwt-token}
   ```

### Token Claims

- `sub`: User ID
- `email`: User email
- `name`: User name (hoặc shopId cho Shop)

## 🗄️ Database Schema

### Collections chính

- **KhachHang**: Thông tin người dùng
- **SanPham**: Sản phẩm
- **Shop**: Thông tin cửa hàng
- **ShopAccount**: Tài khoản cửa hàng
- **AdminAccount**: Tài khoản admin
- **MaGiamGia**: Coupon/Voucher
- **BannerHomePage**: Main Banner
- **StoryBanner**: Story Banner
- **Voucher**: Voucher details
- **SeasonCollection**: Collections theo mùa

## 🧪 Development

### Chạy ở Development mode

```bash
dotnet run --environment Development
```

### Build

```bash
dotnet build
```

### Publish

```bash
dotnet publish -c Release -o ./publish
```

### Testing

```bash
dotnet test
```

### Logging

Logs được ghi vào console. Cấu hình log level trong `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## 🚢 Deployment

### Production Build

```bash
dotnet publish -c Release -o ./publish
```

### Environment Variables

Đảm bảo các biến môi trường sau được cấu hình:

- `MONGODB_URI`: MongoDB connection string
- `JWT_KEY`: JWT secret key (min 32 characters)
- `ASPNETCORE_ENVIRONMENT`: Production

### Deploy Options

1. **Azure App Service**
2. **AWS Elastic Beanstalk**
3. **Docker Container**
4. **VPS/Server với IIS hoặc Kestrel**

### Docker (Optional)

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AureliaE-Commerce.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AureliaE-Commerce.dll"]
```

## 📝 Best Practices

1. **Error Handling**: Sử dụng try-catch và return appropriate HTTP status codes
2. **Validation**: Validate input data trước khi xử lý
3. **Async/Await**: Sử dụng async/await cho tất cả I/O operations
4. **Dependency Injection**: Sử dụng DI cho tất cả services
5. **Logging**: Log errors và important events
6. **Security**: Không expose sensitive data trong responses

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Kiểm tra `MONGODB_URI` trong `.env`
- Đảm bảo MongoDB đang chạy (nếu local)
- Kiểm tra network connectivity (nếu MongoDB Atlas)

### JWT Issues

- Đảm bảo `JWT_KEY` có ít nhất 32 ký tự
- Kiểm tra token expiration
- Verify token format trong Authorization header

### CORS Issues

- Kiểm tra frontend origin trong CORS configuration
- Đảm bảo `AllowCredentials()` được gọi nếu cần

## 📚 Tài liệu tham khảo

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [MongoDB C# Driver](https://www.mongodb.com/docs/drivers/csharp/)
- [JWT Authentication](https://jwt.io/)
- [SignalR Documentation](https://docs.microsoft.com/aspnet/core/signalr)

---

**Cập nhật lần cuối**: Tháng 12, 2025


