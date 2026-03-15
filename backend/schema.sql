-- =========================================
-- Library Management System
-- Database schema only
-- =========================================
SET
    NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS library_db CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE library_db;

SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS borrow_items;

DROP TABLE IF EXISTS borrow_records;

DROP TABLE IF EXISTS inventory_logs;

DROP TABLE IF EXISTS inventory;

DROP TABLE IF EXISTS book_categories;

DROP TABLE IF EXISTS book_authors;

DROP TABLE IF EXISTS books;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS authors;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS roles;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE TABLE
    roles (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );

CREATE TABLE
    users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(200),
        phone VARCHAR(50),
        role_id BIGINT NOT NULL,
        is_active TINYINT (1) NOT NULL DEFAULT 1,
        created_at DATETIME,
        updated_at DATETIME,
        CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles (id)
    );

CREATE TABLE
    authors (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        biography TEXT
    );

CREATE TABLE
    categories (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        description TEXT
    );

CREATE TABLE
    books (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        isbn VARCHAR(50) UNIQUE,
        publish_year INT,
        language VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
    );

CREATE TABLE
    book_authors (
        book_id BIGINT NOT NULL,
        author_id BIGINT NOT NULL,
        PRIMARY KEY (book_id, author_id),
        CONSTRAINT fk_ba_book FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
        CONSTRAINT fk_ba_author FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
    );

CREATE TABLE
    book_categories (
        book_id BIGINT NOT NULL,
        category_id BIGINT NOT NULL,
        PRIMARY KEY (book_id, category_id),
        CONSTRAINT fk_bc_book FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
        CONSTRAINT fk_bc_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

CREATE TABLE
    inventory (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        book_id BIGINT NOT NULL UNIQUE,
        total_quantity INT NOT NULL DEFAULT 0,
        available_quantity INT NOT NULL DEFAULT 0,
        change_type VARCHAR(20),
        created_at DATETIME,
        updated_at DATETIME,
        CONSTRAINT fk_inventory_book FOREIGN KEY (book_id) REFERENCES books (id)
    );

CREATE TABLE
    inventory_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        book_id BIGINT NOT NULL,
        change_type VARCHAR(20) NOT NULL,
        quantity_changed INT NOT NULL,
        total_after INT NOT NULL,
        available_after INT NOT NULL,
        note TEXT,
        created_at DATETIME,
        CONSTRAINT fk_invlog_book FOREIGN KEY (book_id) REFERENCES books (id)
    );

CREATE TABLE
    borrow_records (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        borrow_date DATE NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20),
        created_at DATETIME,
        CONSTRAINT fk_br_user FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    borrow_items (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        borrow_record_id BIGINT NOT NULL,
        book_id BIGINT NOT NULL,
        quantity INT NOT NULL,
        returned_quantity INT DEFAULT 0,
        CONSTRAINT fk_bi_record FOREIGN KEY (borrow_record_id) REFERENCES borrow_records (id) ON DELETE CASCADE,
        CONSTRAINT fk_bi_book FOREIGN KEY (book_id) REFERENCES books (id)
    );

CREATE INDEX idx_books_title ON books (title);

CREATE INDEX idx_ba_author ON book_authors (author_id);

CREATE INDEX idx_bc_category ON book_categories (category_id);

CREATE INDEX idx_inventory_book ON inventory (book_id);

CREATE INDEX idx_invlog_book ON inventory_logs (book_id);

CREATE INDEX idx_borrow_user ON borrow_records (user_id);

CREATE INDEX idx_borrow_status ON borrow_records (status);

CREATE INDEX idx_borrow_items_record ON borrow_items (borrow_record_id);

CREATE INDEX idx_borrow_items_book ON borrow_items (book_id);