-- =========================================
-- Library Management System - Database Schema
-- Aligned with JPA entities | March 2026
-- =========================================

CREATE DATABASE IF NOT EXISTS library_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE library_db;

-- =========================================
-- DROP TABLES (đúng thứ tự phụ thuộc)
-- =========================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS borrow_items;
DROP TABLE IF EXISTS borrow_records;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS book_categories;
DROP TABLE IF EXISTS book_authors;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- ROLES
-- Entity: Role.java | Table: roles
-- =========================================
CREATE TABLE roles (
    id   BIGINT      AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- =========================================
-- USERS
-- Entity: User.java | Table: users
-- =========================================
CREATE TABLE users (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    full_name  VARCHAR(200),
    phone      VARCHAR(50),
    role_id    BIGINT       NOT NULL,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,

    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =========================================
-- AUTHORS
-- Entity: Author.java | Table: authors
-- =========================================
CREATE TABLE authors (
    id        BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    biography TEXT
);

-- =========================================
-- BOOKS
-- Entity: Book.java | Table: books
-- =========================================
CREATE TABLE books (
    id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    isbn         VARCHAR(50)  UNIQUE,
    publish_year INT,
    language     VARCHAR(50),
    created_at   DATETIME,
    updated_at   DATETIME
);

-- =========================================
-- BOOK_AUTHORS (many-to-many)
-- Entity: BookAuthor.java | Table: book_authors
-- =========================================
CREATE TABLE book_authors (
    book_id   BIGINT NOT NULL,
    author_id BIGINT NOT NULL,

    PRIMARY KEY (book_id, author_id),

    CONSTRAINT fk_ba_book
        FOREIGN KEY (book_id)   REFERENCES books(id)   ON DELETE CASCADE,
    CONSTRAINT fk_ba_author
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- =========================================
-- CATEGORIES
-- Entity: Category.java | Table: categories
-- =========================================
CREATE TABLE categories (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL UNIQUE,
    description TEXT
);

-- =========================================
-- BOOK_CATEGORIES (many-to-many)
-- Entity: BookCategory.java | Table: book_categories
-- =========================================
CREATE TABLE book_categories (
    book_id     BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    PRIMARY KEY (book_id, category_id),

    CONSTRAINT fk_bc_book
        FOREIGN KEY (book_id)     REFERENCES books(id)      ON DELETE CASCADE,
    CONSTRAINT fk_bc_category
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =========================================
-- INVENTORY
-- Entity: Inventory.java | Table: inventory
-- =========================================
CREATE TABLE inventory (
    id                 BIGINT     AUTO_INCREMENT PRIMARY KEY,
    book_id            BIGINT     NOT NULL UNIQUE,
    total_quantity     INT        NOT NULL DEFAULT 0,
    available_quantity INT        NOT NULL DEFAULT 0,
    change_type        VARCHAR(20),
    created_at         DATETIME,
    updated_at         DATETIME,

    CONSTRAINT fk_inventory_book FOREIGN KEY (book_id) REFERENCES books(id)
);

-- =========================================
-- INVENTORY_LOGS
-- Entity: InventoryLog.java | Table: inventory_logs
-- change_type: IMPORT | ADJUST | BORROW | RETURN
-- quantity_changed: dương = thêm, âm = bớt
-- =========================================
CREATE TABLE inventory_logs (
    id               BIGINT      AUTO_INCREMENT PRIMARY KEY,
    book_id          BIGINT      NOT NULL,
    change_type      VARCHAR(20) NOT NULL,
    quantity_changed INT         NOT NULL,
    total_after      INT         NOT NULL,
    available_after  INT         NOT NULL,
    note             TEXT,
    created_at       DATETIME,

    CONSTRAINT fk_invlog_book FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE INDEX idx_invlog_book ON inventory_logs(book_id);

-- =========================================
-- BORROW_RECORDS
-- Entity: BorrowRecord.java | Table: borrow_records
-- =========================================
CREATE TABLE borrow_records (
    id          BIGINT      AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    borrow_date DATE        NOT NULL,
    due_date    DATE        NOT NULL,
    status      VARCHAR(20),
    created_at  DATETIME,

    CONSTRAINT fk_br_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================================
-- BORROW_ITEMS
-- Entity: BorrowItem.java | Table: borrow_items
-- =========================================
CREATE TABLE borrow_items (
    id                BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrow_record_id  BIGINT NOT NULL,
    book_id           BIGINT NOT NULL,
    quantity          INT    NOT NULL,
    returned_quantity INT    DEFAULT 0,

    CONSTRAINT fk_bi_record
        FOREIGN KEY (borrow_record_id) REFERENCES borrow_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bi_book
        FOREIGN KEY (book_id) REFERENCES books(id)
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX idx_books_title         ON books(title);
CREATE INDEX idx_borrow_user         ON borrow_records(user_id);
CREATE INDEX idx_borrow_status       ON borrow_records(status);
CREATE INDEX idx_borrow_items_record ON borrow_items(borrow_record_id);
CREATE INDEX idx_borrow_items_book   ON borrow_items(book_id);
CREATE INDEX idx_ba_author           ON book_authors(author_id);
CREATE INDEX idx_bc_category         ON book_categories(category_id);

-- =========================================
-- TEST DATA
-- =========================================

-- -----------------------------------------
-- ROLES (10 bản ghi)
-- -----------------------------------------
INSERT INTO roles (name) VALUES
('ADMIN'),
('LIBRARIAN'),
('USER'),
('MANAGER'),
('STAFF'),
('GUEST'),
('SUPERVISOR'),
('EDITOR'),
('REVIEWER'),
('OPERATOR');

-- -----------------------------------------
-- USERS (10 bản ghi)
-- Mật khẩu gốc: Password@123
-- Hash BCrypt (cost=10): $2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm
-- -----------------------------------------
INSERT INTO users (username, email, password, full_name, phone, role_id, is_active, created_at, updated_at) VALUES
('admin',      'admin@library.com',      '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Quản Trị Viên',  '0901111111', 1, 1, NOW(), NOW()),
('librarian1', 'librarian1@library.com', '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Thủ Thư Một',    '0901111112', 2, 1, NOW(), NOW()),
('librarian2', 'librarian2@library.com', '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Thủ Thư Hai',    '0901111113', 2, 1, NOW(), NOW()),
('manager1',   'manager1@library.com',   '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Phạm Thị Dung',  '0901111114', 4, 1, NOW(), NOW()),
('user1',      'user1@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Nguyễn Văn An',  '0901111115', 3, 1, NOW(), NOW()),
('user2',      'user2@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Trần Thị Bình',  '0901111116', 3, 1, NOW(), NOW()),
('user3',      'user3@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Lê Văn Cường',   '0901111117', 3, 1, NOW(), NOW()),
('user4',      'user4@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Hoàng Văn Em',   '0901111118', 3, 1, NOW(), NOW()),
('user5',      'user5@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Vũ Thị Phương',  '0901111119', 3, 1, NOW(), NOW()),
('user6',      'user6@gmail.com',        '$2a$10$slYQmyNdgzRecDAqz/GY2OjFBuqWIqSOMAtPoaZCj/j8x2bLEnYmm', 'Đặng Văn Quang', '0901111120', 3, 0, NOW(), NOW());

-- -----------------------------------------
-- AUTHORS (10 bản ghi)
-- -----------------------------------------
INSERT INTO authors (name, biography) VALUES
('Nguyễn Nhật Ánh',  'Nhà văn Việt Nam nổi tiếng với các tác phẩm về tuổi thơ và học đường.'),
('Tô Hoài',          'Nhà văn Việt Nam, tác giả của Dế Mèn Phiêu Lưu Ký.'),
('Nam Cao',          'Nhà văn hiện thực phê phán Việt Nam, tác giả của Chí Phèo.'),
('Vũ Trọng Phụng',   'Nhà văn trào phúng nổi tiếng với tác phẩm Số Đỏ.'),
('Xuân Diệu',        'Nhà thơ lãng mạn Việt Nam, được mệnh danh là Ông Hoàng thơ tình.'),
('Robert C. Martin', 'Software engineer, known as Uncle Bob. Author of Clean Code and Agile Principles.'),
('Martin Fowler',    'British software engineer, author of Refactoring and Patterns of Enterprise Application Architecture.'),
('Brian Kernighan',  'Canadian computer scientist, co-author of The C Programming Language.'),
('Donald Knuth',     'American computer scientist, author of The Art of Computer Programming.'),
('Joshua Bloch',     'American software engineer, author of Effective Java and chief Java architect at Google.');

-- -----------------------------------------
-- CATEGORIES (10 bản ghi)
-- -----------------------------------------
INSERT INTO categories (name, description) VALUES
('Văn học Việt Nam',   'Các tác phẩm văn học của các nhà văn Việt Nam.'),
('Tiểu thuyết',        'Thể loại văn học dài hơi mô tả cuộc sống và số phận con người.'),
('Khoa học máy tính',  'Sách về lý thuyết và ứng dụng khoa học máy tính.'),
('Lập trình',          'Sách hướng dẫn các ngôn ngữ và kỹ thuật lập trình.'),
('Kiến trúc phần mềm', 'Sách về thiết kế và kiến trúc hệ thống phần mềm.'),
('Thiếu nhi',          'Sách dành cho trẻ em và thanh thiếu niên.'),
('Tự truyện',          'Câu chuyện cuộc đời do chính tác giả kể lại.'),
('Lịch sử',            'Sách ghi chép và phân tích các sự kiện lịch sử.'),
('Khoa học',           'Sách về các lĩnh vực khoa học tự nhiên và ứng dụng.'),
('Triết học',          'Sách về các tư tưởng và hệ thống triết học.');

-- -----------------------------------------
-- BOOKS (10 bản ghi)
-- -----------------------------------------
INSERT INTO books (title, description, isbn, publish_year, language, created_at, updated_at) VALUES
('Cho Tôi Xin Một Vé Đi Tuổi Thơ', 'Cuốn sách về ký ức tuổi thơ đầy màu sắc của tác giả Nguyễn Nhật Ánh.',        '978-604-2-00001-0', 2008, 'Vietnamese', NOW(), NOW()),
('Dế Mèn Phiêu Lưu Ký',            'Câu chuyện phiêu lưu của chú Dế Mèn dũng cảm qua các vùng đất kỳ thú.',        '978-604-2-00002-0', 1941, 'Vietnamese', NOW(), NOW()),
('Chí Phèo',                        'Câu chuyện bi kịch về người nông dân bị tha hóa trong xã hội cũ.',              '978-604-2-00003-0', 1941, 'Vietnamese', NOW(), NOW()),
('Số Đỏ',                           'Tiểu thuyết trào phúng về xã hội thượng lưu Việt Nam thời Pháp thuộc.',         '978-604-2-00004-0', 1936, 'Vietnamese', NOW(), NOW()),
('Mắt Biếc',                        'Câu chuyện tình yêu đầu đời trong sáng và đầy tiếc nuối của tuổi học trò.',     '978-604-2-00005-0', 1990, 'Vietnamese', NOW(), NOW()),
('Clean Code',                      'A handbook of agile software craftsmanship by Robert C. Martin.',                '978-0-13-235088-4', 2008, 'English',    NOW(), NOW()),
('Refactoring',                     'Improving the design of existing code by Martin Fowler.',                        '978-0-13-468599-1', 1999, 'English',    NOW(), NOW()),
('The C Programming Language',      'The definitive reference manual for the C programming language.',                '978-0-13-110362-7', 1978, 'English',    NOW(), NOW()),
('Effective Java',                  'Best practices and idioms for the Java platform by Joshua Bloch.',               '978-0-13-468599-7', 2018, 'English',    NOW(), NOW()),
('Design Patterns',                 'Elements of Reusable Object-Oriented Software by the Gang of Four.',             '978-0-20-163361-5', 1994, 'English',    NOW(), NOW());

-- -----------------------------------------
-- BOOK_AUTHORS (10 bản ghi)
-- -----------------------------------------
INSERT INTO book_authors (book_id, author_id) VALUES
(1,  1),   -- Cho Tôi Xin Một Vé Đi Tuổi Thơ → Nguyễn Nhật Ánh
(2,  2),   -- Dế Mèn Phiêu Lưu Ký            → Tô Hoài
(3,  3),   -- Chí Phèo                        → Nam Cao
(4,  4),   -- Số Đỏ                           → Vũ Trọng Phụng
(5,  1),   -- Mắt Biếc                        → Nguyễn Nhật Ánh
(6,  6),   -- Clean Code                      → Robert C. Martin
(7,  7),   -- Refactoring                     → Martin Fowler
(8,  8),   -- The C Programming Language      → Brian Kernighan
(9,  10),  -- Effective Java                  → Joshua Bloch
(10, 7);   -- Design Patterns                 → Martin Fowler

-- -----------------------------------------
-- BOOK_CATEGORIES (10 bản ghi)
-- -----------------------------------------
INSERT INTO book_categories (book_id, category_id) VALUES
(1,  1),   -- Cho Tôi Xin Một Vé Đi Tuổi Thơ → Văn học Việt Nam
(2,  6),   -- Dế Mèn Phiêu Lưu Ký            → Thiếu nhi
(3,  1),   -- Chí Phèo                        → Văn học Việt Nam
(4,  2),   -- Số Đỏ                           → Tiểu thuyết
(5,  1),   -- Mắt Biếc                        → Văn học Việt Nam
(6,  4),   -- Clean Code                      → Lập trình
(7,  5),   -- Refactoring                     → Kiến trúc phần mềm
(8,  4),   -- The C Programming Language      → Lập trình
(9,  4),   -- Effective Java                  → Lập trình
(10, 5);   -- Design Patterns                 → Kiến trúc phần mềm

-- -----------------------------------------
-- INVENTORY (10 bản ghi, 1 record / 1 book)
-- -----------------------------------------
INSERT INTO inventory (book_id, total_quantity, available_quantity, created_at, updated_at) VALUES
(1,  10, 8,  NOW(), NOW()),
(2,  15, 15, NOW(), NOW()),
(3,  8,  6,  NOW(), NOW()),
(4,  12, 10, NOW(), NOW()),
(5,  20, 18, NOW(), NOW()),
(6,  5,  3,  NOW(), NOW()),
(7,  7,  7,  NOW(), NOW()),
(8,  6,  5,  NOW(), NOW()),
(9,  9,  7,  NOW(), NOW()),
(10, 4,  2,  NOW(), NOW());

-- -----------------------------------------
-- BORROW_RECORDS (10 bản ghi)
-- Status: BORROWING | RETURNED | OVERDUE
-- -----------------------------------------
INSERT INTO borrow_records (user_id, borrow_date, due_date, status, created_at) VALUES
(5, '2026-01-10', '2026-01-24', 'RETURNED',  NOW()),
(6, '2026-01-15', '2026-01-29', 'RETURNED',  NOW()),
(7, '2026-01-20', '2026-02-03', 'RETURNED',  NOW()),
(5, '2026-02-01', '2026-02-15', 'RETURNED',  NOW()),
(6, '2026-02-10', '2026-02-24', 'OVERDUE',   NOW()),
(8, '2026-02-15', '2026-03-01', 'OVERDUE',   NOW()),
(5, '2026-02-20', '2026-03-06', 'BORROWING', NOW()),
(6, '2026-02-25', '2026-03-11', 'BORROWING', NOW()),
(9, '2026-03-01', '2026-03-15', 'BORROWING', NOW()),
(7, '2026-03-03', '2026-03-17', 'BORROWING', NOW());

-- -----------------------------------------
-- BORROW_ITEMS (10 bản ghi)
-- -----------------------------------------
INSERT INTO borrow_items (borrow_record_id, book_id, quantity, returned_quantity) VALUES
(1,  1,  2, 2),
(2,  3,  1, 1),
(3,  5,  1, 1),
(4,  2,  2, 2),
(5,  9,  1, 0),
(6,  6,  1, 0),
(7,  4,  2, 0),
(8,  7,  1, 0),
(9,  8,  1, 0),
(10, 10, 1, 0);