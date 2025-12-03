# Aurelia E-commerce

Aurelia là một ứng dụng thương mại điện tử hiện đại được xây dựng bằng React và TypeScript, cung cấp trải nghiệm mua sắm trực tuyến với các tính năng AI tiên tiến để đo số đo cơ thể và gợi ý size quần áo phù hợp.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt và chạy ứng dụng](#cài-đặt-và-chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Components chính](#components-chính)
- [Context Providers](#context-providers)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
- [Ghi chú](#ghi-chú)

## 🎯 Tổng quan

Aurelia là một nền tảng thương mại điện tử toàn diện với 3 vai trò chính:
- **Người dùng (User)**: Mua sắm, quản lý đơn hàng, đo số đo cơ thể bằng AI
- **Cửa hàng (Shop)**: Quản lý sản phẩm, đơn hàng, lịch hẹn, thông báo
- **Quản trị viên (Admin)**: Quản lý toàn bộ hệ thống, banner, collection, coupon

## 🚀 Tính năng

### Cho người dùng
- ✅ **Xem và tìm kiếm sản phẩm**: Duyệt và tìm kiếm sản phẩm theo nhiều tiêu chí
- ✅ **Quản lý giỏ hàng**: Thêm, chỉnh sửa, xóa sản phẩm trong giỏ hàng
- ✅ **Thanh toán**: Hỗ trợ nhiều phương thức thanh toán (Mock Payment)
- ✅ **Đo số đo bằng AI**: Sử dụng MediaPipe Pose để đo số đo cơ thể (vai, ngực, eo, hông, chiều cao)
- ✅ **Gợi ý size**: AI tự động gợi ý size quần áo phù hợp dựa trên số đo
- ✅ **Theo dõi đơn hàng**: Tracking đơn hàng với bản đồ (Leaflet + LocationIQ)
- ✅ **Quản lý tài khoản**: Xem lịch sử đơn hàng, sản phẩm yêu thích, cập nhật profile
- ✅ **Hệ thống tier**: Tích điểm và nâng cấp tier để nhận ưu đãi
- ✅ **Đặt lịch hẹn**: Đặt lịch hẹn thử đồ tại cửa hàng
- ✅ **Quản lý địa chỉ**: Lưu và quản lý nhiều địa chỉ giao hàng
- ✅ **Collection**: Xem các bộ sưu tập theo mùa

### Cho cửa hàng
- ✅ **Dashboard**: Xem tổng quan doanh thu, đơn hàng, khách hàng
- ✅ **Quản lý sản phẩm**: Thêm, sửa, xóa, xuất Excel sản phẩm
- ✅ **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng
- ✅ **Quản lý lịch hẹn**: Xem và quản lý các cuộc hẹn của khách hàng
- ✅ **Thông báo**: Gửi và quản lý thông báo cho khách hàng
- ✅ **Quản lý khách hàng**: Xem danh sách khách hàng

### Cho quản trị viên
- ✅ **Dashboard Admin**: Xem doanh thu, thống kê toàn hệ thống
- ✅ **Quản lý Banner**: Thêm, chỉnh sửa banner chính và story banner
- ✅ **Quản lý Collection**: Tạo và quản lý các bộ sưu tập theo mùa
- ✅ **Quản lý Coupon**: Tạo, chỉnh sửa, xóa voucher/giảm giá
- ✅ **Quản lý cửa hàng**: Xem thông tin và doanh thu các cửa hàng
- ✅ **Thống kê**: Xem sản phẩm bán chạy, doanh thu theo năm

## 🛠 Công nghệ sử dụng

### Frontend
- **Framework**: React 19.1.1
- **Ngôn ngữ**: TypeScript 5.8.3
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.1.12
- **Build Tool**: Vite 7.1.2
- **Animation**: Framer Motion 12.23.12
- **Icons**: Lucide React 0.542.0
- **Notifications**: React Hot Toast 2.6.0

### AI & Computer Vision
- **Pose Detection**: @mediapipe/pose 0.5.1675469404
- **Camera Utils**: @mediapipe/camera_utils 0.3.1675466862

### Maps & Location
- **Maps**: Leaflet 1.9.4
- **React Maps**: React Leaflet 5.0.0
- **Geocoding**: LocationIQ (external service)

### Data Visualization
- **Charts**: Chart.js 4.5.1, React Chart.js 2 5.3.0
- **Recharts**: Recharts 3.2.1

### Utilities
- **HTTP Client**: Axios 1.12.2
- **Real-time**: @microsoft/signalr 9.0.6
- **Excel**: XLSX 0.18.5
- **UUID**: uuid 13.0.0

### Development Tools
- **Linter**: ESLint 9.33.0
- **Type Checking**: TypeScript ESLint 8.39.1

## 📁 Cấu trúc dự án

```
Aurelia/
├── src/
│   ├── Components/          # Các component tái sử dụng
│   │   ├── AccountComponents/      # Component cho tài khoản người dùng
│   │   ├── AdminBrandComponent/   # Component cho admin
│   │   ├── AiModelBodySize/       # Component đo số đo bằng AI
│   │   ├── BookingAppointment/    # Component đặt lịch hẹn
│   │   ├── CheckOutComponents/    # Component thanh toán
│   │   ├── DashBoardShopComponent/# Component dashboard cửa hàng
│   │   ├── HomeLayoutComponent/   # Component layout trang chủ
│   │   ├── MockPayment/           # Component mock payment
│   │   ├── ProductComponent/      # Component sản phẩm
│   │   └── TrackingOrder/         # Component tracking đơn hàng
│   ├── contexts/            # React Context providers
│   │   ├── AdminContext.tsx
│   │   ├── AIPoseMeasure.tsx
│   │   ├── AppointmentContext.tsx
│   │   ├── Author.tsx
│   │   ├── AuthorForAdmin.tsx
│   │   ├── AuthorForShop.tsx
│   │   ├── CartContext.tsx
│   │   ├── DashBoardShopContext.tsx
│   │   ├── DiaChiContext.tsx
│   │   ├── FIlterProduct.tsx
│   │   ├── NotifycationContext.tsx
│   │   ├── SeasonContext.tsx
│   │   └── Store.tsx
│   ├── Page/                # Các trang chính
│   │   ├── DashboardAccount/     # Dashboard cho user/shop/admin
│   │   ├── About.tsx
│   │   ├── AllCollection.tsx
│   │   ├── BodySize.tsx          # Trang đo số đo
│   │   ├── Cart.tsx
│   │   ├── CheckOut.tsx
│   │   ├── Collection.tsx
│   │   ├── Home.tsx
│   │   ├── MainProduct.tsx
│   │   ├── MockPayMent.tsx
│   │   ├── Product.tsx
│   │   └── Search.tsx
│   ├── services/            # API services
│   │   └── api.ts           # Cấu hình API endpoints
│   ├── types/               # TypeScript type definitions
│   │   └── type.ts
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component với routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── dist/                    # Build output
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 💻 Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn
- Webcam (cho tính năng đo số đo)

### Cài đặt

1. **Clone repository và di chuyển vào thư mục dự án:**
   ```bash
   cd Aurelia
   ```

2. **Cài đặt các dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình API URL:**
   
   Mở file `src/services/api.ts` và cập nhật `api_Url`:
   ```typescript
   const api_Url = "https://localhost:7143"; // Thay đổi theo backend của bạn
   ```

4. **Chạy ứng dụng ở chế độ development:**
   ```bash
   npm run dev
   ```

5. **Truy cập ứng dụng:**
   
   Mở trình duyệt và truy cập: `http://localhost:5173` (hoặc port mà Vite hiển thị)

### Build cho production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`.

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🔌 API Endpoints

Dự án sử dụng API backend (C#) với các endpoints chính:

### Authentication
- `POST /api/Authentication/LogIn` - Đăng nhập user
- `POST /api/Authentication/LogInShop` - Đăng nhập shop
- `POST /api/Authentication/Register` - Đăng ký
- `POST /api/Authentication/LogInAdminSite` - Đăng nhập admin

### Product
- `GET /api/Product/GetProduct` - Lấy danh sách sản phẩm
- `GET /api/Product/GetProductBySearch` - Tìm kiếm sản phẩm
- `POST /api/Product/PostProduct` - Thêm sản phẩm
- `PUT /api/Product/updateQuantityProduct` - Cập nhật số lượng
- `DELETE /api/Product/DeleteProuct` - Xóa sản phẩm

### User/Client
- `GET /api/Client/LayThongTinNguoiDung` - Lấy thông tin user
- `POST /api/Client/AddItems` - Thêm sản phẩm yêu thích
- `GET /api/Client/GetItemFavourite` - Lấy sản phẩm yêu thích
- `POST /api/Client/AddDonHang` - Tạo đơn hàng
- `GET /api/Client/GetSoLuongDonHang` - Lấy số lượng đơn hàng
- `GET /api/Client/LayDonHang` - Lấy danh sách đơn hàng
- `GET /api/Client/LayDonHangGanDay` - Lấy đơn hàng gần đây
- `POST /api/Client/UpMeasure` - Lưu số đo
- `GET /api/Client/GetSoDo` - Lấy số đo
- `POST /api/Client/AddCuocHenUser` - Đặt lịch hẹn
- `GET /api/Client/LayCuocHenUser` - Lấy lịch hẹn
- `POST /api/Client/LuuDiaChi` - Lưu địa chỉ
- `GET /api/Client/LayDiaChi` - Lấy địa chỉ
- `DELETE /api/Client/XoaDiaChi` - Xóa địa chỉ
- `PUT /api/Client/UpdateProfile` - Cập nhật profile
- `PUT /api/Client/UpdateTier` - Cập nhật tier
- `PUT /api/Client/HuyDonHang` - Hủy đơn hàng

### Shop
- `GET /api/Shop/GetShopDataAcoountByID` - Lấy dữ liệu shop
- `GET /api/Shop/GetShop` - Lấy danh sách shop
- `GET /api/Shop/GetSHopById` - Lấy shop theo ID
- `POST /api/Shop/AddAppointment` - Thêm lịch hẹn
- `GET /api/Shop/LayTatCaSlotTheoNgay` - Lấy slot theo ngày
- `GET /api/Shop/SapXepDonChoCuaHang` - Sắp xếp đơn hàng
- `GET /api/Shop/LayDonHangTheoId` - Lấy đơn hàng theo ID
- `GET /api/Shop/DataForDashBoard` - Dữ liệu dashboard
- `GET /api/Shop/LayDanhSachLichHenVaDonHang` - Lấy lịch hẹn và đơn hàng
- `PUT /api/Shop/UpdateTrangThai` - Cập nhật trạng thái đơn hàng
- `GET /api/Shop/LaySanPham` - Lấy sản phẩm của shop
- `POST /api/Shop/UploadSanPham` - Upload sản phẩm
- `PUT /api/Shop/SuaSanPham` - Sửa sản phẩm
- `POST /api/Shop/PostMessage` - Gửi thông báo
- `GET /api/Shop/GetNoti` - Lấy thông báo
- `PUT /api/Shop/CheckNotifycation` - Đánh dấu đã đọc thông báo
- `GET /api/Shop/GetAllCustomer` - Lấy tất cả khách hàng

### Admin
- `GET /api/Admin/Revenue` - Doanh thu
- `GET /api/Admin/GetKhachHangAndDiscount` - Khách hàng và discount
- `GET /api/Admin/GetDoanhThuCuaHang` - Doanh thu cửa hàng
- `PUT /api/Admin/ResetSold` - Reset số lượng bán
- `GET /api/Admin/LaySanPhamBanChay` - Sản phẩm bán chạy
- `GET /api/Admin/DoanhThuCaNam` - Doanh thu cả năm
- `GET /api/Admin/InformationShop` - Thông tin shop

### Banner
- `GET /api/Banner/GetBanner` - Lấy banner
- `POST /api/Banner/AddMainBanner` - Thêm banner chính
- `POST /api/Banner/AddStoryBanner` - Thêm story banner
- `PUT /api/Banner/AdjustMainBanner` - Chỉnh sửa banner chính
- `PUT /api/Banner/AdjustStoryBanner` - Chỉnh sửa story banner

### Coupon
- `GET /api/Coupon/LaytatCaVoucher` - Lấy tất cả voucher
- `POST /api/Coupon/AddVoucher` - Thêm voucher
- `PUT /api/Coupon/AdjustVoucher` - Chỉnh sửa voucher
- `DELETE /api/Coupon/DeleteVoucher` - Xóa voucher
- `PUT /api/Coupon/UpdateStatusVoucher` - Cập nhật trạng thái
- `POST /api/Coupon/SuggestVoucher` - Gợi ý voucher

### Collection
- `GET /api/SeasonCollection/GetCollection` - Lấy tất cả collection
- `GET /api/SeasonCollection/GetProductWithId` - Lấy sản phẩm theo collection ID
- `GET /api/SeasonCollection/GetStatCollection` - Thống kê collection
- `POST /api/SeasonCollection/AddCollection` - Thêm collection
- `PUT /api/SeasonCollection/UpdateCollection` - Cập nhật collection
- `DELETE /api/SeasonCollection/DeleteCollection` - Xóa collection

### AI Advice
- `POST /api/GetAIAdvice/GetAdviceSize` - Gợi ý size dựa trên số đo

## 🧩 Components chính

### AiModelBodySize
- **Main.tsx**: Component chính xử lý camera và MediaPipe Pose để đo số đo
- **DashBoardMesuares.tsx**: Hiển thị kết quả đo và điều khiển camera

### HomeLayoutComponent
- **Navbar.tsx**: Navigation bar chính
- **HeroBanner.tsx**: Banner hero trên trang chủ
- **Collection.tsx**: Hiển thị collections
- **BestSeller.tsx**: Sản phẩm bán chạy
- **HotProducts.tsx**: Sản phẩm hot
- **Footer.tsx**: Footer

### ProductComponent
- **ListProduct.tsx**: Danh sách sản phẩm
- **FilterType.tsx**: Bộ lọc sản phẩm
- **ProductRecommend.tsx**: Sản phẩm gợi ý

### TrackingOrder
- **MainPage.tsx**: Trang chính tracking đơn hàng
- **LeftSite.tsx**: Thông tin đơn hàng
- **RightSiteMap.tsx**: Bản đồ tracking

### DashBoardShopComponent
- **DashBoard.tsx**: Dashboard cửa hàng
- **ProductList.tsx**: Danh sách sản phẩm
- **OrderList.tsx**: Danh sách đơn hàng
- **AppointmentList.tsx**: Danh sách lịch hẹn
- **Notification.tsx**: Thông báo

### AdminBrandComponent
- **OverView.tsx**: Tổng quan admin
- **Revenue.tsx**: Doanh thu
- **ProductManagement.tsx**: Quản lý sản phẩm
- **Collections.tsx**: Quản lý collections
- **Coupon.tsx**: Quản lý coupon
- **Banner/BannerSetting.tsx**: Quản lý banner

## 🔄 Context Providers

Dự án sử dụng nhiều Context Providers để quản lý state:

1. **AuthProvider** (`Author.tsx`): Quản lý authentication cho user
2. **AuthForShopProvider** (`AuthorForShop.tsx`): Quản lý authentication cho shop
3. **AuthorForAdminProvider** (`AuthorForAdmin.tsx`): Quản lý authentication cho admin
4. **CartProvider** (`CartContext.tsx`): Quản lý giỏ hàng
5. **AiPoseMeasureProvider** (`AIPoseMeasure.tsx`): Quản lý số đo từ AI
6. **AppointmentProvider** (`AppointmentContext.tsx`): Quản lý lịch hẹn
7. **DiaChiProvider** (`DiaChiContext.tsx`): Quản lý địa chỉ
8. **StoreProvider** (`Store.tsx`): Quản lý thông tin cửa hàng
9. **DashBoardShopProvider** (`DashBoardShopContext.tsx`): Quản lý dashboard shop
10. **NotificationProvider** (`NotifycationContext.tsx`): Quản lý thông báo
11. **AdminProvider** (`AdminContext.tsx`): Quản lý admin
12. **FilterProvider** (`FIlterProduct.tsx`): Quản lý bộ lọc sản phẩm
13. **CollectionProvider** (`SeasonContext.tsx`): Quản lý collections

## 📖 Hướng dẫn phát triển

### Thêm một route mới

1. Tạo component trong `src/Page/`
2. Thêm route vào `src/App.tsx`:
   ```tsx
   <Route path="/your-path" element={<YourComponent />} />
   ```

### Thêm một Context mới

1. Tạo file trong `src/contexts/`
2. Wrap component trong `src/main.tsx`:
   ```tsx
   <YourProvider>
     <App />
   </YourProvider>
   ```

### Thêm API endpoint mới

1. Thêm vào `src/services/api.ts`:
   ```typescript
   YourModule: {
     YourEndpoint: "/api/YourModule/YourEndpoint",
   }
   ```

2. Sử dụng:
   ```typescript
   import { UseApiUrl, api_Config } from "./services/api";
   const url = UseApiUrl(api_Config.YourModule.YourEndpoint);
   ```

### Cấu trúc component

```tsx
import React from "react";

interface YourComponentProps {
  // Props types
}

export const YourComponent: React.FC<YourComponentProps> = ({ props }) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Styling với Tailwind CSS

Dự án sử dụng Tailwind CSS 4.x. Ví dụ:
```tsx
<div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
  <h1 className="text-2xl font-bold text-white">Hello</h1>
</div>
```

## 🎯 Tính năng AI đo số đo

### Cách hoạt động

1. **MediaPipe Pose**: Sử dụng MediaPipe Pose để phát hiện 33 điểm trên cơ thể
2. **Tính toán số đo**:
   - **Vai**: Khoảng cách giữa 2 vai (shoulder points)
   - **Ngực**: Chu vi ellipse dựa trên chiều rộng và độ sâu vai
   - **Eo**: Chu vi ellipse tại vị trí eo (tính từ vai và hông)
   - **Hông**: Chu vi ellipse dựa trên chiều rộng và độ sâu hông
   - **Chiều cao**: Khoảng cách từ đầu đến chân

3. **Độ chính xác**: 
   - Có thể sai lệch ±3-5cm so với đo thực tế
   - Phụ thuộc vào điều kiện ánh sáng, góc camera, khoảng cách

### Sử dụng

1. Truy cập `/bodyMeasurements`
2. Bật camera
3. Đứng trước khung hình (khung màu xanh lá)
4. Đưa tay phải vào khung (kích hoạt đếm ngược 3 giây)
5. Giữ nguyên tư thế trong 3 giây
6. Xem kết quả và lưu vào database

## 🗺 Routing

### Public Routes
- `/` - Trang chủ
- `/Fashion/Products` - Danh sách sản phẩm
- `/Fashion/Products/:id` - Chi tiết sản phẩm
- `/Collection` - Tất cả collections
- `/Collection/:id` - Chi tiết collection
- `/search` - Tìm kiếm
- `/about` - Giới thiệu
- `/bodyMeasurements` - Đo số đo

### Protected Routes (User)
- `/cart` - Giỏ hàng
- `/account` - Tài khoản
- `/payment` - Thanh toán
- `/payment/:id` - Chi tiết thanh toán
- `/BookingAppointment/:id` - Đặt lịch hẹn
- `/tracking/:id` - Tracking đơn hàng

### Protected Routes (Shop)
- `/logInShop` - Đăng nhập shop
- `/DashBoardShop` - Dashboard shop

### Protected Routes (Admin)
- `/Admin` - Đăng nhập admin
- `/Admin/DashboardAdmin` - Dashboard admin

## 🔒 Bảo mật

- Tất cả API calls đều qua HTTPS
- Authentication tokens được lưu trong localStorage
- CORS được cấu hình ở backend
- Input validation ở cả frontend và backend

## 🐛 Xử lý lỗi

- Sử dụng React Hot Toast để hiển thị thông báo lỗi
- Try-catch blocks cho các API calls
- Error boundaries cho các component quan trọng

## 📝 Ghi chú

⚠️ **Lưu ý quan trọng:**
- Dự án đang trong quá trình phát triển
- Backend API cần được cấu hình đúng URL trong `src/services/api.ts`
- Tính năng đo số đo yêu cầu webcam và quyền truy cập camera
- LocationIQ API key cần được cấu hình cho tính năng tracking đơn hàng
- MediaPipe Pose models được tải từ CDN (jsdelivr.net)

## 🚀 Triển khai

### Build cho production

```bash
npm run build
```

### Deploy lên Vercel/Netlify

1. Kết nối repository với Vercel/Netlify
2. Cấu hình build command: `npm run build`
3. Cấu hình output directory: `dist`
4. Thêm environment variables nếu cần

### Environment Variables

Tạo file `.env` (nếu cần):
```
VITE_API_URL=https://your-api-url.com
VITE_LOCATIONIQ_KEY=your-locationiq-key
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này đang trong quá trình phát triển.

## 👥 Tác giả

Aurelia Development Team

---

**Cập nhật lần cuối**: 3/12/2025
