-- =========================================
-- Library Management System
-- Sample data only
-- Default sample password for all users: Password@123
-- =========================================
USE library_db;

-- BCrypt hash for Password@123
INSERT INTO
    roles (id, name)
VALUES
    (1, 'ADMIN'),
    (2, 'LIBRARIAN'),
    (3, 'USER');

INSERT INTO
    users (
        id,
        username,
        email,
        password,
        full_name,
        phone,
        role_id,
        is_active,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'admin',
        'admin@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'System Admin',
        '0900000001',
        1,
        1,
        '2026-01-01 08:00:00',
        '2026-03-10 09:00:00'
    ),
    (
        2,
        'librarian_ha',
        'ha@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Nguyen Thu Ha',
        '0900000002',
        2,
        1,
        '2026-01-01 08:10:00',
        '2026-03-10 09:05:00'
    ),
    (
        3,
        'librarian_minh',
        'minh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Tran Quoc Minh',
        '0900000003',
        2,
        1,
        '2026-01-01 08:20:00',
        '2026-03-10 09:10:00'
    ),
    (
        4,
        'member_an',
        'an@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Nguyen Van An',
        '0900000004',
        3,
        1,
        '2026-01-02 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        5,
        'member_binh',
        'binh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Tran Thi Binh',
        '0900000005',
        3,
        1,
        '2026-01-03 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        6,
        'member_cuong',
        'cuong@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Le Van Cuong',
        '0900000006',
        3,
        1,
        '2026-01-04 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        7,
        'member_dung',
        'dung@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Pham Thi Dung',
        '0900000007',
        3,
        1,
        '2026-01-05 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        8,
        'member_em',
        'em@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Hoang Van Em',
        '0900000008',
        3,
        1,
        '2026-01-06 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        9,
        'member_giang',
        'giang@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Vo Thi Giang',
        '0900000009',
        3,
        1,
        '2026-01-07 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        10,
        'member_hung',
        'hung@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Do Minh Hung',
        '0900000010',
        3,
        1,
        '2026-01-08 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        11,
        'member_khanh',
        'khanh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Bui Ngoc Khanh',
        '0900000011',
        3,
        1,
        '2026-01-09 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        12,
        'member_linh',
        'linh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Ngo Thu Linh',
        '0900000012',
        3,
        1,
        '2026-01-10 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        13,
        'member_my',
        'my@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Truong Gia My',
        '0900000013',
        3,
        1,
        '2026-01-11 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        14,
        'member_nam',
        'nam@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Pham Quoc Nam',
        '0900000014',
        3,
        1,
        '2026-01-12 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        15,
        'member_oanh',
        'oanh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Le Thi Oanh',
        '0900000015',
        3,
        1,
        '2026-01-13 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        16,
        'member_phuc',
        'phuc@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Nguyen Minh Phuc',
        '0900000016',
        3,
        1,
        '2026-01-14 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        17,
        'member_quynh',
        'quynh@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Tran Nhu Quynh',
        '0900000017',
        3,
        1,
        '2026-01-15 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        18,
        'member_son',
        'son@library.local',
        '$2a$10$Mx7uSu9Vhwi4FzsgstL/pejgEZjQOWcZKMN8jiyFdTPwMhsvkZe5y',
        'Vo Duc Son',
        '0900000018',
        3,
        0,
        '2026-01-16 10:00:00',
        '2026-03-01 10:00:00'
    );

INSERT INTO
    authors (id, name, biography)
VALUES
    (
        1,
        'Robert C. Martin',
        'Author of Clean Code and Clean Architecture, focused on software craftsmanship and maintainable systems.'
    ),
    (
        2,
        'Martin Fowler',
        'Software architect known for Refactoring and enterprise application architecture patterns.'
    ),
    (
        3,
        'Joshua Bloch',
        'Java expert and author of Effective Java.'
    ),
    (
        4,
        'Craig Walls',
        'Author and educator in the Spring ecosystem.'
    ),
    (
        5,
        'Eric Evans',
        'Popularized domain-driven design in modern software development.'
    ),
    (
        6,
        'Andrew Hunt',
        'Co-author of The Pragmatic Programmer.'
    ),
    (
        7,
        'David Thomas',
        'Co-author of The Pragmatic Programmer and advocate of agile practices.'
    ),
    (
        8,
        'Eric Freeman',
        'Co-author of Head First Design Patterns.'
    ),
    (
        9,
        'Elisabeth Robson',
        'Co-author of Head First Design Patterns.'
    ),
    (
        10,
        'To Hoai',
        'Vietnamese author, best known for De Men Phieu Luu Ky.'
    ),
    (
        11,
        'Nguyen Nhat Anh',
        'Vietnamese novelist known for youth and coming-of-age stories.'
    ),
    (
        12,
        'Nam Cao',
        'Vietnamese realist writer and author of Chi Pheo.'
    ),
    (
        13,
        'Vu Trong Phung',
        'Vietnamese satirical novelist and journalist.'
    ),
    (
        14,
        'Ngo Tat To',
        'Vietnamese writer known for Tat Den.'
    ),
    (
        15,
        'Brian Goetz',
        'Java concurrency specialist and key contributor to the Java platform.'
    ),
    (
        16,
        'Herbert Schildt',
        'Technical author on Java and programming fundamentals.'
    ),
    (
        17,
        'Aditya Bhargava',
        'Author of Grokking Algorithms.'
    ),
    (
        18,
        'Abraham Silberschatz',
        'Database researcher and co-author of Database System Concepts.'
    ),
    (
        19,
        'Henry F. Korth',
        'Co-author of major database textbooks.'
    ),
    (
        20,
        'S. Sudarshan',
        'Co-author of Database System Concepts.'
    ),
    (
        21,
        'Thomas H. Cormen',
        'Co-author of Introduction to Algorithms.'
    ),
    (
        22,
        'Erich Gamma',
        'One of the Gang of Four authors of Design Patterns.'
    ),
    (
        23,
        'Richard Helm',
        'One of the Gang of Four authors of Design Patterns.'
    ),
    (
        24,
        'Ralph Johnson',
        'One of the Gang of Four authors of Design Patterns.'
    ),
    (
        25,
        'John Vlissides',
        'One of the Gang of Four authors of Design Patterns.'
    ),
    (
        26,
        'Michael Feathers',
        'Author of Working Effectively with Legacy Code.'
    ),
    (
        27,
        'Chris Richardson',
        'Author focused on microservices and distributed systems.'
    ),
    (
        28,
        'Brian Kernighan',
        'Co-author of The C Programming Language.'
    ),
    (29, 'Dennis Ritchie', 'Co-creator of C and Unix.'),
    (
        30,
        'Le Minh Hoang',
        'Vietnamese author and lecturer in algorithms and programming.'
    );

INSERT INTO
    categories (id, name, description)
VALUES
    (
        1,
        'Software Engineering',
        'Principles, practices and craftsmanship for building quality software.'
    ),
    (
        2,
        'Java',
        'Books focused on Java language, platform and ecosystem.'
    ),
    (
        3,
        'Spring',
        'Spring Framework and Spring Boot development.'
    ),
    (
        4,
        'Software Architecture',
        'Architecture, patterns and system design topics.'
    ),
    (
        5,
        'Algorithms',
        'Algorithms, data structures and problem solving.'
    ),
    (
        6,
        'Database',
        'Database design, theory and SQL systems.'
    ),
    (
        7,
        'Vietnamese Literature',
        'Works by notable Vietnamese authors.'
    ),
    (
        8,
        'Novel',
        'Long-form fiction and literary works.'
    ),
    (
        9,
        'Children',
        'Books suitable for younger readers and teenagers.'
    ),
    (
        10,
        'Object-Oriented Programming',
        'OOP design and reusable modeling techniques.'
    ),
    (
        11,
        'Distributed Systems',
        'Microservices, system communication and reliability.'
    ),
    (
        12,
        'Classics',
        'Classic works that remain widely read over time.'
    ),
    (
        13,
        'DevOps',
        'Deployment, operations and delivery practices.'
    ),
    (
        14,
        'Backend Development',
        'Backend engineering, APIs and server-side design.'
    );

INSERT INTO
    books (
        id,
        title,
        description,
        isbn,
        publish_year,
        language,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'Clean Code',
        'A handbook of agile software craftsmanship covering naming, functions, objects and code hygiene.',
        '978-0-13-235088-4',
        2008,
        'English',
        '2026-01-01 09:00:00',
        '2026-03-01 09:00:00'
    ),
    (
        2,
        'Refactoring',
        'Improving the design of existing code through disciplined code transformation.',
        '978-0-13-475759-9',
        2018,
        'English',
        '2026-01-01 09:05:00',
        '2026-03-01 09:05:00'
    ),
    (
        3,
        'Effective Java',
        'Best practices and design guidance for modern Java development.',
        '978-0-13-468599-1',
        2018,
        'English',
        '2026-01-01 09:10:00',
        '2026-03-01 09:10:00'
    ),
    (
        4,
        'Design Patterns',
        'Reusable object-oriented solutions to common software design problems.',
        '978-0-20-163361-0',
        1994,
        'English',
        '2026-01-01 09:15:00',
        '2026-03-01 09:15:00'
    ),
    (
        5,
        'Spring in Action',
        'Practical guide for building applications with Spring.',
        '978-1-61729-757-1',
        2022,
        'English',
        '2026-01-01 09:20:00',
        '2026-03-01 09:20:00'
    ),
    (
        6,
        'Domain-Driven Design',
        'Strategies for tackling complexity in the heart of software.',
        '978-0-321-12521-7',
        2003,
        'English',
        '2026-01-01 09:25:00',
        '2026-03-01 09:25:00'
    ),
    (
        7,
        'The Pragmatic Programmer',
        'Timeless practical advice for programmers who ship software.',
        '978-0-13-595705-9',
        2019,
        'English',
        '2026-01-01 09:30:00',
        '2026-03-01 09:30:00'
    ),
    (
        8,
        'Head First Design Patterns',
        'Visual and example-driven introduction to design patterns.',
        '978-0-596-00712-6',
        2004,
        'English',
        '2026-01-01 09:35:00',
        '2026-03-01 09:35:00'
    ),
    (
        9,
        'De Men Phieu Luu Ky',
        'Classic adventure story following the journeys of De Men.',
        '978-604-2-00002-0',
        1941,
        'Vietnamese',
        '2026-01-01 09:40:00',
        '2026-03-01 09:40:00'
    ),
    (
        10,
        'Cho Toi Xin Mot Ve Di Tuoi Tho',
        'A nostalgic story about childhood and imagination.',
        '978-604-2-00001-0',
        2008,
        'Vietnamese',
        '2026-01-01 09:45:00',
        '2026-03-01 09:45:00'
    ),
    (
        11,
        'Mat Biec',
        'A coming-of-age love story set in the Vietnamese countryside.',
        '978-604-2-00005-0',
        1990,
        'Vietnamese',
        '2026-01-01 09:50:00',
        '2026-03-01 09:50:00'
    ),
    (
        12,
        'Chi Pheo',
        'A tragic portrait of a peasant alienated by social injustice.',
        '978-604-2-00003-0',
        1941,
        'Vietnamese',
        '2026-01-01 09:55:00',
        '2026-03-01 09:55:00'
    ),
    (
        13,
        'So Do',
        'A satirical novel about colonial-era urban society and vanity.',
        '978-604-2-00004-0',
        1936,
        'Vietnamese',
        '2026-01-01 10:00:00',
        '2026-03-01 10:00:00'
    ),
    (
        14,
        'Tat Den',
        'A classic Vietnamese novel about peasant life under oppression.',
        '978-604-2-00006-0',
        1939,
        'Vietnamese',
        '2026-01-01 10:05:00',
        '2026-03-01 10:05:00'
    ),
    (
        15,
        'Toi Thay Hoa Vang Tren Co Xanh',
        'A warm story of family, memory and growing up.',
        '978-604-2-00115-0',
        2010,
        'Vietnamese',
        '2026-01-01 10:10:00',
        '2026-03-01 10:10:00'
    ),
    (
        16,
        'Cau Truc Du Lieu Va Giai Thuat',
        'Vietnamese guide to data structures, algorithms and competitive programming foundations.',
        '978-604-9-87654-3',
        2021,
        'Vietnamese',
        '2026-01-01 10:15:00',
        '2026-03-01 10:15:00'
    ),
    (
        17,
        'Java Concurrency in Practice',
        'Deep dive into concurrency patterns and pitfalls on the JVM.',
        '978-0-321-34960-6',
        2006,
        'English',
        '2026-01-01 10:20:00',
        '2026-03-01 10:20:00'
    ),
    (
        18,
        'Thinking in Java',
        'Comprehensive exploration of Java language features and OOP ideas.',
        '978-0-13-187248-6',
        2006,
        'English',
        '2026-01-01 10:25:00',
        '2026-03-01 10:25:00'
    ),
    (
        19,
        'Grokking Algorithms',
        'Illustrated introduction to common algorithms and how they work.',
        '978-1-61729-223-1',
        2016,
        'English',
        '2026-01-01 10:30:00',
        '2026-03-01 10:30:00'
    ),
    (
        20,
        'Database System Concepts',
        'Core concepts in relational databases, transactions and storage.',
        '978-0-07-352332-3',
        2019,
        'English',
        '2026-01-01 10:35:00',
        '2026-03-01 10:35:00'
    ),
    (
        21,
        'Introduction to Algorithms',
        'Foundational algorithms textbook spanning sorting, graphs and optimization.',
        '978-0-262-04630-5',
        2009,
        'English',
        '2026-01-01 10:40:00',
        '2026-03-01 10:40:00'
    ),
    (
        22,
        'Clean Architecture',
        'Guide to boundaries, use cases and architecture in long-lived systems.',
        '978-0-13-449416-6',
        2017,
        'English',
        '2026-01-01 10:45:00',
        '2026-03-01 10:45:00'
    ),
    (
        23,
        'Working Effectively with Legacy Code',
        'Techniques for changing old code safely through seams and tests.',
        '978-0-13-117705-5',
        2004,
        'English',
        '2026-01-01 10:50:00',
        '2026-03-01 10:50:00'
    ),
    (
        24,
        'Microservices Patterns',
        'Patterns for designing, deploying and operating microservices systems.',
        '978-1-61729-454-9',
        2018,
        'English',
        '2026-01-01 10:55:00',
        '2026-03-01 10:55:00'
    );

INSERT INTO
    book_authors (book_id, author_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 22),
    (4, 23),
    (4, 24),
    (4, 25),
    (5, 4),
    (6, 5),
    (7, 6),
    (7, 7),
    (8, 8),
    (8, 9),
    (9, 10),
    (10, 11),
    (11, 11),
    (12, 12),
    (13, 13),
    (14, 14),
    (15, 11),
    (16, 30),
    (17, 15),
    (18, 16),
    (19, 17),
    (20, 18),
    (20, 19),
    (20, 20),
    (21, 21),
    (22, 1),
    (23, 26),
    (24, 27);

INSERT INTO
    book_categories (book_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 14),
    (2, 1),
    (2, 4),
    (3, 2),
    (3, 10),
    (3, 14),
    (4, 1),
    (4, 4),
    (4, 10),
    (5, 2),
    (5, 3),
    (5, 14),
    (6, 4),
    (6, 14),
    (7, 1),
    (7, 14),
    (8, 4),
    (8, 10),
    (9, 7),
    (9, 9),
    (10, 7),
    (10, 8),
    (10, 9),
    (11, 7),
    (11, 8),
    (12, 7),
    (12, 12),
    (13, 7),
    (13, 12),
    (14, 7),
    (14, 12),
    (15, 7),
    (15, 8),
    (15, 9),
    (16, 5),
    (16, 14),
    (17, 2),
    (17, 14),
    (18, 2),
    (18, 10),
    (19, 5),
    (19, 14),
    (20, 6),
    (20, 14),
    (21, 5),
    (21, 12),
    (22, 4),
    (22, 14),
    (23, 1),
    (23, 4),
    (24, 4),
    (24, 11),
    (24, 14);

INSERT INTO
    inventory (
        id,
        book_id,
        total_quantity,
        available_quantity,
        change_type,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        1,
        12,
        10,
        'EXPORT',
        '2026-01-02 08:00:00',
        '2026-03-09 08:30:00'
    ),
    (
        2,
        2,
        10,
        9,
        'EXPORT',
        '2026-01-02 08:05:00',
        '2026-03-01 11:00:00'
    ),
    (
        3,
        3,
        14,
        12,
        'RETURN',
        '2026-01-02 08:10:00',
        '2026-03-09 09:00:00'
    ),
    (
        4,
        4,
        8,
        7,
        'EXPORT',
        '2026-01-02 08:15:00',
        '2026-03-04 09:10:00'
    ),
    (
        5,
        5,
        11,
        10,
        'EXPORT',
        '2026-01-02 08:20:00',
        '2026-02-27 10:20:00'
    ),
    (
        6,
        6,
        9,
        8,
        'EXPORT',
        '2026-01-02 08:25:00',
        '2026-03-02 14:00:00'
    ),
    (
        7,
        7,
        13,
        12,
        'EXPORT',
        '2026-01-02 08:30:00',
        '2026-03-06 15:00:00'
    ),
    (
        8,
        8,
        7,
        7,
        'IMPORT',
        '2026-01-02 08:35:00',
        '2026-03-05 16:30:00'
    ),
    (
        9,
        9,
        18,
        17,
        'EXPORT',
        '2026-01-02 08:40:00',
        '2026-03-03 10:00:00'
    ),
    (
        10,
        10,
        16,
        15,
        'EXPORT',
        '2026-01-02 08:45:00',
        '2026-03-03 10:05:00'
    ),
    (
        11,
        11,
        9,
        8,
        'RETURN',
        '2026-01-02 08:50:00',
        '2026-03-03 10:10:00'
    ),
    (
        12,
        12,
        10,
        10,
        'IMPORT',
        '2026-01-02 08:55:00',
        '2026-03-07 08:00:00'
    ),
    (
        13,
        13,
        10,
        10,
        'IMPORT',
        '2026-01-02 09:00:00',
        '2026-03-07 08:05:00'
    ),
    (
        14,
        14,
        12,
        12,
        'IMPORT',
        '2026-01-02 09:05:00',
        '2026-02-14 13:00:00'
    ),
    (
        15,
        15,
        11,
        10,
        'EXPORT',
        '2026-01-02 09:10:00',
        '2026-03-08 11:20:00'
    ),
    (
        16,
        16,
        8,
        7,
        'EXPORT',
        '2026-01-02 09:15:00',
        '2026-02-23 17:40:00'
    ),
    (
        17,
        17,
        10,
        9,
        'EXPORT',
        '2026-01-02 09:20:00',
        '2026-03-04 09:15:00'
    ),
    (
        18,
        18,
        9,
        8,
        'EXPORT',
        '2026-01-02 09:25:00',
        '2026-02-27 10:25:00'
    ),
    (
        19,
        19,
        12,
        11,
        'EXPORT',
        '2026-01-02 09:30:00',
        '2026-03-08 11:25:00'
    ),
    (
        20,
        20,
        14,
        13,
        'RETURN',
        '2026-01-02 09:35:00',
        '2026-03-02 14:15:00'
    ),
    (
        21,
        21,
        15,
        13,
        'EXPORT',
        '2026-01-02 09:40:00',
        '2026-03-09 08:35:00'
    ),
    (
        22,
        22,
        10,
        10,
        'IMPORT',
        '2026-01-02 09:45:00',
        '2026-03-05 16:35:00'
    ),
    (
        23,
        23,
        9,
        8,
        'EXPORT',
        '2026-01-02 09:50:00',
        '2026-03-01 11:05:00'
    ),
    (
        24,
        24,
        8,
        6,
        'EXPORT',
        '2026-01-02 09:55:00',
        '2026-03-06 15:05:00'
    );

INSERT INTO
    borrow_records (
        id,
        user_id,
        borrow_date,
        due_date,
        status,
        created_at
    )
VALUES
    (
        1,
        4,
        '2026-01-05',
        '2026-01-19',
        'RETURNED',
        '2026-01-05 09:00:00'
    ),
    (
        2,
        5,
        '2026-01-08',
        '2026-01-22',
        'RETURNED',
        '2026-01-08 09:15:00'
    ),
    (
        3,
        6,
        '2026-01-12',
        '2026-01-26',
        'RETURNED',
        '2026-01-12 10:00:00'
    ),
    (
        4,
        7,
        '2026-01-18',
        '2026-02-01',
        'RETURNED',
        '2026-01-18 10:20:00'
    ),
    (
        5,
        8,
        '2026-02-02',
        '2026-02-16',
        'RETURNED',
        '2026-02-02 08:30:00'
    ),
    (
        6,
        9,
        '2026-02-05',
        '2026-02-19',
        'RETURNED',
        '2026-02-05 08:45:00'
    ),
    (
        7,
        10,
        '2026-02-10',
        '2026-02-24',
        'RETURNED',
        '2026-02-10 09:10:00'
    ),
    (
        8,
        11,
        '2026-02-14',
        '2026-02-28',
        'RETURNED',
        '2026-02-14 09:30:00'
    ),
    (
        9,
        12,
        '2026-02-20',
        '2026-03-06',
        'BORROWING',
        '2026-02-20 10:00:00'
    ),
    (
        10,
        13,
        '2026-02-23',
        '2026-03-09',
        'BORROWING',
        '2026-02-23 10:15:00'
    ),
    (
        11,
        14,
        '2026-02-27',
        '2026-03-13',
        'BORROWING',
        '2026-02-27 10:30:00'
    ),
    (
        12,
        15,
        '2026-03-01',
        '2026-03-15',
        'BORROWING',
        '2026-03-01 11:00:00'
    ),
    (
        13,
        16,
        '2026-03-02',
        '2026-03-16',
        'BORROWING',
        '2026-03-02 11:15:00'
    ),
    (
        14,
        17,
        '2026-03-03',
        '2026-03-17',
        'BORROWING',
        '2026-03-03 11:30:00'
    ),
    (
        15,
        18,
        '2026-03-04',
        '2026-03-18',
        'BORROWING',
        '2026-03-04 11:45:00'
    ),
    (
        16,
        4,
        '2026-03-05',
        '2026-03-19',
        'RETURNED',
        '2026-03-05 12:00:00'
    ),
    (
        17,
        5,
        '2026-03-06',
        '2026-03-20',
        'BORROWING',
        '2026-03-06 12:15:00'
    ),
    (
        18,
        6,
        '2026-03-07',
        '2026-03-21',
        'RETURNED',
        '2026-03-07 12:30:00'
    ),
    (
        19,
        7,
        '2026-03-08',
        '2026-03-22',
        'BORROWING',
        '2026-03-08 12:45:00'
    ),
    (
        20,
        8,
        '2026-03-09',
        '2026-03-23',
        'BORROWING',
        '2026-03-09 13:00:00'
    );

INSERT INTO
    borrow_items (
        id,
        borrow_record_id,
        book_id,
        quantity,
        returned_quantity
    )
VALUES
    (1, 1, 1, 1, 1),
    (2, 1, 7, 1, 1),
    (3, 2, 3, 1, 1),
    (4, 2, 20, 1, 1),
    (5, 3, 2, 1, 1),
    (6, 3, 19, 1, 1),
    (7, 4, 5, 1, 1),
    (8, 4, 10, 1, 1),
    (9, 5, 9, 2, 2),
    (10, 5, 15, 1, 1),
    (11, 6, 6, 1, 1),
    (12, 6, 22, 1, 1),
    (13, 7, 4, 1, 1),
    (14, 7, 17, 1, 1),
    (15, 8, 11, 1, 1),
    (16, 8, 14, 1, 1),
    (17, 9, 1, 1, 0),
    (18, 9, 24, 1, 0),
    (19, 9, 21, 1, 0),
    (20, 10, 3, 2, 1),
    (21, 10, 16, 1, 0),
    (22, 11, 5, 1, 0),
    (23, 11, 18, 1, 0),
    (24, 12, 2, 1, 0),
    (25, 12, 23, 1, 0),
    (26, 13, 20, 2, 1),
    (27, 13, 6, 1, 0),
    (28, 14, 9, 1, 0),
    (29, 14, 10, 1, 0),
    (30, 14, 11, 2, 1),
    (31, 15, 4, 1, 0),
    (32, 15, 17, 1, 0),
    (33, 16, 8, 1, 1),
    (34, 16, 22, 1, 1),
    (35, 17, 7, 1, 0),
    (36, 17, 24, 1, 0),
    (37, 18, 12, 1, 1),
    (38, 18, 13, 1, 1),
    (39, 19, 15, 1, 0),
    (40, 19, 19, 1, 0),
    (41, 20, 1, 1, 0),
    (42, 20, 3, 1, 0),
    (43, 20, 21, 1, 0);

INSERT INTO
    inventory_logs (
        id,
        book_id,
        change_type,
        quantity_changed,
        total_after,
        available_after,
        note,
        created_at
    )
VALUES
    (
        1,
        1,
        'IMPORT',
        12,
        12,
        12,
        'Khoi tao ton kho ban dau cho Clean Code',
        '2026-01-02 08:00:00'
    ),
    (
        2,
        2,
        'IMPORT',
        10,
        10,
        10,
        'Khoi tao ton kho ban dau cho Refactoring',
        '2026-01-02 08:05:00'
    ),
    (
        3,
        3,
        'IMPORT',
        14,
        14,
        14,
        'Khoi tao ton kho ban dau cho Effective Java',
        '2026-01-02 08:10:00'
    ),
    (
        4,
        4,
        'IMPORT',
        8,
        8,
        8,
        'Khoi tao ton kho ban dau cho Design Patterns',
        '2026-01-02 08:15:00'
    ),
    (
        5,
        5,
        'IMPORT',
        11,
        11,
        11,
        'Khoi tao ton kho ban dau cho Spring in Action',
        '2026-01-02 08:20:00'
    ),
    (
        6,
        6,
        'IMPORT',
        9,
        9,
        9,
        'Khoi tao ton kho ban dau cho Domain-Driven Design',
        '2026-01-02 08:25:00'
    ),
    (
        7,
        7,
        'IMPORT',
        13,
        13,
        13,
        'Khoi tao ton kho ban dau cho The Pragmatic Programmer',
        '2026-01-02 08:30:00'
    ),
    (
        8,
        8,
        'IMPORT',
        7,
        7,
        7,
        'Khoi tao ton kho ban dau cho Head First Design Patterns',
        '2026-01-02 08:35:00'
    ),
    (
        9,
        9,
        'IMPORT',
        18,
        18,
        18,
        'Khoi tao ton kho ban dau cho De Men Phieu Luu Ky',
        '2026-01-02 08:40:00'
    ),
    (
        10,
        10,
        'IMPORT',
        16,
        16,
        16,
        'Khoi tao ton kho ban dau cho Cho Toi Xin Mot Ve Di Tuoi Tho',
        '2026-01-02 08:45:00'
    ),
    (
        11,
        11,
        'IMPORT',
        9,
        9,
        9,
        'Khoi tao ton kho ban dau cho Mat Biec',
        '2026-01-02 08:50:00'
    ),
    (
        12,
        12,
        'IMPORT',
        10,
        10,
        10,
        'Khoi tao ton kho ban dau cho Chi Pheo',
        '2026-01-02 08:55:00'
    ),
    (
        13,
        13,
        'IMPORT',
        10,
        10,
        10,
        'Khoi tao ton kho ban dau cho So Do',
        '2026-01-02 09:00:00'
    ),
    (
        14,
        14,
        'IMPORT',
        12,
        12,
        12,
        'Khoi tao ton kho ban dau cho Tat Den',
        '2026-01-02 09:05:00'
    ),
    (
        15,
        15,
        'IMPORT',
        11,
        11,
        11,
        'Khoi tao ton kho ban dau cho Toi Thay Hoa Vang Tren Co Xanh',
        '2026-01-02 09:10:00'
    ),
    (
        16,
        16,
        'IMPORT',
        8,
        8,
        8,
        'Khoi tao ton kho ban dau cho Cau Truc Du Lieu Va Giai Thuat',
        '2026-01-02 09:15:00'
    ),
    (
        17,
        17,
        'IMPORT',
        10,
        10,
        10,
        'Khoi tao ton kho ban dau cho Java Concurrency in Practice',
        '2026-01-02 09:20:00'
    ),
    (
        18,
        18,
        'IMPORT',
        9,
        9,
        9,
        'Khoi tao ton kho ban dau cho Thinking in Java',
        '2026-01-02 09:25:00'
    ),
    (
        19,
        19,
        'IMPORT',
        12,
        12,
        12,
        'Khoi tao ton kho ban dau cho Grokking Algorithms',
        '2026-01-02 09:30:00'
    ),
    (
        20,
        20,
        'IMPORT',
        14,
        14,
        14,
        'Khoi tao ton kho ban dau cho Database System Concepts',
        '2026-01-02 09:35:00'
    ),
    (
        21,
        21,
        'IMPORT',
        15,
        15,
        15,
        'Khoi tao ton kho ban dau cho Introduction to Algorithms',
        '2026-01-02 09:40:00'
    ),
    (
        22,
        22,
        'IMPORT',
        10,
        10,
        10,
        'Khoi tao ton kho ban dau cho Clean Architecture',
        '2026-01-02 09:45:00'
    ),
    (
        23,
        23,
        'IMPORT',
        9,
        9,
        9,
        'Khoi tao ton kho ban dau cho Working Effectively with Legacy Code',
        '2026-01-02 09:50:00'
    ),
    (
        24,
        24,
        'IMPORT',
        8,
        8,
        8,
        'Khoi tao ton kho ban dau cho Microservices Patterns',
        '2026-01-02 09:55:00'
    ),
    (
        25,
        1,
        'EXPORT',
        -2,
        12,
        10,
        'Dang co 2 ban sach Clean Code chua tra',
        '2026-03-09 08:30:00'
    ),
    (
        26,
        2,
        'EXPORT',
        -1,
        10,
        9,
        'Muon boi phieu #12',
        '2026-03-01 11:00:00'
    ),
    (
        27,
        3,
        'EXPORT',
        -3,
        14,
        11,
        'Muon boi phieu #10 va #20',
        '2026-02-23 10:20:00'
    ),
    (
        28,
        3,
        'RETURN',
        1,
        14,
        12,
        'Tra 1 ban Effective Java tu phieu #10',
        '2026-03-09 09:00:00'
    ),
    (
        29,
        4,
        'EXPORT',
        -1,
        8,
        7,
        'Muon boi phieu #15',
        '2026-03-04 09:10:00'
    ),
    (
        30,
        5,
        'EXPORT',
        -1,
        11,
        10,
        'Muon boi phieu #11',
        '2026-02-27 10:20:00'
    ),
    (
        31,
        6,
        'EXPORT',
        -1,
        9,
        8,
        'Muon boi phieu #13',
        '2026-03-02 14:00:00'
    ),
    (
        32,
        7,
        'EXPORT',
        -1,
        13,
        12,
        'Muon boi phieu #17',
        '2026-03-06 15:00:00'
    ),
    (
        33,
        9,
        'EXPORT',
        -1,
        18,
        17,
        'Muon boi phieu #14',
        '2026-03-03 10:00:00'
    ),
    (
        34,
        10,
        'EXPORT',
        -1,
        16,
        15,
        'Muon boi phieu #14',
        '2026-03-03 10:05:00'
    ),
    (
        35,
        11,
        'EXPORT',
        -2,
        9,
        7,
        'Muon boi phieu #14',
        '2026-03-03 09:50:00'
    ),
    (
        36,
        11,
        'RETURN',
        1,
        9,
        8,
        'Tra 1 ban Mat Biec tu phieu #14',
        '2026-03-03 10:10:00'
    ),
    (
        37,
        15,
        'EXPORT',
        -1,
        11,
        10,
        'Muon boi phieu #19',
        '2026-03-08 11:20:00'
    ),
    (
        38,
        16,
        'EXPORT',
        -1,
        8,
        7,
        'Muon boi phieu #10',
        '2026-02-23 17:40:00'
    ),
    (
        39,
        17,
        'EXPORT',
        -1,
        10,
        9,
        'Muon boi phieu #15',
        '2026-03-04 09:15:00'
    ),
    (
        40,
        18,
        'EXPORT',
        -1,
        9,
        8,
        'Muon boi phieu #11',
        '2026-02-27 10:25:00'
    ),
    (
        41,
        19,
        'EXPORT',
        -1,
        12,
        11,
        'Muon boi phieu #19',
        '2026-03-08 11:25:00'
    ),
    (
        42,
        20,
        'EXPORT',
        -2,
        14,
        12,
        'Muon boi phieu #13',
        '2026-03-02 14:05:00'
    ),
    (
        43,
        20,
        'RETURN',
        1,
        14,
        13,
        'Tra 1 ban Database System Concepts tu phieu #13',
        '2026-03-02 14:15:00'
    ),
    (
        44,
        21,
        'EXPORT',
        -2,
        15,
        13,
        'Dang co 2 ban Introduction to Algorithms chua tra',
        '2026-03-09 08:35:00'
    ),
    (
        45,
        23,
        'EXPORT',
        -1,
        9,
        8,
        'Muon boi phieu #12',
        '2026-03-01 11:05:00'
    ),
    (
        46,
        24,
        'EXPORT',
        -2,
        8,
        6,
        'Dang co 2 ban Microservices Patterns chua tra',
        '2026-03-06 15:05:00'
    );

-- Quick checks after import:
-- 1. Login sample: admin / Password@123
-- 2. Role required by register/createUser exists as USER
-- 3. Overdue report uses status BORROWING with due_date before current date
-- 4. Search keyword examples: clean, java, nguyen, architecture, literature