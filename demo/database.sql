-- =========================================
-- CREATE DATABASE
-- =========================================

CREATE DATABASE IF NOT EXISTS library_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE library_db;

-- =========================================
-- ROLES
-- =========================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- =========================================
-- USERS
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    phone VARCHAR(50),

    role_id BIGINT NOT NULL,

    status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);

-- =========================================
-- BOOKS
-- =========================================

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isbn VARCHAR(50) UNIQUE,
    publish_year INT,
    language VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- AUTHORS
-- =========================================

CREATE TABLE IF NOT EXISTS authors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT
);

-- =========================================
-- BOOK_AUTHORS (many-to-many)
-- =========================================

CREATE TABLE IF NOT EXISTS book_authors (
    book_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,

    PRIMARY KEY (book_id, author_id),

    CONSTRAINT fk_book_author_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_book_author_author
        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON DELETE CASCADE
);

-- =========================================
-- CATEGORIES
-- =========================================

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT
);

-- =========================================
-- BOOK_CATEGORIES (many-to-many)
-- =========================================

CREATE TABLE IF NOT EXISTS book_categories (
    book_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    PRIMARY KEY (book_id, category_id),

    CONSTRAINT fk_book_category_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_book_category_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- =========================================
-- INVENTORY
-- =========================================

CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    book_id BIGINT NOT NULL UNIQUE,

    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_book
        FOREIGN KEY (book_id)
        REFERENCES books(id),

    CONSTRAINT chk_inventory_total_non_negative CHECK (total_quantity >= 0),
    CONSTRAINT chk_inventory_available_non_negative CHECK (available_quantity >= 0),
    CONSTRAINT chk_inventory_available_lte_total CHECK (available_quantity <= total_quantity)
);

-- =========================================
-- INVENTORY_LOGS
-- =========================================

CREATE TABLE IF NOT EXISTS inventory_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    book_id BIGINT NOT NULL,

    change_type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_log_book
        FOREIGN KEY (book_id)
        REFERENCES books(id),

    CONSTRAINT chk_inventory_logs_quantity_positive CHECK (quantity > 0)
);

-- =========================================
-- BORROW_RECORDS
-- =========================================

CREATE TABLE IF NOT EXISTS borrow_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,

    status VARCHAR(20) DEFAULT 'BORROWING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_borrow_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT chk_borrow_due_after_borrow CHECK (due_date >= borrow_date)
);

-- =========================================
-- BORROW_ITEMS
-- =========================================

CREATE TABLE IF NOT EXISTS borrow_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    borrow_record_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,

    quantity INT NOT NULL,
    returned_quantity INT DEFAULT 0,

    UNIQUE KEY uk_borrow_record_book (borrow_record_id, book_id),

    CONSTRAINT fk_borrow_item_record
        FOREIGN KEY (borrow_record_id)
        REFERENCES borrow_records(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_borrow_item_book
        FOREIGN KEY (book_id)
        REFERENCES books(id),

    CONSTRAINT chk_borrow_item_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_borrow_item_returned_non_negative CHECK (returned_quantity >= 0),
    CONSTRAINT chk_borrow_item_returned_lte_quantity CHECK (returned_quantity <= quantity)
);

-- =========================================
-- INDEXES (for performance)
-- =========================================

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_borrow_user ON borrow_records(user_id);
CREATE INDEX idx_borrow_status ON borrow_records(status);
CREATE INDEX idx_borrow_items_record ON borrow_items(borrow_record_id);
CREATE INDEX idx_borrow_items_book ON borrow_items(book_id);
CREATE INDEX idx_book_authors_author ON book_authors(author_id);
CREATE INDEX idx_book_categories_category ON book_categories(category_id);
CREATE INDEX idx_inventory_logs_book ON inventory_logs(book_id);

-- =========================================
-- SEED DATA
-- =========================================

INSERT IGNORE INTO roles(name) VALUES
('ADMIN'),
('LIBRARIAN'),
('USER');

INSERT IGNORE INTO categories(name, description) VALUES
('Programming', 'Programming books'),
('Science', 'Science books'),
('History', 'History books'),
('Novel', 'Novel books');

-- =========================================
-- ALTER TABLE (schema adjustments)
-- =========================================

-- users: thu hẹp username từ 100 -> 50 ký tự (đồng bộ entity)
ALTER TABLE users
    MODIFY COLUMN username VARCHAR(50) NOT NULL;

-- users: đổi status VARCHAR sang is_active BOOLEAN (đồng bộ entity boolean isActive)
ALTER TABLE users
    DROP COLUMN status,
    ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;