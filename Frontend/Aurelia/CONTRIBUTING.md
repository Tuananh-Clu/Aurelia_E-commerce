# Hướng dẫn đóng góp cho Aurelia

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án Aurelia! Tài liệu này sẽ hướng dẫn bạn cách đóng góp hiệu quả.

## 📋 Mục lục

- [Code of Conduct](#code-of-conduct)
- [Cách bắt đầu](#cách-bắt-đầu)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Quy tắc code](#quy-tắc-code)
- [Commit Messages](#commit-messages)
- [Pull Request](#pull-request)
- [Báo cáo lỗi](#báo-cáo-lỗi)
- [Đề xuất tính năng](#đề-xuất-tính-năng)

## 🤝 Code of Conduct

- Tôn trọng tất cả contributors
- Chấp nhận feedback một cách xây dựng
- Tập trung vào những gì tốt nhất cho cộng đồng
- Thể hiện sự đồng cảm với các thành viên khác

## 🚀 Cách bắt đầu

### 1. Fork và Clone

```bash
# Fork repository trên GitHub
# Sau đó clone fork của bạn
git clone https://github.com/your-username/Aurelia.git
cd Aurelia/Aurelia
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo branch mới

```bash
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/your-bug-fix
```

### 4. Cấu hình development environment

- Đảm bảo backend API đang chạy hoặc cấu hình mock API
- Cập nhật `api_Url` trong `src/services/api.ts` nếu cần
- Kiểm tra các environment variables

## 💻 Quy trình phát triển

### 1. Làm việc với code

- Luôn pull latest changes trước khi bắt đầu:
  ```bash
  git pull origin main
  ```

- Tạo branch mới cho mỗi feature/fix:
  ```bash
  git checkout -b feature/your-feature
  ```

- Commit thường xuyên với messages rõ ràng

### 2. Testing

- Test tính năng của bạn trước khi commit
- Đảm bảo không có lỗi linting:
  ```bash
  npm run lint
  ```

- Kiểm tra build thành công:
  ```bash
  npm run build
  ```

### 3. Code Review

- Tự review code của bạn trước khi tạo PR
- Đảm bảo code dễ đọc và dễ hiểu
- Thêm comments cho logic phức tạp

## 📝 Quy tắc code

### TypeScript

- **Luôn sử dụng TypeScript**, không sử dụng `any` nếu có thể
- Định nghĩa types/interfaces cho tất cả props và state
- Sử dụng type inference khi có thể

```typescript
// ✅ Good
interface UserProps {
  name: string;
  age: number;
}

const User: React.FC<UserProps> = ({ name, age }) => {
  // ...
};

// ❌ Bad
const User = ({ name, age }: any) => {
  // ...
};
```

### React Components

- **Functional Components**: Luôn sử dụng functional components với hooks
- **Component Naming**: PascalCase cho components
- **File Naming**: PascalCase cho component files (e.g., `UserProfile.tsx`)

```tsx
// ✅ Good
export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ❌ Bad
export function userProfile({ user }) {
  return <div>{user.name}</div>;
}
```

### Hooks

- **Custom Hooks**: Bắt đầu với `use` prefix
- **Hook Rules**: Tuân thủ Rules of Hooks
- **Dependencies**: Luôn include đầy đủ dependencies trong dependency arrays

```tsx
// ✅ Good
useEffect(() => {
  fetchData();
}, [userId, filter]);

// ❌ Bad
useEffect(() => {
  fetchData();
}, []); // Missing dependencies
```

### Styling

- **Tailwind CSS**: Ưu tiên sử dụng Tailwind utility classes
- **Responsive**: Luôn thiết kế responsive
- **Consistency**: Tuân thủ design system hiện có

```tsx
// ✅ Good
<div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ Bad
<div style={{ display: 'flex', padding: '24px' }}>
```

### File Organization

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests (if any)
└── types.ts              # Types specific to this component (if needed)
```

### Imports

- **Order**: 
  1. React và React-related imports
  2. Third-party libraries
  3. Internal components
  4. Types
  5. Utils/helpers
  6. Styles

```tsx
// ✅ Good
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";
import type { User } from "../types/type";
import { formatDate } from "../utils/helpers";
```

### Comments

- **Code should be self-documenting**: Tránh comments không cần thiết
- **Complex logic**: Comment cho logic phức tạp hoặc không rõ ràng
- **TODO**: Sử dụng `// TODO:` cho các task chưa hoàn thành

```tsx
// ✅ Good
// Calculate ellipse circumference using Ramanujan's approximation
const circumference = calculateEllipseCircumference(width, depth);

// ❌ Bad
// Set x to 5
const x = 5;
```

## 📨 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Refactoring code
- `test`: Thêm tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(AI): Thêm tính năng đo số đo hông

- Implement calculation cho hip measurement
- Thêm validation cho hip data
- Update UI để hiển thị hip measurement

Closes #123
```

```bash
fix(Cart): Sửa lỗi không cập nhật total price

Khi xóa sản phẩm khỏi cart, total price không được cập nhật.
Đã fix bằng cách thêm useEffect dependency.

Fixes #456
```

## 🔀 Pull Request

### Checklist trước khi tạo PR

- [ ] Code đã được test
- [ ] Không có lỗi linting (`npm run lint`)
- [ ] Build thành công (`npm run build`)
- [ ] Code tuân thủ quy tắc code
- [ ] Đã thêm comments cho logic phức tạp
- [ ] Đã cập nhật documentation nếu cần
- [ ] Commit messages rõ ràng

### PR Template

```markdown
## Mô tả
Mô tả ngắn gọn về thay đổi này.

## Loại thay đổi
- [ ] Bug fix
- [ ] Tính năng mới
- [ ] Breaking change
- [ ] Documentation update

## Cách test
Mô tả cách test thay đổi này:
1. Bước 1
2. Bước 2
3. ...

## Screenshots (nếu có)
Thêm screenshots nếu thay đổi liên quan đến UI.

## Checklist
- [ ] Code đã được test
- [ ] Không có lỗi linting
- [ ] Build thành công
- [ ] Documentation đã được cập nhật
```

### Review Process

1. Tạo PR với description đầy đủ
2. Đợi review từ maintainers
3. Address feedback nếu có
4. Sau khi approved, code sẽ được merge

## 🐛 Báo cáo lỗi

### Bug Report Template

```markdown
**Mô tả lỗi**
Mô tả rõ ràng về lỗi.

**Các bước để reproduce**
1. Đi đến '...'
2. Click vào '...'
3. Scroll xuống '...'
4. Thấy lỗi

**Expected behavior**
Mô tả hành vi mong đợi.

**Screenshots**
Nếu có thể, thêm screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Thêm bất kỳ context nào khác về lỗi.
```

## 💡 Đề xuất tính năng

### Feature Request Template

```markdown
**Tính năng bạn muốn đề xuất**
Mô tả rõ ràng về tính năng.

**Vấn đề nó giải quyết**
Mô tả vấn đề mà tính năng này giải quyết.

**Giải pháp đề xuất**
Mô tả cách bạn muốn tính năng hoạt động.

**Alternatives đã xem xét**
Mô tả các giải pháp thay thế khác.

**Additional context**
Thêm bất kỳ context nào khác.
```

## ❓ Câu hỏi?

Nếu bạn có câu hỏi, có thể:
- Tạo issue với label `question`
- Liên hệ maintainers qua GitHub Discussions

## 🙏 Cảm ơn!

Cảm ơn bạn đã đóng góp cho Aurelia! Mọi đóng góp đều được đánh giá cao.

---

**Happy Coding! 🚀**

