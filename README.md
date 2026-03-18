# Library Management System  Backend API

---

## Giới thiệu

**Library Management System** là một hệ thống quản lý thư viện backend được xây dựng bằng **Spring Boot**. Dự án mô phỏng nghiệp vụ thực tế của một thư viện: quản lý sách, tác giả, thể loại, tồn kho, và toàn bộ quy trình mượn-trả sách có kiểm soát tồn kho tự động.

Mục tiêu của dự án là thực hành thiết kế REST API chuẩn, tổ chức code theo layered architecture, xử lý nghiệp vụ phức tạp (transaction, partial return, inventory audit log), đồng thời triển khai xác thực JWT, phân quyền theo role và module báo cáo thống kê.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | Java 17 |
| Framework | Spring Boot 4.0.3 |
| ORM | Spring Data JPA / Hibernate |
| Bảo mật | Spring Security (JWT + BCrypt) |
| Cơ sở dữ liệu | MySQL 8 |
| Validation | Jakarta Bean Validation (`@Valid`) |
| Tiện ích | Lombok |
| Build tool | Maven |

---

## Kiến trúc hệ thống

Dự án áp dụng **Layered Architecture** (kiến trúc phân tầng) gồm 4 tầng rõ ràng:

```
Controller    Service    Repository    Database (MySQL)
                   
  DTO (Request)   Entity
  DTO (Response)
```

```
src/main/java/com/example/demo/
 config/           # Cấu hình Spring Security
 controller/       # Nhận request, trả response (7 module)
 dto/
    request/      # DTO đầu vào, có validation annotation
    response/     # DTO đầu ra + wrapper ApiResponse<T>
 entity/           # JPA entity ánh xạ 11 bảng DB
 handleException/  # Global exception handler (@RestControllerAdvice)
 repository/       # Spring Data JPA repositories
 service/          # Toàn bộ business logic
```

---

## Thiết kế cơ sở dữ liệu


### Danh sách bảng

| Bảng | Mô tả |
|---|---|
| `roles` | Vai trò người dùng |
| `users` | Tài khoản người dùng |
| `books` | Thông tin sách |
| `authors` | Tác giả |
| `book_authors` | Quan hệ nhiều-nhiều sách  tác giả |
| `categories` | Thể loại sách |
| `book_categories` | Quan hệ nhiều-nhiều sách  thể loại |
| `inventory` | Tồn kho theo sách (1-1 với books) |
| `inventory_logs` | Lịch sử thay đổi tồn kho |
| `borrow_records` | Phiếu mượn sách |
| `borrow_items` | Chi tiết từng đầu sách trong phiếu mượn |

---

## Tính năng chính

### Quản lý sách, tác giả, thể loại
- CRUD đầy đủ cho Book, Author, Category
- Kiểm tra trùng tên (case-insensitive) khi tạo mới hoặc cập nhật
- Gán nhiều tác giả và thể loại cho một cuốn sách
- Tìm kiếm sách theo keyword (tiêu đề, tác giả, thể loại)

### Quản lý tồn kho
- Nhập kho, tăng/giảm số lượng khả dụng
- Ghi `inventory_log` cho mọi thay đổi (IMPORT / BORROW / RETURN)  audit trail đầy đủ
- Xem lịch sử thay đổi theo từng đầu sách

### Mượn sách
- Admin tạo phiếu mượn trực tiếp tại quầy
- User gửi yêu cầu mượn online và chờ admin xét duyệt
- Admin duyệt/từ chối đơn mượn
- Validate toàn bộ sách tồn tại và đủ tồn kho **trước** khi ghi bất kỳ dữ liệu nào
- Trừ `available_quantity` và ghi log trong cùng một transaction  rollback hoàn toàn nếu lỗi

### Trả sách
- Hỗ trợ **trả từng phần** (partial return): trả dần nhiều lần
- Tự động chuyển trạng thái phiếu thành `RETURNED` khi tất cả đầu sách đã trả đủ
- Tăng `available_quantity` và ghi `inventory_log` loại `RETURN`

### Quản lý người dùng
- Đăng ký, đăng nhập, refresh token, đăng xuất
- Xem/cập nhật profile, đổi mật khẩu
- Admin: tạo, cập nhật, khoá/mở khoá tài khoản
- Admin: xoá user và xem lịch sử mượn theo user
- Xem lịch sử mượn của bản thân hoặc của bất kỳ user nào (admin)

### Báo cáo thống kê
- Top sách được mượn nhiều nhất
- Top người dùng mượn nhiều nhất
- Danh sách sách đang được mượn
- Danh sách phiếu mượn quá hạn

---

## Mô hình nghiệp vụ UML (Use Case)

### Actor của hệ thống

| Actor | Mô tả |
|---|---|
| Guest | Người dùng chưa đăng nhập. Có thể đăng ký, đăng nhập và xem dữ liệu công khai. |
| User | Người dùng đã xác thực vai trò `USER`. Có thể quản lý tài khoản cá nhân và gửi yêu cầu mượn online. |
| Admin | Người dùng đã xác thực vai trò `ADMIN`. Có toàn quyền quản trị nghiệp vụ thư viện. |

### Use case chính theo actor

| Actor | Use case tiêu biểu |
|---|---|
| Guest | Đăng ký, đăng nhập, xem/tìm kiếm sách, xem tác giả, xem thể loại |
| User | Refresh token, đăng xuất, xem/cập nhật profile, đổi mật khẩu, gửi yêu cầu mượn, xem đơn và lịch sử mượn của bản thân |
| Admin | Quản lý sách/tác giả/thể loại, quản lý kho, tạo phiếu mượn trực tiếp, duyệt/từ chối đơn mượn, xử lý trả sách, quản lý người dùng, xem báo cáo |

---

## API Endpoints

Tất cả endpoint đều có prefix `/api/v1`.

Thống kê dưới đây được tổng hợp trực tiếp từ 7 controller trong backend (`UserController`, `BookController`, `AuthorController`, `CategoryController`, `InventoryController`, `BorrowController`, `ReportController`).

### Người dùng  `/api/v1/users`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/users/register` | `PermitAll` | Đăng ký tài khoản |
| `POST` | `/users/login` | `PermitAll` | Đăng nhập |
| `POST` | `/users/refresh` | `PermitAll` | Làm mới access token/refresh token |
| `POST` | `/users/logout` | `Authenticated` | Đăng xuất |
| `GET` | `/users/me` | `Authenticated` | Xem profile của chính mình |
| `PUT` | `/users/me` | `Authenticated` | Cập nhật profile |
| `PATCH` | `/users/me/password` | `Authenticated` | Đổi mật khẩu |
| `GET` | `/users/me/borrow-history` | `Authenticated` | Lịch sử mượn sách của mình (paged) |
| `GET` | `/users/me/current-borrows` | `Authenticated` | Sách đang mượn chưa trả (paged) |
| `POST` | `/users` | `ADMIN` | Tạo user mới |
| `PUT` | `/users/{id}` | `ADMIN` | Cập nhật user |
| `PATCH` | `/users/{id}/status` | `ADMIN` | Khóa/mở khóa tài khoản |
| `DELETE` | `/users/{id}` | `ADMIN` | Xóa user |
| `GET` | `/users` | `ADMIN` | Danh sách tất cả user |
| `GET` | `/users/{userId}/borrow-history` | `ADMIN` | Lịch sử mượn của user bất kỳ |

### Sách  `/api/v1/books`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/books` | `ADMIN` | Tạo sách mới |
| `GET` | `/books` | `PermitAll` | Danh sách tất cả sách |
| `GET` | `/books/{id}` | `PermitAll` | Chi tiết một cuốn sách |
| `PUT` | `/books/{id}` | `ADMIN` | Cập nhật sách |
| `DELETE` | `/books/{id}` | `ADMIN` | Xóa sách |
| `POST` | `/books/{id}/authors` | `ADMIN` | Gán tác giả cho sách |
| `GET` | `/books/search?keyword=` | `PermitAll` | Tìm kiếm sách |

### Tác giả  `/api/v1/authors`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/authors` | `ADMIN` | Tạo tác giả |
| `GET` | `/authors` | `PermitAll` | Danh sách tác giả |
| `GET` | `/authors/{id}` | `PermitAll` | Chi tiết tác giả |
| `PUT` | `/authors/{id}` | `ADMIN` | Cập nhật tác giả |
| `DELETE` | `/authors/{id}` | `ADMIN` | Xóa tác giả |
| `GET` | `/authors/{id}/books` | `PermitAll` | Danh sách sách theo tác giả |

### Thể loại  `/api/v1/categories`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/categories` | `ADMIN` | Tạo thể loại |
| `GET` | `/categories` | `PermitAll` | Danh sách thể loại |
| `GET` | `/categories/{id}` | `PermitAll` | Chi tiết thể loại |
| `PUT` | `/categories/{id}` | `ADMIN` | Cập nhật thể loại |
| `DELETE` | `/categories/{id}` | `ADMIN` | Xóa thể loại |

### Tồn kho  `/api/v1/inventory`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/inventory/add` | `ADMIN` | Nhập kho sách |
| `PATCH` | `/inventory/decrease` | `ADMIN` | Giảm số lượng khả dụng |
| `PATCH` | `/inventory/increase` | `ADMIN` | Tăng số lượng khả dụng |
| `GET` | `/inventory` | `ADMIN` | Danh sách tồn kho |
| `GET` | `/inventory/{bookId}` | `ADMIN` | Tồn kho của một cuốn sách |
| `GET` | `/inventory/logs` | `ADMIN` | Toàn bộ lịch sử thay đổi kho |
| `GET` | `/inventory/logs/{bookId}` | `ADMIN` | Lịch sử thay đổi kho của một cuốn sách |

### Mượn & Trả  `/api/v1/borrow`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/borrow` | `ADMIN` | Tạo phiếu mượn trực tiếp |
| `POST` | `/borrow/request` | `USER` / `ADMIN` | Gửi yêu cầu mượn online |
| `POST` | `/borrow/{borrowId}/approve` | `ADMIN` | Duyệt đơn mượn |
| `POST` | `/borrow/{borrowId}/reject` | `ADMIN` | Từ chối đơn mượn |
| `POST` | `/borrow/{borrowId}/return` | `ADMIN` | Trả sách (hỗ trợ trả từng phần) |
| `GET` | `/borrow` | `ADMIN` | Danh sách toàn bộ phiếu mượn |
| `GET` | `/borrow/pending` | `ADMIN` | Danh sách đơn chờ duyệt |
| `GET` | `/borrow/my-requests` | `USER` / `ADMIN` | Danh sách đơn của chính mình |
| `GET` | `/borrow/{id}` | `ADMIN` | Chi tiết phiếu mượn |

### Báo cáo  `/api/v1/reports`

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/reports/top-books?limit=10` | `ADMIN` | Top sách được mượn nhiều nhất |
| `GET` | `/reports/top-users?limit=10` | `ADMIN` | Top người dùng mượn nhiều nhất |
| `GET` | `/reports/borrowing-books` | `ADMIN` | Danh sách sách đang được mượn |
| `GET` | `/reports/overdue-books` | `ADMIN` | Danh sách phiếu mượn quá hạn |

### API User yêu cầu phiếu mượn sách (trích nhanh)

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/borrow/request` | `USER` / `ADMIN` | User gửi yêu cầu tạo phiếu mượn sách online |
| `GET` | `/borrow/my-requests` | `USER` / `ADMIN` | User xem danh sách yêu cầu mượn của chính mình |

---

## Ví dụ Request / Response

### Tạo phiếu mượn  `POST /api/v1/borrow`

**Request:**
```json
{
  "items": [
    { "bookId": 1, "quantity": 2 },
    { "bookId": 3, "quantity": 1 }
  ],
  "dueDate": "2026-03-23"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Mượn sách thành công",
  "data": {
    "record": {
      "id": 5,
      "userId": 2,
      "username": "nguyenvana",
      "borrowDate": "2026-03-09",
      "dueDate": "2026-03-23",
      "status": "BORROWING"
    },
    "items": [
      { "bookId": 1, "bookTitle": "Clean Code", "quantity": 2, "returnedQuantity": 0 },
      { "bookId": 3, "bookTitle": "Spring Boot in Action", "quantity": 1, "returnedQuantity": 0 }
    ]
  }
}
```

**Response lỗi validation `400 Bad Request`:**
```json
{
  "timestamp": "2026-03-09T10:00:00",
  "status": 400,
  "error": "Validation failed",
  "details": {
    "items": "Danh sách sách mượn không được để trống"
  }
}
```

---

## Hướng dẫn chạy local

### Yêu cầu
- Java 17+
- MySQL 8+
- Maven 3.8+

### Các bước

**1. Clone repository**
```bash
git clone https://github.com/your-username/library-management.git
cd library-management
```

**2. Tạo database và import schema**
```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
```bash
mysql -u root -p library_db < database.sql
```

**3. Cấu hình kết nối DB**

Chỉnh sửa file `demo/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**4. Chạy ứng dụng**
```bash
cd demo
./mvnw spring-boot:run
```
Server khởi động tại `http://localhost:8080`.

**5. Import Postman Collection**

Import file `LibraryManagement.postman_collection.json` vào Postman để có sẵn toàn bộ request mẫu.

> **Xác thực:** API dùng **JWT Bearer Token**. Với API cần xác thực, gửi header `Authorization: Bearer <access_token>`.

---

