# Tài liệu kỹ thuật - Aurelia E-commerce

Tài liệu này cung cấp thông tin chi tiết về kiến trúc, implementation và các best practices của dự án Aurelia.

## 📚 Mục lục

- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [State Management](#state-management)
- [AI Body Measurement](#ai-body-measurement)
- [API Integration](#api-integration)
- [Type Definitions](#type-definitions)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)

## 🏗 Kiến trúc tổng quan

### Component Hierarchy

```
App (Router)
├── Home
│   └── HomeLayoutComponent
│       ├── Navbar
│       ├── HeroBanner
│       ├── Collection
│       ├── BestSeller
│       └── Footer
├── Product
│   └── ProductComponent
│       ├── FilterType
│       ├── ListProduct
│       └── ProductRecommend
├── BodySize
│   └── AiModelBodySize
│       ├── Main (Camera + Pose Detection)
│       └── DashBoardMeasures
└── DashboardAccount
    ├── DashBoardUser
    ├── DashBoardShop
    └── DashBoardAdmin
```

### Context Provider Hierarchy

```tsx
BrowserRouter
└── CollectionProvider
    └── AuthorForAdminProvider
        └── AdminProvider
            └── NotificationProvider
                └── DashBoardShopProvider
                    └── DiaChiProvider
                        └── AppointmentProvider
                            └── AiPoseMeasureProvider
                                └── CartProvider
                                    └── StoreProvider
                                        └── AuthForShopProvider
                                            └── AuthProvider
                                                └── FilterProvider
                                                    └── App
```

## 🔄 State Management

### Context API Pattern

Dự án sử dụng React Context API để quản lý state toàn cục. Mỗi context có trách nhiệm riêng:

#### 1. AuthProvider (`Author.tsx`)
- **State**: User authentication, token, user info
- **Methods**: login, logout, register, updateProfile
- **Usage**: 
  ```tsx
  const { user, login, logout } = useContext(AuthContext);
  ```

#### 2. CartProvider (`CartContext.tsx`)
- **State**: Cart items, total price
- **Methods**: addToCart, removeFromCart, updateQuantity, clearCart
- **Usage**:
  ```tsx
  const { cartItems, addToCart, totalPrice } = useContext(CartContext);
  ```

#### 3. AiPoseMeasureProvider (`AIPoseMeasure.tsx`)
- **State**: Body measurements (vai, nguc, eo, hong, chieuCao)
- **Methods**: setDataMeasure, postMeasureToDB
- **Usage**:
  ```tsx
  const { DataMeasure, setDataMeasure, postMeasureToDB } = useContext(AiPoseMeasureContext);
  ```

#### 4. StoreProvider (`Store.tsx`)
- **State**: Current shop information
- **Methods**: setShop, getShop
- **Usage**:
  ```tsx
  const { shop, setShop } = useContext(StoreContext);
  ```

### Local State vs Global State

- **Local State**: Sử dụng `useState` cho state chỉ liên quan đến component đó
- **Global State**: Sử dụng Context cho state được chia sẻ giữa nhiều components

## 🤖 AI Body Measurement

### MediaPipe Pose Integration

#### Setup

```tsx
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

const pose = new Pose({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});

pose.setOptions({
  modelComplexity: 2, // 0, 1, hoặc 2
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
```

#### Landmark Points

MediaPipe Pose phát hiện 33 điểm trên cơ thể:

- **0**: Nose
- **11**: Left Shoulder
- **12**: Right Shoulder
- **23**: Left Hip
- **24**: Right Hip
- **31**: Left Foot
- **32**: Right Foot
- **16**: Right Wrist (dùng để detect hand in box)

#### Tính toán số đo

##### 1. Vai (Shoulder Width)
```typescript
const shoulderWidth = calculate3DDistance(
  shoulderLeft,  // Landmark 11
  shoulderRight  // Landmark 12
) * 1.56 * 100; // Convert to cm
```

##### 2. Ngực (Chest)
```typescript
const shoulderWidth = calculate3DDistance(shoulderLeft, shoulderRight);
const shoulderDepth = calculateDepthFromZ(
  shoulderLeft.z,
  shoulderRight.z,
  shoulderWidth
);
const chest = calculateEllipseCircumference(shoulderWidth, shoulderDepth) * 100;
```

##### 3. Eo (Waist)
```typescript
// Tính điểm eo (30% từ vai, 70% từ hông)
const leftWaist = {
  x: shoulderLeft.x * 0.3 + leftHip.x * 0.7,
  y: shoulderLeft.y * 0.3 + leftHip.y * 0.7,
  z: shoulderLeft.z * 0.3 + leftHip.z * 0.7,
};
const waistWidth = calculate3DDistance(leftWaist, rightWaist);
const waistDepth = calculateDepthFromZ(leftWaist.z, rightWaist.z, waistWidth);
const waist = calculateEllipseCircumference(waistWidth, waistDepth) * 100 * 1.35;
```

##### 4. Hông (Hip)
```typescript
const hipWidth = calculate3DDistance(leftHip, rightHip);
const hipDepth = calculateDepthFromZ(leftHip.z, rightHip.z, hipWidth);
const hip = calculateEllipseCircumference(hipWidth, hipDepth) * 100 * 1.55;
```

##### 5. Chiều cao (Height)
```typescript
const heightCm = (Math.max(leftFoot.y, rightFoot.y) - head.y) * 100;
```

#### Helper Functions

##### calculate3DDistance
```typescript
const calculate3DDistance = (p1: any, p2: any) =>
  Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2)
  );
```

##### calculateDepthFromZ
```typescript
const calculateDepthFromZ = (
  leftZ: number,
  rightZ: number,
  baseWidth: number
) => {
  const zDiff = Math.abs(leftZ - rightZ);
  let ratio = 0.8 + (zDiff > 0.03 ? zDiff * 2 : 0);
  ratio = Math.max(0.7, Math.min(1.0, ratio));
  return baseWidth * ratio;
};
```

##### calculateEllipseCircumference
```typescript
const calculateEllipseCircumference = (width: number, depth: number) => {
  const a = width / 2;
  const b = depth / 2;
  const h = Math.pow((a - b) / (a + b), 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
};
```

### Hand Detection for Trigger

Để kích hoạt đo số đo, người dùng cần đưa tay phải vào khung:

```typescript
const rightHand = results.poseLandmarks?.[16];
const handInBox =
  rightHand.x > 0.2 &&
  rightHand.x < 0.56 &&
  rightHand.y > 0.41 &&
  rightHand.y < 0.78;
```

Khi `handInBox === true`, bắt đầu đếm ngược 3 giây trước khi đo.

## 🔌 API Integration

### API Configuration

File `src/services/api.ts` chứa tất cả API endpoints:

```typescript
export const api_Config = {
  authentication: { /* ... */ },
  Product: { /* ... */ },
  User: { /* ... */ },
  // ...
};

const api_Url = "https://localhost:7143";

export const UseApiUrl = (item: string) => {
  return api_Url + item;
};
```

### Axios Usage Pattern

```typescript
import axios from "axios";
import { UseApiUrl, api_Config } from "./services/api";

// GET request
const response = await axios.get(
  UseApiUrl(api_Config.Product.GetProduct)
);

// POST request
const response = await axios.post(
  UseApiUrl(api_Config.User.SuccessPayAddOrder),
  orderData,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Error Handling

```typescript
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || "Có lỗi xảy ra");
  }
  throw error;
}
```

## 📝 Type Definitions

### Core Types

#### Product
```typescript
export interface Product {
  id: string;
  name: string;
  type: string;
  subcategory: string;
  brand: string;
  origin: string;
  price: number;
  description: string;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  material: string;
  variants: Variant[];
  sold: number;
  discountValue: number;
  discountType: string;
  season: string;
}
```

#### Cart Item
```typescript
export type Cart = {
  Itemid: string;
  name: string;
  price: number;
  thumnail: string;
  color: string;
  size: string;
  quantity: number;
  dateBuy: string;
};
```

#### Order
```typescript
export type order = {
  orderId: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  address: string;
  ngayTaoDon: string;
  voucherUsed: Coupon[] | null;
  lat: number | undefined;
  lon: number | undefined;
  payment: string;
  tracking: updateTrackingOrder | undefined;
  product: Cart[];
};
```

#### Measure
```typescript
export type Measure = {
  vai: string;
  nguc: string;
  eo: string;
  hong: string;
  chieuCao: string;
};
```

## ⚡ Performance Optimization

### Code Splitting

Sử dụng React.lazy() và Suspense:

```tsx
const Home = lazy(() =>
  import("./Page/Home").then((m) => ({ default: m.Home }))
);

<Suspense fallback={<div>Đang tải...</div>}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>
```

### Memoization

Sử dụng `useMemo` và `useCallback` khi cần:

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Image Optimization

- Sử dụng lazy loading cho images
- Compress images trước khi upload
- Sử dụng CDN cho static assets

### API Call Optimization

- Debounce cho search input
- Cache API responses khi có thể
- Batch multiple API calls nếu backend hỗ trợ

## 🧪 Testing

### Component Testing (Recommended)

```typescript
import { render, screen } from "@testing-library/react";
import { YourComponent } from "./YourComponent";

test("renders component", () => {
  render(<YourComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

### API Testing

```typescript
import axios from "axios";
import { UseApiUrl, api_Config } from "./services/api";

test("fetches products", async () => {
  const response = await axios.get(
    UseApiUrl(api_Config.Product.GetProduct)
  );
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

1. **Sử dụng utility classes**:
   ```tsx
   <div className="flex items-center justify-center bg-blue-500">
   ```

2. **Responsive design**:
   ```tsx
   <div className="w-full md:w-1/2 lg:w-1/3">
   ```

3. **Dark mode** (nếu cần):
   ```tsx
   <div className="bg-white dark:bg-gray-800">
   ```

4. **Custom colors** (thêm vào tailwind.config):
   ```tsx
   <div className="bg-aurelia-primary">
   ```

## 🔐 Security Best Practices

1. **Never commit sensitive data**: Sử dụng environment variables
2. **Validate input**: Validate tất cả user input
3. **Sanitize data**: Sanitize data trước khi hiển thị
4. **HTTPS only**: Luôn sử dụng HTTPS cho API calls
5. **Token management**: Lưu tokens an toàn, không expose trong code

## 📦 Build & Deployment

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Environment Variables

Tạo `.env` file:
```
VITE_API_URL=https://api.example.com
VITE_LOCATIONIQ_KEY=your-key
```

Sử dụng trong code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Debugging

### React DevTools
- Cài đặt React DevTools extension
- Inspect component tree và props
- Xem Context values

### Network Debugging
- Sử dụng browser DevTools Network tab
- Kiểm tra API requests và responses
- Xem request headers và payloads

### Console Logging
```typescript
console.log("Debug info:", data);
console.table(arrayData);
console.group("Group name");
console.groupEnd();
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Cập nhật**: 2024

