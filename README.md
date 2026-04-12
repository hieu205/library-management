# Library Management System

Hệ thống quản lý thư viện full-stack gồm backend Spring Boot và frontend React.
Dự án hỗ trợ quản lý sách, tác giả, thể loại, tồn kho, mượn - trả sách và báo cáo theo vai trò người dùng.

## 1. Tổng quan

- Backend: REST API với Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL.
- Frontend: React + Vite, giao diện dashboard, quản lý dữ liệu và phân quyền route theo role.
- Authentication: Access token + Refresh token.
- Authorization: Role-based access control (ADMIN, LIBRARIAN, USER).

## 2. Tính năng chính

### 2.1 Xác thực và người dùng

- Đăng ký, đăng nhập, refresh token, đăng xuất.
- Xem/cập nhật hồ sơ cá nhân, đổi mật khẩu.
- Quản lý người dùng (ADMIN): tạo, sửa, xóa, khóa/mở tài khoản.

### 2.2 Quản lý thư viện

- Quản lý sách: CRUD, tìm kiếm, gán tác giả.
- Quản lý tác giả: CRUD.
- Quản lý thể loại: CRUD.
- Quản lý tồn kho: tăng/giảm số lượng, xem tồn kho và lịch sử biến động.

### 2.3 Mượn - trả sách

- USER/ADMIN có thể tạo yêu cầu mượn.
- ADMIN duyệt/từ chối yêu cầu mượn.
- ADMIN tạo phiếu mượn trực tiếp.
- Trả sách và cập nhật số lượng đã trả.
- Xem danh sách yêu cầu đang chờ, lịch sử mượn, danh sách đang mượn.

### 2.4 Báo cáo thống kê (ADMIN)

- Top sách được mượn nhiều.
- Top người dùng mượn nhiều.
- Danh sách sách đang được mượn.
- Danh sách phiếu quá hạn.

## 3. Kiến trúc dự án

### 3.1 Cấu trúc thư mục

```text
library-management/
  backend/   # Spring Boot API + MySQL
  frontend/  # React + Vite UI
```

### 3.2 Backend (Spring Boot)

- Các package chính:
  - config: bảo mật, JWT filter, CORS, password encoder
  - controller: API endpoints
  - service: business logic
  - repository: truy vấn CSDL
  - entity: model JPA
  - dto/request, dto/response: object trao đổi dữ liệu

### 3.3 Frontend (React)

- Router + route protection:
  - ProtectedRoute: yêu cầu đăng nhập.
  - RoleRoute: giới hạn truy cập theo role.
- Context:
  - AuthContext quản lý trạng thái đăng nhập, role, token state.
- Services:
  - Axios client + interceptor tự động gắn Bearer token.
  - Tự động refresh token khi gặp 401.

## 4. Công nghệ sử dụng

- Java 17
- Spring Boot 4.x
- Spring Security + JWT (jjwt)
- Spring Data JPA + Hibernate
- MySQL
- React 19 + Vite
- Axios
- React Router DOM
- Recharts

## 5. Yêu cầu môi trường

- JDK 17+
- Maven (hoặc sử dụng Maven Wrapper trong backend).
- Node.js 18+ (khuyến nghị Node.js 20 LTS).
- MySQL 8+

## 6. Hướng dẫn cài đặt và chạy local

## 6.1 Clone source

```bash
git clone <your-repo-url>
cd library-management
```

## 6.2 Khởi tạo database

1. Tạo schema và bảng:

```bash
mysql -u <user> -p < backend/schema.sql
```

2. Nạp dữ liệu mẫu:

```bash
mysql -u <user> -p < backend/sample-data.sql
```

> Mặc định script dùng database `library_db`.

## 6.3 Cấu hình backend

File cau hinh: `backend/src/main/resources/application.properties`

Cần cập nhật:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `jwt.secret` (đổi secret riêng, độ dài lớn).

## 6.4 Chạy backend

Từ thư mục `backend`:

```bash
./mvnw spring-boot:run
```

Windows (PowerShell/CMD):

```bash
mvnw.cmd spring-boot:run
```

Mặc định backend chạy tại:

- `http://localhost:8080`

## 6.5 Chạy frontend

Từ thư mục `frontend`:

```bash
npm install
npm run dev
```

Mặc định frontend chạy tại:

- `http://localhost:5173`

Frontend gọi API đến:

- `http://localhost:8080/api/v1`

Nếu đổi domain/port backend, sửa lại base URL trong:

- `frontend/src/services/api.js`

## 7. Role và quyền truy cập

- ADMIN:
  - Toàn quyền quản trị (users, books, authors, categories, inventory, reports, borrow approvals).
- LIBRARIAN:
  - Quản lý nghiệp vụ thư viện trên giao diện (books/authors/categories/inventory/borrow pages).
  - Lưu ý: quyền backend hiện tại cho một số API quản trị được ràng buộc role ADMIN.
- USER:
  - Xem catalog, yêu cầu mượn, xem lịch sử mượn và thông tin cá nhân.

## 8. Tài khoản mẫu (từ sample-data.sql)

Mật khẩu mẫu cho tất cả tài khoản:

- `Password@123`

Ví dụ:

- Admin: `admin`
- Librarian: `librarian_ha`
- User: `member_an`

## 9. Tổng hợp API chính

Base path: `/api/v1`

- Users/Auth: `/users/register`, `/users/login`, `/users/refresh`, `/users/logout`, `/users/me`, ...
- Books: `/books`, `/books/{id}`, `/books/search`, `/books/{id}/authors`
- Authors: `/authors`
- Categories: `/categories`
- Inventory: `/inventory`, `/inventory/add`, `/inventory/increase`, `/inventory/decrease`, `/inventory/logs`
- Borrow: `/borrow`, `/borrow/request`, `/borrow/{id}/approve`, `/borrow/{id}/reject`, `/borrow/{id}/return`
- Reports: `/reports/top-books`, `/reports/top-users`, `/reports/borrowing-books`, `/reports/overdue-books`

## 10. Kiểm thử nhanh

Backend:

```bash
cd backend
./mvnw test
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## 11. Lưu ý bảo mật trước khi push GitHub

- Không commit thông tin nhạy cảm (DB host, username, password thật, JWT secret thật).
- Nên chuyển thông số cấu hình sang biến môi trường (`.env`) hoặc secret manager.
- Rotate lại credentials nếu đã từng lộ trong lịch sử git.

## 12. Định hướng cải thiện

- Tách config theo profile (`dev`, `staging`, `prod`).
- Bổ sung OpenAPI/Swagger cho API docs.
- Thêm test integration cho các luồng auth/borrow.
- Docker Compose cho full stack local.
- CI/CD (lint + test + build) với GitHub Actions.

---

Nếu bạn cần, mình có thể viết thêm bản README tiếng Anh để dùng cho nhà tuyển dụng/khách hàng quốc tế.