# Library Management Backend - Kế hoạch hoàn thành trong 1 tháng

## 1) Mục tiêu dự án
Xây dựng backend cho hệ thống quản lý thư viện bằng Spring Boot, cung cấp API phục vụ:
- Quản lý người dùng và xác thực
- Quản lý sách, tác giả, thể loại
- Quản lý tồn kho và lịch sử thay đổi kho
- Mượn/trả sách theo luồng nghiệp vụ
- Tìm kiếm, lịch sử mượn, quá hạn
- (Tùy chọn) báo cáo thống kê

Mục tiêu cuối tháng:
- Hoàn thiện API core chạy ổn định
- Có dữ liệu mẫu, tài liệu API, test cơ bản
- Sẵn sàng tích hợp frontend

---

## 2) Phạm vi (Scope)

### 2.1. Phạm vi bắt buộc (MVP)
1. **User Management + Auth**
   - Admin/Librarian: CRUD user cơ bản + khóa user
   - User: register, login, xem/cập nhật profile
2. **Book Management**
   - CRUD book
   - Tạo author/category
   - Gán author/category cho book
   - Danh sách + chi tiết book
3. **Inventory Management**
   - Nhập thêm sách
   - Điều chỉnh tồn kho
   - Xem tồn kho tổng và theo sách
   - Xem log thay đổi kho
4. **Borrow/Return**
   - Tạo lượt mượn
   - Xem danh sách + chi tiết borrow
   - Trả sách
5. **Search**
   - Search theo keyword (title/author/category)
   - Search theo ISBN
6. **Borrow History + Overdue**
   - Lịch sử mượn của user
   - Danh sách đang mượn
   - Danh sách quá hạn

### 2.2. Phạm vi tùy chọn (nếu còn thời gian)
- Reports:
  - Top books
  - Top users
  - Borrowing books
  - Inventory report

### 2.3. Ngoài phạm vi tháng đầu
- Tích hợp thanh toán/phạt trễ hạn tự động
- Realtime notification nâng cao
- Event-driven architecture/microservices

---

## 3) Phân tích vai trò và phân quyền

### Vai trò
- **ADMIN**: quản lý user, xem toàn hệ thống
- **LIBRARIAN**: quản lý sách, kho, mượn/trả
- **USER**: đăng ký/đăng nhập, xem profile, mượn/trả theo quyền, xem lịch sử

### Ma trận quyền (rút gọn)
- `POST /api/v1/users` -> ADMIN
- `PUT /api/v1/users/{id}` -> ADMIN
- `PATCH /api/v1/users/{id}/status` -> ADMIN
- `GET /api/v1/users` -> ADMIN/LIBRARIAN
- `POST /api/v1/auth/register` -> Public
- `POST /api/v1/auth/login` -> Public
- `GET/PUT /api/v1/users/me` -> USER/ADMIN/LIBRARIAN
- Book/Inventory/Borrow admin nghiệp vụ -> LIBRARIAN (hoặc ADMIN)
- `GET /api/v1/users/me/*` -> USER

Khuyến nghị: triển khai bằng Spring Security + JWT + `@PreAuthorize`.

---

## 4) Kiến trúc backend đề xuất

### 4.1. Kiến trúc lớp
- `controller`: nhận request/response
- `service`: xử lý nghiệp vụ
- `repository`: JPA truy cập DB
- `entity`: ánh xạ bảng
- `dto.request` / `dto.response`: chuẩn hóa input/output
- `config`: security, CORS, OpenAPI
- `handleException`: Global exception handler

### 4.2. Luồng xử lý chuẩn
1. Request -> Controller
2. Validate DTO (`@Valid`)
3. Service xử lý nghiệp vụ + transaction
4. Repository thao tác DB
5. Trả response chuẩn JSON

### 4.3. Nguyên tắc kỹ thuật
- RESTful endpoint + versioning `/api/v1`
- Dùng transaction cho nghiệp vụ nhiều bước (borrow/return)
- Không trả trực tiếp entity ra ngoài API
- Dùng enum cho `status` (user/borrow/change_type)
- Soft-lock user bằng status (ACTIVE/INACTIVE/LOCKED)

---

## 5) Thiết kế dữ liệu (Database)

Bạn đã có `database.sql` tốt cho MVP. Khuyến nghị chuẩn hóa thêm trong code:
- Đồng bộ tên cột thời gian (`created_at`, `updated_at`)
- Ràng buộc quantity không âm
- `borrow_items` unique `(borrow_record_id, book_id)`
- Index cho cột search và foreign key

Bảng chính:
- `users`, `roles`
- `books`, `authors`, `categories`
- `book_authors`, `book_categories`
- `inventory`, `inventory_logs`
- `borrow_records`, `borrow_items`

---

## 6) Thiết kế API và tiêu chuẩn response

## 6.1. Mẫu response thành công
```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### 6.2. Mẫu response lỗi
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email is invalid" }
  ]
}
```

### 6.3. HTTP status khuyến nghị
- `200`/`201`: thành công
- `400`: validate lỗi
- `401`: chưa xác thực
- `403`: không đủ quyền
- `404`: không tìm thấy
- `409`: conflict dữ liệu
- `500`: lỗi hệ thống

---

## 7) Luồng nghiệp vụ quan trọng

### 7.1. Borrow flow
1. User gửi danh sách sách + số lượng
2. Validate user active
3. Kiểm tra tồn kho từng sách
4. Tạo `borrow_record`
5. Tạo `borrow_items`
6. Trừ `inventory.available_quantity`
7. Ghi `inventory_logs` (`BORROW`)
8. Commit transaction

### 7.2. Return flow
1. Nhận `borrowId` + danh sách trả
2. Validate borrow record đang BORROWING
3. Cập nhật `returned_quantity`
4. Tăng `inventory.available_quantity`
5. Ghi `inventory_logs` (`RETURN`)
6. Nếu trả đủ -> update borrow status thành `RETURNED`
7. Commit transaction

### 7.3. Overdue flow
- Điều kiện: `due_date < current_date` và `status = BORROWING`
- API `GET /api/v1/borrow/overdue`

---

## 8) Kế hoạch triển khai 1 tháng (4 tuần)

## Tuần 1 - Foundation + Auth + User
**Mục tiêu:** dựng khung backend chạy ổn định.

- Day 1:
  - Chốt yêu cầu nghiệp vụ, naming convention, coding style
  - Hoàn thiện `application.properties` theo môi trường local
- Day 2:
  - Hoàn thiện entity/repository cơ bản
  - Tạo migration SQL hoặc xác nhận DB script
- Day 3:
  - Cấu hình Spring Security + JWT
  - Implement `register`, `login`
- Day 4:
  - Implement `users/me` và update profile
- Day 5:
  - Admin API: tạo/cập nhật/khóa/list user
  - Thêm test unit/integration cơ bản
- Day 6:
  - Refactor + chuẩn hóa exception/response
- Day 7:
  - Buffer/fix bug + tài liệu API tuần 1

**Deliverable tuần 1:** Auth + User API chạy được end-to-end.

## Tuần 2 - Book + Author + Category + Search
**Mục tiêu:** hoàn thiện domain sách.

- Day 8-9:
  - CRUD books
  - Create author/category
- Day 10:
  - Gán author cho book
  - Gán category cho book
- Day 11:
  - API list/detail books + pagination
- Day 12:
  - Search theo keyword (title/author/category)
  - Search theo ISBN
- Day 13:
  - Viết test cho book module
- Day 14:
  - Buffer/fix bug

**Deliverable tuần 2:** Book APIs đầy đủ + search hoạt động.

## Tuần 3 - Inventory + Borrow + Return
**Mục tiêu:** hoàn thiện nghiệp vụ cốt lõi thư viện.

- Day 15-16:
  - Inventory add/adjust/get/list logs
- Day 17-18:
  - Borrow API + transaction + kiểm tra tồn kho
- Day 19:
  - Return API + cập nhật returned_quantity + inventory logs
- Day 20:
  - Borrow list/detail + me/history + current-borrows
- Day 21:
  - Overdue endpoint

**Deliverable tuần 3:** Nghiệp vụ mượn trả hoàn chỉnh.

## Tuần 4 - Hardening + Docs + Deploy readiness
**Mục tiêu:** ổn định để demo/handover.

- Day 22:
  - Rà soát bảo mật, permission endpoint
- Day 23:
  - Tối ưu query/index, kiểm tra N+1
- Day 24:
  - Hoàn thiện test case quan trọng (happy + edge + error)
- Day 25:
  - Viết Swagger/OpenAPI đầy đủ
- Day 26:
  - Chuẩn bị Postman collection + seed data
- Day 27:
  - Nếu còn thời gian: Reports (top-books, top-users...)
- Day 28:
  - Regression test toàn hệ thống
- Day 29:
  - Fix cuối + cleanup code
- Day 30:
  - Chốt release backend v1 + tài liệu bàn giao

**Deliverable tuần 4:** backend sẵn sàng tích hợp frontend/QA.

---

## 9) Danh sách task kỹ thuật chi tiết

### 9.1. Bắt buộc
- [ ] Base project structure chuẩn layered architecture
- [ ] JWT auth + refresh strategy (nếu cần)
- [ ] Global exception handler + response wrapper
- [ ] Validation cho request DTO
- [ ] Pagination/sorting cho API list
- [ ] Transaction cho borrow/return
- [ ] Audit fields (`created_at`, `updated_at`)
- [ ] Logging chuẩn (info/warn/error)

### 9.2. Chất lượng mã nguồn
- [ ] Unit test service quan trọng
- [ ] Integration test endpoint chính
- [ ] Static code check (nếu có)
- [ ] README backend + run guide

---

## 10) Test strategy

### 10.1. Test mức API
- Auth: register/login token hợp lệ
- User: role-based access
- Book: CRUD + mapping author/category
- Inventory: add/adjust không để âm
- Borrow/Return: đúng số lượng, đúng status
- Overdue: trả đúng danh sách

### 10.2. Test case đặc biệt
- Mượn vượt tồn kho -> phải fail
- User bị khóa vẫn login? -> phải fail
- Trả nhiều hơn đã mượn -> phải fail
- Dữ liệu trùng unique (username/email/isbn) -> conflict

---

## 11) Rủi ro và cách giảm rủi ro
- **Rủi ro:** phức tạp nghiệp vụ borrow/return
  - **Giảm thiểu:** viết test sớm cho transaction flow
- **Rủi ro:** lệch DB schema và entity
  - **Giảm thiểu:** chốt naming + migration ngay tuần 1
- **Rủi ro:** thiếu thời gian cho report
  - **Giảm thiểu:** đưa report vào optional, chỉ làm khi core ổn
- **Rủi ro:** lỗi phân quyền
  - **Giảm thiểu:** test ma trận quyền theo vai trò

---

## 12) Tiêu chí hoàn thành (Definition of Done)
- Tất cả API core trong scope MVP hoạt động theo đặc tả
- Pass test các luồng chính (auth, user, book, inventory, borrow/return)
- Có tài liệu API (Swagger/Postman)
- Có hướng dẫn cài đặt/chạy local rõ ràng
- Có seed data để demo

---

## 13) Gợi ý cấu trúc thư mục backend
```text
src/main/java/com/example/demo
  ├── config
  ├── controller
  ├── dto
  │   ├── request
  │   └── response
  ├── entity
  ├── repository
  ├── service
  │   └── impl
  ├── security
  └── handleException
```

---

## 14) Lộ trình thực thi nhanh (Action ngay hôm nay)
1. Chốt enum trạng thái: user/borrow/inventory_change_type
2. Chốt response format chung + global exception handler
3. Bắt đầu tuần 1: Auth + User API trước
4. Mỗi ngày cuối ngày cập nhật checklist + issue phát sinh

---

## 15) Ghi chú cho phần frontend
Frontend có thể xử lý hiển thị overdue bằng so sánh thời gian, nhưng backend vẫn nên có endpoint overdue để:
- Dễ dùng cho dashboard/admin
- Giảm logic trùng ở nhiều màn hình
- Đảm bảo cùng một chuẩn nghiệp vụ
