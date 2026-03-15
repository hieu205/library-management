# Library Management System  Backend API

---

## Giới thiệu

**Library Management System** là một hệ thống quản lý thư viện backend được xây dựng bằng **Spring Boot**. Dự án mô phỏng nghiệp vụ thực tế của một thư viện: quản lý sách, tác giả, thể loại, tồn kho, và toàn bộ quy trình mượn  trả sách có kiểm soát tồn kho tự động.

Mục tiêu của dự án là thực hành thiết kế REST API chuẩn, tổ chức code theo layered architecture, xử lý nghiệp vụ phức tạp (transaction, partial return, inventory audit log), và chuẩn bị nền tảng cho việc mở rộng thêm JWT, phân quyền, và báo cáo.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | Java 17 |
| Framework | Spring Boot 4.0.3 |
| ORM | Spring Data JPA / Hibernate |
| Bảo mật | Spring Security (HTTP Basic + BCrypt) |
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
 controller/       # Nhận request, trả response (6 module)
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

### Sơ đồ quan hệ

```
Role  User  BorrowRecord  BorrowItem  Book
                                                                    
                                                              Inventory
                                                            InventoryLog
                                                            BookAuthor  Author
                                                           BookCategory  Category
```

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
- Mượn nhiều đầu sách trong một request
- Validate toàn bộ sách tồn tại và đủ tồn kho **trước** khi ghi bất kỳ dữ liệu nào
- Trừ `available_quantity` và ghi log trong cùng một transaction  rollback hoàn toàn nếu lỗi

### Trả sách
- Hỗ trợ **trả từng phần** (partial return): trả dần nhiều lần
- Tự động chuyển trạng thái phiếu thành `RETURNED` khi tất cả đầu sách đã trả đủ
- Tăng `available_quantity` và ghi `inventory_log` loại `RETURN`

### Quản lý người dùng
- Đăng ký, đăng nhập, xem và cập nhật profile
- Admin: tạo, cập nhật, khoá/mở khoá tài khoản
- Xem lịch sử mượn của bản thân hoặc của bất kỳ user nào (admin)

---

## API Endpoints

Tất cả endpoint đều có prefix `/api/v1`.

### Người dùng  `/api/v1/users`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/users/register` | Đăng ký tài khoản |
| `POST` | `/users/login` | Đăng nhập |
| `GET` | `/users/me` | Xem profile của chính mình |
| `PUT` | `/users/me` | Cập nhật profile |
| `GET` | `/users/me/borrow-history` | Lịch sử mượn sách của mình (paged) |
| `GET` | `/users/me/current-borrows` | Sách đang mượn chưa trả (paged) |
| `POST` | `/users` | Admin: tạo user mới |
| `PUT` | `/users/{id}` | Admin: cập nhật user |
| `PATCH` | `/users/{id}/status` | Admin: khoá / mở khoá tài khoản |
| `GET` | `/users` | Admin: danh sách tất cả user |
| `GET` | `/users/{userId}/borrow-history` | Admin: lịch sử mượn của user bất kỳ |

### Sách  `/api/v1/books`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/books` | Tạo sách mới |
| `GET` | `/books` | Danh sách tất cả sách |
| `GET` | `/books/{id}` | Chi tiết một cuốn sách |
| `PUT` | `/books/{id}` | Cập nhật sách |
| `DELETE` | `/books/{id}` | Xoá sách |
| `POST` | `/books/{id}/authors` | Gán tác giả cho sách |
| `GET` | `/books/search?keyword=` | Tìm kiếm sách |

### Tác giả  `/api/v1/authors`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/authors` | Tạo tác giả |
| `GET` | `/authors` | Danh sách tác giả |
| `GET` | `/authors/{id}` | Chi tiết tác giả |
| `PUT` | `/authors/{id}` | Cập nhật tác giả |
| `DELETE` | `/authors/{id}` | Xoá tác giả |

### Thể loại  `/api/v1/categories`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/categories` | Tạo thể loại |
| `GET` | `/categories` | Danh sách thể loại |
| `GET` | `/categories/{id}` | Chi tiết thể loại |
| `PUT` | `/categories/{id}` | Cập nhật thể loại |
| `DELETE` | `/categories/{id}` | Xoá thể loại |

### Tồn kho  `/api/v1/inventory`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/inventory/add` | Nhập kho sách |
| `PATCH` | `/inventory/decrease` | Giảm số lượng khả dụng |
| `PATCH` | `/inventory/increase` | Tăng số lượng khả dụng |
| `GET` | `/inventory` | Danh sách tồn kho |
| `GET` | `/inventory/{bookId}` | Tồn kho của một cuốn sách |
| `GET` | `/inventory/logs` | Toàn bộ lịch sử thay đổi kho |
| `GET` | `/inventory/logs/{bookId}` | Lịch sử thay đổi kho của một cuốn sách |

### Mượn & Trả  `/api/v1/borrow`

| Method | Path | Mô tả |
|---|---|---|
| `POST` | `/borrow` | Tạo phiếu mượn (nhiều sách/request) |
| `POST` | `/borrow/{borrowId}/return` | Trả sách (hỗ trợ trả từng phần) |
| `GET` | `/borrow` | Danh sách phiếu mượn (paged) |
| `GET` | `/borrow/{id}` | Chi tiết phiếu mượn |

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

> **Xác thực:** API dùng **HTTP Basic Authentication**. Thêm header `Authorization: Basic base64(username:password)` vào mỗi request cần xác thực.

---

## Hướng phát triển tiếp theo

- [ ] Thay HTTP Basic bằng **JWT Authentication**
- [ ] Phân quyền theo role (`ADMIN` / `LIBRARIAN` / `MEMBER`) bằng `@PreAuthorize`
- [ ] API phát hiện sách quá hạn (`GET /api/v1/borrow/overdue`)
- [ ] Báo cáo thống kê: top sách được mượn nhiều nhất, top user tích cực
- [ ] Tích hợp **Swagger / OpenAPI** tự động sinh tài liệu API
- [ ] Viết **Unit test** và **Integration test** cho các flow nghiệp vụ chính
- [ ] Tối ưu N+1 query bằng batch load hoặc `JOIN FETCH`

---

## Tác giả

Dự án được phát triển trong khuôn khổ luyện tập backend Java Spring Boot, hướng đến việc xây dựng một hệ thống hoàn chỉnh từ thiết kế DB đến triển khai API có thể mở rộng.

<<<<<<< HEAD
> Mọi góp ý hoặc câu hỏi vui lòng tạo Issue hoặc liên hệ qua email.
=======
> Mọi góp ý hoặc câu hỏi vui lòng tạo Issue hoặc liên hệ qua email.
>>>>>>> 0cc3829a5f88782b9eb4c7f1101b08ab3b27a2e7
