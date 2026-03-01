# Backend Daily Checklist (30 ngày) - Library Management

> Cách dùng: mỗi ngày đánh dấu `- [x]` cho task đã xong, ghi note ngắn phần blocker hoặc issue.

## Thông tin sprint
- Start date: ____ / ____ / 2026
- End date: ____ / ____ / 2026
- Mục tiêu tháng: Hoàn thiện backend MVP + tài liệu + test cơ bản

---

## Tuần 1 - Foundation + Auth + User

### Day 1 - Chốt định hướng & môi trường
- [ ] Chốt scope MVP và optional
- [ ] Chốt convention đặt tên (endpoint, DTO, response)
- [ ] Cấu hình `application.properties` cho local
- [ ] Kết nối MySQL và verify chạy app thành công
- [ ] Ghi note issue kỹ thuật

**Kết quả mong đợi:** app boot được, kết nối DB OK.

### Day 2 - Hoàn thiện data layer nền
- [ ] Rà soát entity khớp database.sql
- [ ] Tạo repository cơ bản cho User/Role
- [ ] Chuẩn bị enum trạng thái (USER_STATUS, BORROW_STATUS)
- [ ] Seed role mặc định
- [ ] Smoke test truy vấn DB

**Kết quả mong đợi:** data layer ổn định cho auth/user.

### Day 3 - Auth register/login
- [ ] Cấu hình Spring Security cơ bản
- [ ] Implement `POST /api/v1/auth/register`
- [ ] Implement `POST /api/v1/auth/login`
- [ ] Hash password (BCrypt)
- [ ] Trả JWT token khi login

**Kết quả mong đợi:** register/login hoạt động end-to-end.

### Day 4 - Profile API
- [ ] Implement `GET /api/v1/users/me`
- [ ] Implement `PUT /api/v1/users/me`
- [ ] Validate request DTO
- [ ] Chuẩn hóa response wrapper
- [ ] Test các case lỗi phổ biến

**Kết quả mong đợi:** user xem/sửa profile được.

### Day 5 - Admin quản lý user
- [ ] Implement `POST /api/v1/users`
- [ ] Implement `PUT /api/v1/users/{userId}`
- [ ] Implement `PATCH /api/v1/users/{userId}/status`
- [ ] Implement `GET /api/v1/users` (paging)
- [ ] Áp quyền ADMIN/LIBRARIAN đúng yêu cầu

**Kết quả mong đợi:** user management hoàn chỉnh.

### Day 6 - Error handling & clean code
- [ ] Tạo Global Exception Handler
- [ ] Chuẩn hóa mã lỗi HTTP
- [ ] Chuẩn hóa message lỗi validation
- [ ] Refactor service/controller tuần 1
- [ ] Viết README phần Auth/User

### Day 7 - Buffer tuần 1
- [ ] Fix bug tồn đọng
- [ ] Viết test bổ sung cho auth/user
- [ ] Demo tuần 1
- [ ] Chốt backlog tuần 2

---

## Tuần 2 - Book + Author + Category + Search

### Day 8 - Book create/update
- [ ] Implement `POST /api/v1/books`
- [ ] Implement `PUT /api/v1/books/{bookId}`
- [ ] Validate unique ISBN
- [ ] Chuẩn hóa DTO request/response book

### Day 9 - Book delete/list/detail
- [ ] Implement `DELETE /api/v1/books/{bookId}`
- [ ] Implement `GET /api/v1/books`
- [ ] Implement `GET /api/v1/books/{bookId}`
- [ ] Thêm pagination/sorting cho list books

### Day 10 - Author + Category create
- [ ] Implement `POST /api/v1/authors`
- [ ] Implement `POST /api/v1/categories`
- [ ] Validate dữ liệu đầu vào
- [ ] Test tạo dữ liệu mẫu

### Day 11 - Gán author/category cho book
- [ ] Implement `POST /api/v1/books/{bookId}/authors`
- [ ] Implement `POST /api/v1/books/{bookId}/categories`
- [ ] Chống gán trùng dữ liệu mapping
- [ ] Test quan hệ many-to-many

### Day 12 - Search API
- [ ] Implement `GET /api/v1/books/search?keyword=`
- [ ] Implement `GET /api/v1/books/isbn/{isbn}`
- [ ] Tối ưu query search cơ bản
- [ ] Test keyword theo title/author/category

### Day 13 - Test module sách
- [ ] Unit test service sách
- [ ] Integration test API sách
- [ ] Test case lỗi unique/not found
- [ ] Review query performance

### Day 14 - Buffer tuần 2
- [ ] Fix bug tồn đọng
- [ ] Cập nhật docs API module sách
- [ ] Demo tuần 2

---

## Tuần 3 - Inventory + Borrow + Return

### Day 15 - Inventory add
- [ ] Implement `POST /api/v1/inventory/add`
- [ ] Validate quantity > 0
- [ ] Update inventory đúng logic
- [ ] Ghi `inventory_logs` khi nhập

### Day 16 - Inventory adjust/list
- [ ] Implement `PATCH /api/v1/inventory/adjust`
- [ ] Implement `GET /api/v1/inventory`
- [ ] Implement `GET /api/v1/inventory/{bookId}`
- [ ] Implement `GET /api/v1/inventory/logs`

### Day 17 - Borrow create (core)
- [ ] Implement `POST /api/v1/borrow`
- [ ] Validate sách tồn tại và đủ tồn kho
- [ ] Tạo `borrow_record`
- [ ] Tạo `borrow_items`

### Day 18 - Borrow transaction hoàn chỉnh
- [ ] Trừ `available_quantity` trong transaction
- [ ] Ghi `inventory_logs` loại BORROW
- [ ] Rollback khi lỗi giữa chừng
- [ ] Test mượn nhiều sách trong 1 request

### Day 19 - Return API
- [ ] Implement `POST /api/v1/borrow/{borrowId}/return`
- [ ] Update `borrow_items.returned_quantity`
- [ ] Tăng `inventory.available_quantity`
- [ ] Ghi `inventory_logs` loại RETURN

### Day 20 - Borrow query API
- [ ] Implement `GET /api/v1/borrow`
- [ ] Implement `GET /api/v1/borrow/{borrowId}`
- [ ] Implement `GET /api/v1/users/me/borrow-history`
- [ ] Implement `GET /api/v1/users/me/current-borrows`

### Day 21 - Overdue
- [ ] Implement `GET /api/v1/borrow/overdue`
- [ ] Logic `due_date < current_date AND status = BORROWING`
- [ ] Test case overdue thực tế
- [ ] Demo tuần 3

---

## Tuần 4 - Hardening + Docs + Release

### Day 22 - Security review
- [ ] Rà soát toàn bộ quyền endpoint
- [ ] Chặn user bị LOCKED truy cập nhạy cảm
- [ ] Kiểm tra dữ liệu nhạy cảm trong response
- [ ] Bổ sung logging bảo mật cơ bản

### Day 23 - Performance review
- [ ] Rà soát query chậm
- [ ] Kiểm tra index cho cột tìm kiếm/FK
- [ ] Tối ưu pagination/search
- [ ] Kiểm tra N+1 query

### Day 24 - Test tập trung nghiệp vụ chính
- [ ] Test full flow register -> borrow -> return
- [ ] Test case lỗi inventory âm
- [ ] Test concurrent borrow cơ bản
- [ ] Tăng coverage các service quan trọng

### Day 25 - API Docs
- [ ] Hoàn thiện Swagger/OpenAPI
- [ ] Viết mô tả request/response mẫu
- [ ] Gắn mã lỗi cho endpoint quan trọng
- [ ] Soát consistency tài liệu

### Day 26 - Demo data + Postman
- [ ] Chuẩn bị seed data demo
- [ ] Tạo Postman Collection
- [ ] Tạo Environment variables
- [ ] Viết quickstart chạy local

### Day 27 - Optional Reports
- [ ] `GET /api/v1/reports/top-books`
- [ ] `GET /api/v1/reports/top-users`
- [ ] `GET /api/v1/reports/borrowing-books`
- [ ] `GET /api/v1/reports/inventory`

### Day 28 - Regression
- [ ] Chạy full test regression
- [ ] Soát endpoint theo checklist yêu cầu
- [ ] Fix bug ưu tiên cao
- [ ] Chốt candidate release

### Day 29 - Cleanup
- [ ] Refactor phần code trùng lặp
- [ ] Dọn warning/log không cần thiết
- [ ] Chốt README backend cuối
- [ ] Chốt known issues

### Day 30 - Release v1
- [ ] Demo toàn bộ API MVP
- [ ] Bàn giao tài liệu + Postman + SQL
- [ ] Chốt backlog phase 2
- [ ] Retrospective tháng 1

---

## Theo dõi tiến độ tuần
- Tuần 1: [ ] 0% [ ] 25% [ ] 50% [ ] 75% [ ] 100%
- Tuần 2: [ ] 0% [ ] 25% [ ] 50% [ ] 75% [ ] 100%
- Tuần 3: [ ] 0% [ ] 25% [ ] 50% [ ] 75% [ ] 100%
- Tuần 4: [ ] 0% [ ] 25% [ ] 50% [ ] 75% [ ] 100%

---

## Nhật ký blocker/nguy cơ
- Ngày ___: __________________________
- Ngày ___: __________________________
- Ngày ___: __________________________

---

## Tiêu chí chốt dự án backend (Done)
- [ ] Hoàn thành toàn bộ API MVP đã liệt kê
- [ ] Pass test các flow chính (auth/book/inventory/borrow/return)
- [ ] Có tài liệu API + Postman collection
- [ ] Có hướng dẫn chạy local rõ ràng
- [ ] Có dữ liệu seed để demo
