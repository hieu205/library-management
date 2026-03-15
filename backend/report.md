# BÁO CÁO THU THẬP YÊU CẦU NGƯỜI DÙNG
## HỆ THỐNG QUẢN LÝ THƯ VIỆN (LIBRARY MANAGEMENT SYSTEM)

> **Công nghệ:** Java 17 · Spring Boot · Spring Security · Spring Data JPA · MySQL  
> **Ngày lập báo cáo:** 09/03/2026

---

# I. MÔ TẢ HỆ THỐNG

## 1. Mô tả chung về hệ thống và lý do lựa chọn

### 1.1. Mô tả chung

Hệ thống Quản lý Thư viện (Library Management System) là một ứng dụng web backend được xây dựng theo kiến trúc REST API, phục vụ cho công tác vận hành nghiệp vụ của một thư viện vừa và nhỏ. Hệ thống cho phép quản lý toàn bộ vòng đời của một cuốn sách — từ lúc nhập kho, đến khi được độc giả mượn và trả lại — đồng thời cung cấp các chức năng quản trị người dùng, phân quyền truy cập, và theo dõi lịch sử kho.

Backend được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân lớp) với 4 tầng rõ ràng:

| Tầng | Thành phần | Vai trò |
|------|-----------|---------|
| **Presentation** | Controller (`@RestController`) | Nhận HTTP request, trả về JSON response |
| **Business Logic** | Service (`@Service`) | Xử lý nghiệp vụ, validation, tính toán |
| **Data Access** | Repository (`JpaRepository`) | Truy vấn CSDL qua Spring Data JPA |
| **Data** | Entity (`@Entity`) + MySQL | Lưu trữ dữ liệu bền vững |

Cơ sở dữ liệu sử dụng **MySQL** (`library_db`) chạy tại `localhost:3306`. Toàn bộ API được ánh xạ theo tiền tố `/api/v1/`, đáp ứng chuẩn RESTful.

Bảo mật được thực hiện thông qua **Spring Security** với xác thực HTTP Basic và mã hóa mật khẩu bằng **BCrypt**. Dữ liệu trả về được chuẩn hóa qua lớp DTO (Data Transfer Object) nhằm tách biệt hoàn toàn model nội bộ khỏi API công khai.

### 1.2. Lý do lựa chọn

Hệ thống Quản lý Thư viện được lựa chọn vì các lý do sau:

1. **Tính thực tiễn cao:** Thư viện là mô hình nghiệp vụ quen thuộc, dễ hình dung, giúp áp dụng trực tiếp các kiến thức về OOP, CSDL quan hệ và thiết kế API.
2. **Đa dạng nghiệp vụ:** Hệ thống bao gồm nhiều nhóm chức năng phong phú: quản lý danh mục (sách, tác giả, thể loại), quản lý kho hàng, quản lý giao dịch mượn/trả, và quản lý người dùng — cho phép thực hành đầy đủ các kỹ thuật xây dựng REST API.
3. **Chuẩn công nghệ hiện đại:** Stack Java/Spring Boot là lựa chọn phổ biến trong các dự án doanh nghiệp, giúp tích lũy kinh nghiệm thực tế có giá trị nghề nghiệp.
4. **Phù hợp học thuật:** Bài toán mang tính chuẩn mực trong giảng dạy kỹ nghệ phần mềm, với phạm vi đủ lớn để học thiết kế hệ thống nhưng không quá phức tạp để mất kiểm soát.
5. **Khả năng mở rộng:** Sau các chức năng cốt lõi, hệ thống có thể dễ dàng bổ sung thêm: đặt trước sách, thống kê báo cáo, gửi email nhắc nhở hạn trả, v.v.

---

## 2. Khảo sát hệ thống tương tự

### 2.1. Koha — Hệ thống thư viện mã nguồn mở

**Koha** (https://koha-community.org) là một trong những phần mềm quản lý thư viện mã nguồn mở hàng đầu thế giới, được dùng rộng rãi tại các trường đại học và thư viện công cộng.

| Tiêu chí | Koha |
|---------|------|
| Ngôn ngữ | Perl |
| Cơ sở dữ liệu | MySQL / MariaDB |
| Giao diện | Web (tích hợp OPAC cho độc giả và giao diện quản trị riêng) |
| Tính năng nổi bật | Quản lý bản ghi MARC, đặt trước sách, phát hành phiếu phạt, tích hợp Z39.50 |
| Điểm mạnh | Chuẩn thư viện quốc tế, được kiểm định rộng rãi |
| Điểm yếu | Cài đặt phức tạp, công nghệ lỗi thời (Perl), khó tùy chỉnh |

**So sánh với hệ thống đang xây dựng:**  
Hệ thống này tập trung vào REST API hiện đại, thuận tiện tích hợp với frontend SPA (React/Vue) hoặc mobile app. Koha thiên về ứng dụng monolithic truyền thống, không cung cấp REST API chuẩn.

---

### 2.2. OpenLibrary — Nền tảng thư viện số của Internet Archive

**OpenLibrary** (https://openlibrary.org) là dự án thư viện số toàn cầu, cung cấp cả API công khai để tra cứu thông tin sách.

| Tiêu chí | OpenLibrary |
|---------|------------|
| Ngôn ngữ | Python (web.py) |
| Tính năng | Tra cứu sách theo ISBN, tác giả, tiêu đề; cho mượn sách số |
| API | REST API công khai, trả về JSON |
| Điểm mạnh | Kho dữ liệu sách khổng lồ, API phong phú |
| Điểm yếu | Không có module quản lý kho vật lý, không có phân quyền người dùng |

**So sánh:** Hệ thống đang xây dựng bổ sung đầy đủ quản lý kho vật lý (số lượng, nhập/xuất kho), quản lý giao dịch mượn/trả cụ thể theo từng người dùng, và xác thực bảo mật — những tính năng không có trong OpenLibrary.

---

### 2.3. EduLib — Phần mềm quản lý thư viện trường học tại Việt Nam

**EduLib** là phần mềm thương mại phổ biến tại các trường phổ thông và trường đại học ở Việt Nam.

| Tiêu chí | EduLib |
|---------|--------|
| Mô hình | Client–Server (desktop) |
| Tính năng | Quản lý sách, bạn đọc, mượn/trả, báo cáo thống kê |
| Điểm mạnh | Giao diện tiếng Việt, phù hợp nghiệp vụ thư viện Việt Nam |
| Điểm yếu | Proprietary (đóng), không có API, không dùng được trên mobile/web |

**So sánh:** Hệ thống đang phát triển có kiến trúc API-first, dễ dàng mở rộng sang web hay mobile. Đây là ưu điểm lớn so với mô hình desktop truyền thống của EduLib.

---

### 2.4. Tổng hợp điểm khác biệt của hệ thống đang xây dựng

| Tiêu chí | Hệ thống của chúng tôi | Koha | OpenLibrary | EduLib |
|---------|----------------------|------|------------|--------|
| Giao tiếp | REST API (JSON) | Web application | REST API | Desktop GUI |
| Ngôn ngữ | Java / Spring Boot | Perl | Python | .NET |
| Quản lý kho | ✅ Đầy đủ (nhập/xuất, log) | ✅ | ❌ | ✅ |
| Mượn/trả sách | ✅ | ✅ | Sách số | ✅ |
| Phân quyền | ✅ (ROLE_USER / ROLE_ADMIN) | ✅ | ❌ | ✅ |
| Mã nguồn mở | ✅ (project học thuật) | ✅ | ✅ | ❌ |
| Tích hợp mobile/SPA | ✅ Dễ dàng | Khó | ✅ | ❌ |

---

# II. THU THẬP YÊU CẦU

## 1. Bảng thuật ngữ

| STT | Thuật ngữ | Tiếng Anh | Định nghĩa |
|-----|-----------|-----------|-----------|
| 1 | **Sách** | Book | Đơn vị tài liệu trong thư viện, được định danh bằng ISBN, có tiêu đề, mô tả, năm xuất bản, ngôn ngữ. Một cuốn sách có thể có nhiều tác giả và thuộc nhiều thể loại. |
| 2 | **Tác giả** | Author | Người sáng tác cuốn sách. Một tác giả có thể viết nhiều sách và một sách có thể có nhiều tác giả. |
| 3 | **Thể loại** | Category | Nhóm phân loại sách (ví dụ: Văn học, Khoa học, Kỹ thuật). Một sách có thể thuộc nhiều thể loại. |
| 4 | **Người dùng** | User | Cá nhân đã đăng ký tài khoản trong hệ thống. Có hai loại vai trò: Thủ thư (Admin) và Độc giả (User). |
| 5 | **Vai trò** | Role | Nhóm phân quyền xác định khả năng thao tác của người dùng. Hệ thống có hai vai trò: `ADMIN` và `USER`. |
| 6 | **Kho sách** | Inventory | Thông tin về số lượng vật lý của từng đầu sách trong thư viện, bao gồm tổng số lượng (`totalQuantity`) và số lượng còn có thể mượn (`availableQuantity`). |
| 7 | **Nhật ký kho** | Inventory Log | Bản ghi lịch sử mọi thay đổi số lượng kho (nhập, xuất, trả), giúp truy vết và kiểm soát tồn kho. |
| 8 | **Phiếu mượn** | Borrow Record | Giao dịch mượn sách của một người dùng tại một thời điểm, ghi nhận ngày mượn, ngày hết hạn và trạng thái. |
| 9 | **Chi tiết mượn** | Borrow Item | Dòng chi tiết trong một phiếu mượn, chỉ định cuốn sách nào được mượn với số lượng bao nhiêu. |
| 10 | **Nhập kho** | Import | Hành động bổ sung số lượng sách vào kho (tăng `totalQuantity` và `availableQuantity`). |
| 11 | **Xuất kho** | Export | Hành động giảm số lượng sách khỏi kho (giảm `totalQuantity` và `availableQuantity`). |
| 12 | **Trả sách** | Return | Hành động người dùng trả lại sách đã mượn, làm tăng `availableQuantity` trong kho. |
| 13 | **Trạng thái phiếu mượn** | Borrow Status | Trạng thái hiện tại của phiếu mượn: `BORROWING` (đang mượn) hoặc `RETURNED` (đã trả). |
| 14 | **ISBN** | ISBN | International Standard Book Number — mã định danh quốc tế duy nhất cho mỗi đầu sách. |
| 15 | **REST API** | REST API | Giao diện lập trình ứng dụng theo chuẩn REST, giao tiếp qua HTTP với định dạng dữ liệu JSON. |
| 16 | **JWT / HTTP Basic** | Authentication | Cơ chế xác thực danh tính người dùng. Hệ thống hiện dùng HTTP Basic Authentication. |
| 17 | **BCrypt** | BCrypt | Thuật toán băm mật khẩu một chiều, đảm bảo mật khẩu được lưu trữ an toàn trong CSDL. |
| 18 | **DTO** | Data Transfer Object | Đối tượng trung gian dùng để truyền dữ liệu giữa các lớp, tách biệt model nội bộ khỏi API. |
| 19 | **Số lượng có sẵn** | Available Quantity | Số lượng bản sách hiện có thể mượn = `totalQuantity` – số lượng đang được mượn. |
| 20 | **Hạn trả** | Due Date | Ngày người dùng phải trả sách. Mặc định là 14 ngày kể từ ngày mượn nếu không được chỉ định. |

---

## 2. Mô hình nghiệp vụ bằng ngôn ngữ tự nhiên

### 2.1. Mục tiêu và phạm vi hệ thống

**Mục tiêu:**  
Hệ thống Quản lý Thư viện nhằm số hóa và tự động hóa các nghiệp vụ cốt lõi của một thư viện, bao gồm:

- Quản lý danh mục sách (thêm, sửa, xóa, tra cứu sách và thông tin liên quan).
- Quản lý kho sách (theo dõi số lượng, nhập/xuất kho, ghi nhận lịch sử biến động).
- Quản lý hoạt động mượn/trả sách của độc giả.
- Quản lý tài khoản và phân quyền người dùng.

**Phạm vi hệ thống:**  
- Hệ thống là một **REST API backend**, cung cấp dữ liệu dạng JSON.
- Hệ thống phục vụ một thư viện đơn lẻ (không có tính năng đa chi nhánh).
- Không bao gồm: thanh toán trực tuyến, sách điện tử, hệ thống gợi ý sách, hay gửi email tự động.
- Dữ liệu được lưu trữ trên MySQL; backend chạy trên cổng mặc định `8080`.

---

### 2.2. Ai có thể sử dụng phần mềm?

Hệ thống phục vụ hai nhóm người dùng chính:

**Thủ thư / Quản trị viên (Admin):**  
Là nhân viên thư viện có đầy đủ quyền quản trị. Họ chịu trách nhiệm vận hành toàn bộ hệ thống: quản lý danh mục sách, quản lý kho, quản lý tài khoản người dùng, và ghi nhận các phiếu mượn/trả sách.

**Độc giả (User):**  
Là người đọc đã đăng ký tài khoản trong hệ thống. Họ có thể tra cứu thông tin sách, xem thông tin cá nhân của mình và thực hiện các yêu cầu mượn sách.

---

### 2.3. Người dùng có những chức năng gì?

#### Quản trị viên (Admin) có thể:
| Nhóm | Chức năng |
|------|-----------|
| **Quản lý sách** | Thêm sách mới, cập nhật thông tin sách, xóa sách, tìm kiếm sách, thêm tác giả vào sách |
| **Quản lý tác giả** | Thêm tác giả mới |
| **Quản lý thể loại** | Thêm thể loại mới |
| **Quản lý kho** | Khởi tạo kho cho sách, nhập kho (tăng số lượng), xuất kho (giảm số lượng), điều chỉnh số lượng, xem toàn bộ tồn kho, xem lịch sử biến động kho |
| **Quản lý mượn/trả** | Tạo phiếu mượn cho độc giả, xử lý trả sách |
| **Quản lý người dùng** | Tạo tài khoản người dùng mới, cập nhật thông tin, kích hoạt/vô hiệu hóa tài khoản, xem danh sách người dùng |
| **Tài khoản cá nhân** | Xem và cập nhật hồ sơ cá nhân |

#### Độc giả (User) có thể:
| Nhóm | Chức năng |
|------|-----------|
| **Tra cứu sách** | Xem danh sách tất cả sách, xem chi tiết sách theo ID, tìm kiếm sách theo từ khóa |
| **Tài khoản cá nhân** | Đăng ký tài khoản mới, đăng nhập, xem và cập nhật thông tin cá nhân |

#### Người dùng chưa đăng nhập (Anonymous) có thể:
- Đăng ký tài khoản (`POST /api/v1/users/register`)
- Đăng nhập (`POST /api/v1/users/login`)

---

### 2.4. Mỗi chức năng hoạt động ra sao?

#### A. Đăng ký tài khoản
Người dùng cung cấp username (3–50 ký tự, chữ cái/số/gạch dưới), email hợp lệ, mật khẩu (6–100 ký tự), họ tên và số điện thoại. Hệ thống kiểm tra tính duy nhất của username, email, và số điện thoại. Mật khẩu được mã hóa bằng BCrypt trước khi lưu vào CSDL. Tài khoản mới được gán vai trò `USER` mặc định và trạng thái active.

#### B. Đăng nhập
Người dùng cung cấp username và mật khẩu. Hệ thống xác thực qua Spring Security HTTP Basic, kiểm tra tài khoản có tồn tại và đang active không, sau đó trả về thông tin hồ sơ người dùng dưới dạng JSON.

#### C. Thêm sách mới
Quản trị viên cung cấp tiêu đề, mô tả, ISBN (theo định dạng chuẩn), năm xuất bản (1450–2100), ngôn ngữ, danh sách ID tác giả và ID thể loại. Hệ thống kiểm tra ISBN chưa tồn tại, tạo bản ghi `Book`, thiết lập quan hệ `BookAuthor` và `BookCategory`, đồng thời tự động khởi tạo bản ghi `Inventory` với số lượng ban đầu bằng 0.

#### D. Nhập kho sách
Quản trị viên chỉ định ID sách và số lượng nhập (tối thiểu 1). Hệ thống tăng `totalQuantity` và `availableQuantity` trong bảng `Inventory`, đồng thời tạo bản ghi `InventoryLog` với `changeType = IMPORT` để lưu vết.

#### E. Xuất kho sách
Tương tự nhập kho nhưng giảm số lượng. Hệ thống kiểm tra `availableQuantity` có đủ để xuất không (không cho phép xuất quá số sách có sẵn). Ghi log với `changeType = EXPORT`.

#### F. Tạo phiếu mượn
Quản trị viên tạo phiếu mượn thay mặt độc giả, chỉ định danh sách sách cần mượn cùng số lượng và ngày hết hạn (mặc định 14 ngày kể từ hôm nay nếu không khai báo). Hệ thống kiểm tra từng đầu sách có đủ `availableQuantity` không, sau đó tạo bản ghi `BorrowRecord` (trạng thái `BORROWING`) và các `BorrowItem` tương ứng. `availableQuantity` trong kho được giảm theo số lượng mượn, hành động này được ghi log với `changeType = EXPORT`.

#### G. Trả sách
Quản trị viên xử lý trả sách bằng cách chỉ định phiếu mượn và danh sách sách trả kèm số lượng trả. Hệ thống cập nhật `returnedQuantity` trong `BorrowItem`, tăng `availableQuantity` trong kho, ghi log với `changeType = RETURN`. Nếu tất cả sách trong phiếu đã được trả đủ, trạng thái `BorrowRecord` chuyển sang `RETURNED`.

#### H. Tìm kiếm sách
Người dùng cung cấp từ khóa (`keyword`). Hệ thống thực hiện truy vấn full-text tìm kiếm trên tiêu đề, mô tả, ISBN, tên tác giả và tên thể loại; trả về danh sách sách phù hợp kèm đầy đủ thông tin tác giả và thể loại.

#### I. Vô hiệu hóa / Kích hoạt tài khoản
Quản trị viên cập nhật trường `is_active` của người dùng. Tài khoản bị vô hiệu hóa sẽ không thể đăng nhập.

#### J. Xem lịch sử kho
Quản trị viên xem toàn bộ lịch sử biến động kho hoặc lọc theo sách cụ thể. Mỗi bản ghi log hiển thị: loại thay đổi, số lượng thay đổi, tổng số lượng sau thay đổi, số lượng có sẵn sau thay đổi, ghi chú.

---

### 2.5. Những thông tin / đối tượng mà hệ thống cần xử lý

| Đối tượng | Thuộc tính chính |
|-----------|-----------------|
| **Book** | id, title, description, isbn, publishYear, language, createdAt, updatedAt |
| **Author** | id, name, biography |
| **Category** | id, name, description |
| **User** | id, username, email, password (BCrypt), fullName, phone, roleId, isActive, createdAt, updatedAt |
| **Role** | id, name (`ADMIN` / `USER`) |
| **Inventory** | id, bookId, totalQuantity, availableQuantity, changeType, createdAt, updatedAt |
| **InventoryLog** | id, bookId, changeType, quantityChanged, totalAfter, availableAfter, note, createdAt |
| **BorrowRecord** | id, userId, borrowDate, dueDate, status (`BORROWING`/`RETURNED`), createdAt |
| **BorrowItem** | id, borrowRecordId, bookId, quantity, returnedQuantity |
| **BookAuthor** | bookId, authorId (bảng trung gian nhiều-nhiều) |
| **BookCategory** | bookId, categoryId (bảng trung gian nhiều-nhiều) |

---

### 2.6. Quan hệ giữa các đối tượng

- **Book ↔ Author**: Quan hệ **nhiều–nhiều** (M:N) thông qua bảng trung gian `BookAuthor`. Một sách có thể có nhiều tác giả; một tác giả có thể viết nhiều sách.
- **Book ↔ Category**: Quan hệ **nhiều–nhiều** (M:N) thông qua bảng trung gian `BookCategory`. Một sách thuộc nhiều thể loại; một thể loại chứa nhiều sách.
- **Book ↔ Inventory**: Quan hệ **một–một** (1:1). Mỗi đầu sách có đúng một bản ghi kho.
- **Book ↔ InventoryLog**: Quan hệ **một–nhiều** (1:N). Một đầu sách có thể có nhiều bản ghi nhật ký biến động kho.
- **User ↔ Role**: Quan hệ **nhiều–một** (N:1). Nhiều người dùng có thể có cùng một vai trò.
- **User ↔ BorrowRecord**: Quan hệ **một–nhiều** (1:N). Một người dùng có thể có nhiều phiếu mượn.
- **BorrowRecord ↔ BorrowItem**: Quan hệ **một–nhiều** (1:N). Một phiếu mượn gồm nhiều dòng chi tiết sách.
- **BorrowItem ↔ Book**: Quan hệ **nhiều–một** (N:1). Nhiều dòng chi tiết mượn có thể tham chiếu đến cùng một đầu sách (trong các phiếu khác nhau).

---

## 3. Mô hình nghiệp vụ bằng UML

### 3.1. Xác định các Actor của hệ thống

| Actor | Mô tả |
|-------|-------|
| **Anonymous User** | Khách chưa đăng nhập. Chỉ có thể đăng ký và đăng nhập. |
| **User (Độc giả)** | Người dùng đã xác thực với vai trò `USER`. Tra cứu sách, xem/cập nhật thông tin cá nhân. |
| **Admin (Thủ thư)** | Người dùng đã xác thực với vai trò `ADMIN`. Có đầy đủ quyền quản trị hệ thống. |
| **Spring Security** | Actor hệ thống, thực hiện xác thực và phân quyền tự động. |
| **MySQL Database** | Hệ thống lưu trữ dữ liệu bền vững. |

---

### 3.2. Sơ đồ Use Case (mô tả dạng văn bản)

```
+----------------------------------------------------------+
|              HỆ THỐNG QUẢN LÝ THƯ VIỆN                  |
|                                                          |
|  [Anonymous User]                                        |
|    |-- UC01: Đăng ký tài khoản                           |
|    |-- UC02: Đăng nhập                                   |
|                                                          |
|  [User - Độc giả]                                        |
|    |-- UC02: Đăng nhập                                   |
|    |-- UC03: Xem danh sách sách                          |
|    |-- UC04: Xem chi tiết sách                           |
|    |-- UC05: Tìm kiếm sách theo từ khóa                  |
|    |-- UC06: Xem hồ sơ cá nhân                           |
|    |-- UC07: Cập nhật hồ sơ cá nhân                      |
|                                                          |
|  [Admin - Thủ thư]                                       |
|    |-- UC02: Đăng nhập                                   |
|    |-- UC06: Xem hồ sơ cá nhân                           |
|    |-- UC07: Cập nhật hồ sơ cá nhân                      |
|    |                                                     |
|    |   [Quản lý Sách]                                    |
|    |-- UC08: Thêm sách mới                               |
|    |-- UC09: Cập nhật thông tin sách                     |
|    |-- UC10: Xóa sách                                    |
|    |-- UC03: Xem danh sách sách                          |
|    |-- UC04: Xem chi tiết sách                           |
|    |-- UC05: Tìm kiếm sách                               |
|    |-- UC11: Thêm tác giả vào sách                       |
|    |                                                     |
|    |   [Quản lý Tác giả]                                 |
|    |-- UC12: Thêm tác giả mới                            |
|    |                                                     |
|    |   [Quản lý Thể loại]                                |
|    |-- UC13: Thêm thể loại mới                           |
|    |                                                     |
|    |   [Quản lý Kho]                                     |
|    |-- UC14: Nhập kho sách                               |
|    |-- UC15: Xuất kho sách                               |
|    |-- UC16: Tăng số lượng kho                           |
|    |-- UC17: Xem tất cả tồn kho                          |
|    |-- UC18: Xem tồn kho theo sách                       |
|    |-- UC19: Xem toàn bộ lịch sử kho                     |
|    |-- UC20: Xem lịch sử kho theo sách                   |
|    |                                                     |
|    |   [Quản lý Mượn/Trả]                                |
|    |-- UC21: Tạo phiếu mượn                              |
|    |-- UC22: Xử lý trả sách                              |
|    |                                                     |
|    |   [Quản lý Người dùng]                              |
|    |-- UC01: Đăng ký tài khoản (thay mặt)                |
|    |-- UC23: Tạo người dùng mới (admin)                  |
|    |-- UC24: Cập nhật thông tin người dùng               |
|    |-- UC25: Kích hoạt / Vô hiệu hóa tài khoản           |
|    |-- UC26: Xem danh sách người dùng                    |
+----------------------------------------------------------+
```

---

### 3.3. Các Use Case cho từng Actor

#### Actor: Anonymous User

| Use Case ID | Tên Use Case | Mô tả ngắn |
|------------|--------------|-----------|
| UC01 | Đăng ký tài khoản | Tạo tài khoản mới với username, email, mật khẩu, họ tên, số điện thoại. |
| UC02 | Đăng nhập | Xác thực bằng username/password; nhận thông tin profile nếu thành công. |

#### Actor: User (Độc giả)

| Use Case ID | Tên Use Case | Mô tả ngắn |
|------------|--------------|-----------|
| UC02 | Đăng nhập | Xác thực tài khoản bằng username và mật khẩu. |
| UC03 | Xem danh sách sách | Lấy toàn bộ danh sách sách có trong thư viện. |
| UC04 | Xem chi tiết sách | Xem thông tin đầy đủ một cuốn sách theo ID. |
| UC05 | Tìm kiếm sách | Tìm sách theo từ khóa (tiêu đề, tác giả, thể loại, ISBN). |
| UC06 | Xem hồ sơ cá nhân | Xem thông tin tài khoản của bản thân. |
| UC07 | Cập nhật hồ sơ cá nhân | Chỉnh sửa username, email, họ tên, số điện thoại của bản thân. |

#### Actor: Admin (Thủ thư)

| Use Case ID | Tên Use Case | Endpoint | Mô tả ngắn |
|------------|--------------|---------|-----------|
| UC02 | Đăng nhập | `POST /api/v1/users/login` | Xác thực và lấy thông tin tài khoản. |
| UC06 | Xem hồ sơ | `GET /api/v1/users/me` | Xem profile của chính mình. |
| UC07 | Cập nhật hồ sơ | `PUT /api/v1/users/me` | Chỉnh sửa thông tin cá nhân. |
| UC08 | Thêm sách | `POST /api/v1/books` | Tạo sách mới với đầy đủ thông tin. |
| UC09 | Cập nhật sách | `PUT /api/v1/books/{id}` | Sửa thông tin một cuốn sách. |
| UC10 | Xóa sách | `DELETE /api/v1/books/{id}` | Xóa một cuốn sách khỏi hệ thống. |
| UC03 | Xem danh sách sách | `GET /api/v1/books` | Lấy toàn bộ sách. |
| UC04 | Xem chi tiết sách | `GET /api/v1/books/{id}` | Xem thông tin chi tiết sách. |
| UC05 | Tìm kiếm sách | `GET /api/v1/books/search?keyword=` | Tìm kiếm theo từ khóa. |
| UC11 | Thêm tác giả vào sách | `POST /api/v1/books/{id}/authors` | Liên kết tác giả với sách. |
| UC12 | Thêm tác giả | `POST /api/v1/authors` | Tạo bản ghi tác giả mới. |
| UC13 | Thêm thể loại | `POST /api/v1/categories` | Tạo thể loại sách mới. |
| UC14 | Nhập kho | `POST /api/v1/inventory/add` | Bổ sung số lượng sách vào kho. |
| UC15 | Xuất kho | `PATCH /api/v1/inventory/decrease` | Giảm số lượng sách trong kho. |
| UC16 | Tăng số lượng kho | `PATCH /api/v1/inventory/increase` | Tăng số lượng có sẵn (sau khi trả). |
| UC17 | Xem tất cả tồn kho | `GET /api/v1/inventory` | Xem toàn bộ tồn kho tất cả sách. |
| UC18 | Xem tồn kho theo sách | `GET /api/v1/inventory/{bookId}` | Xem tồn kho một đầu sách cụ thể. |
| UC19 | Xem lịch sử kho | `GET /api/v1/inventory/logs` | Xem toàn bộ nhật ký biến động kho. |
| UC20 | Lịch sử kho theo sách | `GET /api/v1/inventory/logs/{bookId}` | Xem lịch sử kho theo từng sách. |
| UC21 | Tạo phiếu mượn | `POST /api/v1/borrow` | Ghi nhận giao dịch mượn sách. |
| UC22 | Xử lý trả sách | `POST /api/v1/borrow/{borrowId}/return` | Xử lý trả sách và cập nhật kho. |
| UC23 | Tạo người dùng | `POST /api/v1/users` | Admin tạo tài khoản mới. |
| UC24 | Cập nhật người dùng | `PUT /api/v1/users/{id}` | Cập nhật thông tin người dùng. |
| UC25 | Kích hoạt/vô hiệu hóa | `PATCH /api/v1/users/{id}/status` | Bật/tắt trạng thái tài khoản. |
| UC26 | Xem danh sách user | `GET /api/v1/users` | Lấy danh sách tất cả người dùng. |

---

## 4. Bảng yêu cầu người dùng

### Chú thích mức độ ưu tiên:
- **Cao**: Cần thiết cho hoạt động cơ bản của hệ thống (Must Have).
- **Trung bình**: Tăng tính tiện dụng và đầy đủ của hệ thống (Should Have).
- **Thấp**: Cải thiện trải nghiệm, có thể bổ sung sau (Could Have).

---

### Nhóm 1: Quản lý tài khoản và xác thực

| ID | Mô tả yêu cầu | Độ ưu tiên | Use Case liên quan |
|----|--------------|-----------|-------------------|
| UR-01 | Hệ thống cho phép người dùng mới đăng ký tài khoản với username (3–50 ký tự, duy nhất), email hợp lệ (duy nhất), mật khẩu (tối thiểu 6 ký tự), họ tên (2–200 ký tự) và số điện thoại (duy nhất). | Cao | UC01 |
| UR-02 | Hệ thống phải mã hóa mật khẩu người dùng bằng BCrypt trước khi lưu vào cơ sở dữ liệu. Không được lưu mật khẩu dưới dạng plaintext. | Cao | UC01 |
| UR-03 | Hệ thống cho phép người dùng đăng nhập bằng username và mật khẩu. Chỉ tài khoản đang active mới được đăng nhập thành công. | Cao | UC02 |
| UR-04 | Sau khi đăng nhập thành công, hệ thống trả về thông tin hồ sơ người dùng (không bao gồm mật khẩu). | Cao | UC02 |
| UR-05 | Người dùng đã đăng nhập có thể xem thông tin hồ sơ cá nhân của mình (`GET /api/v1/users/me`). | Cao | UC06 |
| UR-06 | Người dùng đã đăng nhập có thể cập nhật username, email, họ tên, số điện thoại của chính mình. | Trung bình | UC07 |
| UR-07 | Admin có thể tạo tài khoản người dùng mới với đầy đủ thông tin. | Trung bình | UC23 |
| UR-08 | Admin có thể cập nhật thông tin bất kỳ tài khoản người dùng nào theo ID. | Trung bình | UC24 |
| UR-09 | Admin có thể kích hoạt hoặc vô hiệu hóa tài khoản người dùng. Tài khoản bị vô hiệu hóa không thể đăng nhập. | Cao | UC25 |
| UR-10 | Admin có thể xem danh sách tất cả người dùng trong hệ thống. | Trung bình | UC26 |

---

### Nhóm 2: Quản lý sách

| ID | Mô tả yêu cầu | Độ ưu tiên | Use Case liên quan |
|----|--------------|-----------|-------------------|
| UR-11 | Admin có thể thêm sách mới với thông tin: tiêu đề (bắt buộc), mô tả, ISBN (theo định dạng chuẩn, duy nhất), năm xuất bản (1450–2100), ngôn ngữ, danh sách ID tác giả và ID thể loại. | Cao | UC08 |
| UR-12 | Khi tạo sách mới, hệ thống tự động tạo bản ghi Inventory tương ứng với số lượng khởi đầu bằng 0. | Cao | UC08 |
| UR-13 | Admin có thể cập nhật thông tin sách (tiêu đề, mô tả, ISBN, năm xuất bản, ngôn ngữ, tác giả, thể loại) theo ID sách. | Cao | UC09 |
| UR-14 | Admin có thể xóa sách theo ID. Hệ thống phải xóa các quan hệ liên quan (tác giả, thể loại) theo kiểu cascade. | Cao | UC10 |
| UR-15 | Mọi người dùng (kể cả chưa đăng nhập) có thể xem danh sách tất cả sách kèm thông tin tác giả và thể loại. | Cao | UC03 |
| UR-16 | Mọi người dùng có thể xem chi tiết một cuốn sách theo ID. | Cao | UC04 |
| UR-17 | Mọi người dùng có thể tìm kiếm sách theo từ khóa — hệ thống tìm khớp trên tiêu đề, mô tả, ISBN, tên tác giả và tên thể loại (không phân biệt hoa thường). | Cao | UC05 |
| UR-18 | Admin có thể thêm tác giả vào sách thông qua danh sách ID tác giả. Không cho phép thêm tác giả trùng lặp vào cùng một sách. | Trung bình | UC11 |

---

### Nhóm 3: Quản lý tác giả và thể loại

| ID | Mô tả yêu cầu | Độ ưu tiên | Use Case liên quan |
|----|--------------|-----------|-------------------|
| UR-19 | Admin có thể thêm tác giả mới với tên (2–255 ký tự, bắt buộc, duy nhất) và tiểu sử (tùy chọn, tối đa 5000 ký tự). | Cao | UC12 |
| UR-20 | Hệ thống không cho phép tạo hai tác giả có cùng tên (không phân biệt hoa thường). | Cao | UC12 |
| UR-21 | Admin có thể thêm thể loại mới với tên (2–200 ký tự, bắt buộc, duy nhất) và mô tả (tùy chọn). | Cao | UC13 |
| UR-22 | Hệ thống không cho phép tạo hai thể loại có cùng tên (không phân biệt hoa thường). | Cao | UC13 |

---

### Nhóm 4: Quản lý kho sách

| ID | Mô tả yêu cầu | Độ ưu tiên | Use Case liên quan |
|----|--------------|-----------|-------------------|
| UR-23 | Admin có thể nhập kho (bổ sung số lượng) cho một đầu sách. Thao tác tăng cả `totalQuantity` lẫn `availableQuantity`. | Cao | UC14 |
| UR-24 | Admin có thể xuất kho (giảm số lượng) cho một đầu sách. Hệ thống phải kiểm tra `availableQuantity` ≥ số lượng xuất; không cho phép xuất kho âm. | Cao | UC15 |
| UR-25 | Admin có thể tăng số lượng sách có sẵn trong kho (ví dụ, sau khi nhận sách trả về theo cách thủ công). | Trung bình | UC16 |
| UR-26 | Mọi thao tác thay đổi số lượng kho (nhập, xuất, trả) phải được ghi lại trong `InventoryLog` với đầy đủ thông tin: loại thay đổi, số lượng thay đổi, tổng số lượng và số lượng có sẵn sau thay đổi, ghi chú. | Cao | UC14, UC15, UC16 |
| UR-27 | Admin có thể xem danh sách tồn kho của tất cả đầu sách (số lượng tổng và có sẵn). | Cao | UC17 |
| UR-28 | Admin có thể xem tồn kho của một đầu sách cụ thể theo `bookId`. | Trung bình | UC18 |
| UR-29 | Admin có thể xem toàn bộ nhật ký biến động kho, sắp xếp theo thời gian giảm dần. | Trung bình | UC19 |
| UR-30 | Admin có thể xem nhật ký biến động kho của một đầu sách cụ thể theo `bookId`. | Trung bình | UC20 |

---

### Nhóm 5: Quản lý mượn/trả sách

| ID | Mô tả yêu cầu | Độ ưu tiên | Use Case liên quan |
|----|--------------|-----------|-------------------|
| UR-31 | Admin có thể tạo phiếu mượn gồm danh sách sách kèm số lượng mượn và ngày hết hạn. Nếu không cung cấp ngày hết hạn, mặc định là 14 ngày kể từ ngày tạo phiếu. | Cao | UC21 |
| UR-32 | Khi tạo phiếu mượn, hệ thống phải kiểm tra từng đầu sách có đủ `availableQuantity` không. Nếu bất kỳ sách nào không đủ, hệ thống từ chối toàn bộ yêu cầu mượn và trả về thông báo lỗi rõ ràng. | Cao | UC21 |
| UR-33 | Sau khi tạo phiếu mượn thành công, `availableQuantity` trong kho của từng sách được mượn phải được giảm tương ứng và ghi log. | Cao | UC21 |
| UR-34 | Phiếu mượn mới được tạo với trạng thái `BORROWING`. | Cao | UC21 |
| UR-35 | Admin có thể xử lý trả sách theo phiếu mượn, chỉ định từng sách và số lượng trả. Số lượng trả không được vượt quá số lượng đã mượn. | Cao | UC22 |
| UR-36 | Khi xử lý trả sách, hệ thống tăng `availableQuantity` trong kho tương ứng và ghi log với `changeType = RETURN`. | Cao | UC22 |
| UR-37 | Khi toàn bộ sách trong phiếu mượn đã được trả đủ số lượng, trạng thái phiếu mượn tự động chuyển sang `RETURNED`. | Cao | UC22 |
| UR-38 | Hệ thống phải hỗ trợ trả sách theo nhiều lần (trả một phần), không yêu cầu trả tất cả sách trong phiếu chỉ trong một lần. | Trung bình | UC22 |

---

### Nhóm 6: Yêu cầu phi chức năng

| ID | Mô tả yêu cầu | Độ ưu tiên | Loại |
|----|--------------|-----------|------|
| UR-39 | Hệ thống phải trả về phản hồi JSON nhất quán với cấu trúc `ApiResponse<T>` gồm `success`, `message` và `data` cho mọi endpoint. | Cao | Phi chức năng – Giao tiếp API |
| UR-40 | Hệ thống phải xử lý và trả về thông báo lỗi rõ ràng (validation error, not found, conflict) thông qua `GlobalException` handler. | Cao | Phi chức năng – Xử lý lỗi |
| UR-41 | Dữ liệu đầu vào của tất cả API phải được validate (kiểm tra hợp lệ) trước khi xử lý nghiệp vụ. Lỗi validation phải trả về HTTP 400. | Cao | Phi chức năng – Bảo mật |
| UR-42 | Mật khẩu người dùng phải được lưu dưới dạng mã băm BCrypt, không được lưu plaintext. | Cao | Phi chức năng – Bảo mật |
| UR-43 | Endpoint `/api/v1/users/me` chỉ được truy cập khi đã xác thực (authenticated). | Cao | Phi chức năng – Bảo mật |
| UR-44 | Các thao tác thay đổi CSDL (tạo phiếu mượn, xử lý trả, nhập/xuất kho, tạo sách) phải được thực thi trong transaction để đảm bảo tính toàn vẹn dữ liệu. | Cao | Phi chức năng – Toàn vẹn dữ liệu |
| UR-45 | Hệ thống cần hỗ trợ tìm kiếm sách full-text hiệu quả trên nhiều trường dữ liệu (tiêu đề, mô tả, ISBN, tên tác giả, tên thể loại). | Trung bình | Phi chức năng – Hiệu năng |
| UR-46 | API phải tuân theo quy ước RESTful (sử dụng đúng HTTP method: GET để đọc, POST để tạo mới, PUT để cập nhật toàn bộ, PATCH để cập nhật một phần, DELETE để xóa). | Trung bình | Phi chức năng – Thiết kế API |

---

*Hết tài liệu thu thập yêu cầu người dùng.*
