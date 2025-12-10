# 🛍️ Aurelia E-Commerce Platform

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)

Aurelia là một nền tảng thương mại điện tử hiện đại và toàn diện, được xây dựng với kiến trúc Full-Stack, tích hợp AI để đo số đo cơ thể và gợi ý size quần áo phù hợp. Hệ thống hỗ trợ 3 vai trò: **Người dùng**, **Cửa hàng**, và **Quản trị viên**.

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Bắt đầu](#-bắt-đầu)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Đóng góp](#-đóng-góp)

## 🎯 Tổng quan

Aurelia là một giải pháp thương mại điện tử hoàn chỉnh với các tính năng:

- 🛒 **Mua sắm trực tuyến**: Duyệt, tìm kiếm, và mua sắm sản phẩm
- 🤖 **AI Body Measurement**: Đo số đo cơ thể bằng MediaPipe Pose
- 📏 **Size Recommendation**: Gợi ý size quần áo phù hợp dựa trên số đo
- 📦 **Order Management**: Quản lý đơn hàng và tracking real-time
- 🏪 **Multi-Shop Support**: Hỗ trợ nhiều cửa hàng trên cùng nền tảng
- 👥 **Role-Based Access**: Phân quyền cho User, Shop, và Admin
- 💳 **Payment Integration**: Tích hợp thanh toán (Mock Payment)
- 📱 **Real-time Notifications**: Thông báo real-time qua SignalR
- 🎁 **Loyalty Program**: Hệ thống tích điểm và tier

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   User App   │  │   Shop App   │  │  Admin App   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
                        │ SignalR (WebSocket)
┌───────────────────────▼─────────────────────────────────────┐
│              Backend API (.NET 9.0)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │  Services    │  │   Hubs       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              MongoDB Database                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Products   │  │    Users     │  │    Orders    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Tính năng chính

### 👤 Cho Người dùng
- ✅ Xem và tìm kiếm sản phẩm với bộ lọc nâng cao
- ✅ Quản lý giỏ hàng và thanh toán
- ✅ Đo số đo cơ thể bằng AI (MediaPipe Pose)
- ✅ Gợi ý size quần áo tự động
- ✅ Theo dõi đơn hàng với bản đồ real-time
- ✅ Quản lý tài khoản, địa chỉ, lịch sử đơn hàng
- ✅ Hệ thống tích điểm và tier (Bronze, Silver, Gold, Platinum)
- ✅ Đặt lịch hẹn thử đồ tại cửa hàng
- ✅ Sản phẩm yêu thích và collections

### 🏪 Cho Cửa hàng
- ✅ Dashboard với thống kê doanh thu, đơn hàng, khách hàng
- ✅ Quản lý sản phẩm (CRUD, import/export Excel)
- ✅ Quản lý đơn hàng và cập nhật trạng thái
- ✅ Quản lý lịch hẹn của khách hàng
- ✅ Gửi thông báo real-time cho khách hàng
- ✅ Quản lý danh sách khách hàng
- ✅ Thống kê và báo cáo

### 👨‍💼 Cho Quản trị viên
- ✅ Dashboard tổng quan hệ thống
- ✅ Quản lý banner (Main Banner, Story Banner)
- ✅ Quản lý collections theo mùa
- ✅ Quản lý coupon/voucher
- ✅ Quản lý và xem thông tin các cửa hàng
- ✅ Thống kê doanh thu toàn hệ thống
- ✅ Xem sản phẩm bán chạy

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: React 19.1.1
- **Language**: TypeScript 5.8.3
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.1.12
- **Build Tool**: Vite 7.1.2
- **State Management**: React Context API
- **HTTP Client**: Axios 1.12.2
- **Real-time**: SignalR Client 9.0.6
- **AI**: MediaPipe Pose 0.5.1675469404
- **Maps**: Leaflet + React Leaflet
- **Charts**: Chart.js, Recharts
- **Notifications**: React Hot Toast

### Backend
- **Framework**: ASP.NET Core 9.0
- **Language**: C# 13
- **Database**: MongoDB 7.0
- **Authentication**: JWT Bearer
- **Real-time**: SignalR
- **API Documentation**: Swagger/OpenAPI
- **Password Hashing**: BCrypt.Net
- **Validation**: Data Annotations

### Infrastructure
- **Database**: MongoDB Atlas / Local MongoDB
- **Environment**: dotenv.net
- **Version Control**: Git

## 📁 Cấu trúc dự án

```
Aurelia/
├── Backend/
│   └── AureliaE-Commerce/          # Backend API (.NET 9.0)
│       ├── Controller/              # API Controllers
│       ├── Services/                # Business Logic
│       ├── Model/                   # Data Models
│       ├── Dto/                     # Data Transfer Objects
│       ├── Context/                 # MongoDB Context
│       ├── Hubs/                    # SignalR Hubs
│       └── Program.cs              # Application Entry Point
│
├── Frontend/
│   └── Aurelia/                     # Frontend Application (React)
│       ├── src/
│       │   ├── Components/         # React Components
│       │   ├── Page/               # Page Components
│       │   ├── contexts/           # Context Providers
│       │   ├── services/           # API Services
│       │   ├── types/              # TypeScript Types
│       │   └── assets/             # Static Assets
│       └── package.json
│
└── README.md                        # This file
```

## 🚀 Bắt đầu

### Yêu cầu hệ thống

**Backend:**
- .NET 9.0 SDK
- MongoDB 7.0+ (hoặc MongoDB Atlas)
- Visual Studio 2022 / VS Code / Rider

**Frontend:**
- Node.js >= 18.x
- npm >= 9.x hoặc yarn >= 1.22.x
- Webcam (cho tính năng đo số đo)

### Cài đặt nhanh

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd Aurelia
   ```

2. **Cài đặt Backend:**
   ```bash
   cd Backend/AureliaE-Commerce
   
   # Tạo file .env trong thư mục Backend/AureliaE-Commerce
   # Thêm các biến môi trường:
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_KEY=your_jwt_secret_key_min_32_characters
   
   dotnet restore
   dotnet run
   ```

3. **Cài đặt Frontend:**
   ```bash
   cd Frontend/Aurelia
   npm install
   npm run dev
   ```

4. **Truy cập ứng dụng:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5075
   - Swagger UI: http://localhost:5075 (root path)

## 📖 Hướng dẫn cài đặt chi tiết

### Backend Setup

Xem [Backend README](./Backend/AureliaE-Commerce/README.md) để biết hướng dẫn chi tiết.

**Tóm tắt:**
1. Cài đặt .NET 9.0 SDK
2. Cấu hình MongoDB connection string trong `.env`
3. Cấu hình JWT secret key trong `.env`
4. Chạy `dotnet restore` và `dotnet run`

### Frontend Setup

Xem [Frontend README](./Frontend/README.md) để biết hướng dẫn chi tiết.

**Tóm tắt:**
1. Cài đặt Node.js và npm
2. Cài đặt dependencies: `npm install`
3. Cấu hình API URL trong `src/services/api.ts`
4. Chạy `npm run dev`

## 📚 API Documentation

API được document bằng Swagger/OpenAPI. Sau khi chạy backend, truy cập:
- **Swagger UI**: http://localhost:5075
- **OpenAPI JSON**: http://localhost:5075/swagger/v1/swagger.json

### Các nhóm API chính:

- **Authentication**: `/api/Authentication/*`
- **Products**: `/api/Product/*`
- **Client/User**: `/api/Client/*`
- **Shop**: `/api/Shop/*`
- **Admin**: `/api/Admin/*`
- **Banner**: `/api/Banner/*`
- **Coupon**: `/api/Coupon/*`
- **Collection**: `/api/SeasonCollection/*`
- **AI Advice**: `/api/GetAIAdvice/*`

Xem [Backend README](./Backend/AureliaE-Commerce/README.md) để biết chi tiết các endpoints.

## 🚢 Deployment

### Backend Deployment

1. **Build production:**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Environment Variables:**
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_KEY`: JWT secret key (min 32 characters)
   - `ASPNETCORE_ENVIRONMENT`: Production

3. **Deploy options:**
   - Azure App Service
   - AWS Elastic Beanstalk
   - Docker Container
   - VPS/Server với IIS hoặc Kestrel

### Frontend Deployment

1. **Build production:**
   ```bash
   npm run build
   ```

2. **Deploy options:**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - GitHub Pages

3. **Environment Variables:**
   - `VITE_API_URL`: Backend API URL
   - `VITE_LOCATIONIQ_KEY`: LocationIQ API key (cho tracking)

## 🔒 Bảo mật

- ✅ JWT Authentication với Bearer tokens
- ✅ Password hashing với BCrypt (work factor: 12)
- ✅ CORS được cấu hình cho frontend origins
- ✅ HTTPS trong production
- ✅ Input validation ở cả frontend và backend
- ✅ SQL Injection protection (MongoDB driver)
- ✅ XSS protection

## 🧪 Testing

### Backend Testing
```bash
cd Backend/AureliaE-Commerce
dotnet test
```

### Frontend Testing
```bash
cd Frontend/Aurelia
npm test
```

## 📝 Development Guidelines

### Code Style

**Backend (C#):**
- Sử dụng C# naming conventions
- Async/await cho tất cả I/O operations
- Dependency Injection
- Repository pattern cho data access

**Frontend (TypeScript):**
- TypeScript strict mode
- Functional components với hooks
- Context API cho state management
- Tailwind CSS cho styling

### Git Workflow

1. Tạo feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: your feature description"`
3. Push và tạo Pull Request

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

Xem [CONTRIBUTING.md](./Frontend/CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 License

Dự án này đang trong quá trình phát triển.

## 👥 Team

Aurelia Development Team

## 📞 Liên hệ

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@aurelia.com

---

**Cập nhật lần cuối**: Tháng 12, 2025


