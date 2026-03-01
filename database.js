const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'library.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    available_qty INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    member_id TEXT UNIQUE NOT NULL,
    join_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS borrows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date TEXT NOT NULL DEFAULT (date('now','localtime')),
    due_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
  );
`);

// Seed data if empty
const bookCount = db.prepare('SELECT COUNT(*) as cnt FROM books').get();
if (bookCount.cnt === 0) {
  const insertBook = db.prepare(`
    INSERT INTO books (title, author, isbn, category, quantity, available_qty)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const books = [
    ['Lập trình Node.js cơ bản', 'Nguyễn Văn An', '978-604-1-01234-5', 'Công nghệ', 3, 3],
    ['Cấu trúc dữ liệu và giải thuật', 'Trần Thị Bình', '978-604-1-02345-6', 'Khoa học máy tính', 2, 2],
    ['Nhà Giả Kim', 'Paulo Coelho', '978-604-2-03456-7', 'Văn học', 4, 4],
    ['Đắc Nhân Tâm', 'Dale Carnegie', '978-604-2-04567-8', 'Kỹ năng sống', 5, 5],
    ['Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', '978-604-3-05678-9', 'Lịch sử', 2, 2],
    ['Tôi Tài Giỏi, Bạn Cũng Thế', 'Adam Khoo', '978-604-3-06789-0', 'Kỹ năng sống', 3, 3],
    ['Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', '978-604-4-07890-1', 'Văn học', 3, 3],
  ];
  books.forEach(b => insertBook.run(...b));
}

const memberCount = db.prepare('SELECT COUNT(*) as cnt FROM members').get();
if (memberCount.cnt === 0) {
  const insertMember = db.prepare(`
    INSERT INTO members (name, email, phone, member_id, join_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  const members = [
    ['Nguyễn Thị Lan', 'lan.nguyen@email.com', '0901234567', 'TV001', '2024-01-10'],
    ['Trần Văn Minh', 'minh.tran@email.com', '0912345678', 'TV002', '2024-02-15'],
    ['Lê Thị Hoa', 'hoa.le@email.com', '0923456789', 'TV003', '2024-03-20'],
    ['Phạm Văn Đức', 'duc.pham@email.com', '0934567890', 'TV004', '2024-04-05'],
  ];
  members.forEach(m => insertMember.run(...m));
}

// Books
function getAllBooks(search) {
  if (search) {
    return db.prepare(`
      SELECT * FROM books
      WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ? OR category LIKE ?
      ORDER BY title
    `).all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  return db.prepare('SELECT * FROM books ORDER BY title').all();
}

function getBookById(id) {
  return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
}

function createBook(data) {
  const stmt = db.prepare(`
    INSERT INTO books (title, author, isbn, category, quantity, available_qty)
    VALUES (@title, @author, @isbn, @category, @quantity, @available_qty)
  `);
  return stmt.run(data);
}

function updateBook(id, data) {
  const stmt = db.prepare(`
    UPDATE books SET title=@title, author=@author, isbn=@isbn, category=@category,
    quantity=@quantity, available_qty=@available_qty WHERE id=@id
  `);
  return stmt.run({ ...data, id });
}

function deleteBook(id) {
  const active = db.prepare("SELECT COUNT(*) as cnt FROM borrows WHERE book_id=? AND status='active'").get(id);
  if (active.cnt > 0) throw new Error('Sách đang được mượn, không thể xóa');
  return db.prepare('DELETE FROM books WHERE id=?').run(id);
}

// Members
function getAllMembers(search) {
  if (search) {
    return db.prepare(`
      SELECT * FROM members
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR member_id LIKE ?
      ORDER BY name
    `).all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  return db.prepare('SELECT * FROM members ORDER BY name').all();
}

function getMemberById(id) {
  return db.prepare('SELECT * FROM members WHERE id = ?').get(id);
}

function createMember(data) {
  const stmt = db.prepare(`
    INSERT INTO members (name, email, phone, member_id, join_date)
    VALUES (@name, @email, @phone, @member_id, @join_date)
  `);
  return stmt.run(data);
}

function updateMember(id, data) {
  const stmt = db.prepare(`
    UPDATE members SET name=@name, email=@email, phone=@phone,
    member_id=@member_id, join_date=@join_date WHERE id=@id
  `);
  return stmt.run({ ...data, id });
}

function deleteMember(id) {
  const active = db.prepare("SELECT COUNT(*) as cnt FROM borrows WHERE member_id=? AND status='active'").get(id);
  if (active.cnt > 0) throw new Error('Thành viên đang mượn sách, không thể xóa');
  return db.prepare('DELETE FROM members WHERE id=?').run(id);
}

// Borrows
function getAllBorrows() {
  return db.prepare(`
    SELECT br.id, br.borrow_date, br.due_date, br.return_date, br.status,
           b.title as book_title, b.author as book_author,
           m.name as member_name, m.member_id as member_code,
           br.book_id, br.member_id
    FROM borrows br
    JOIN books b ON br.book_id = b.id
    JOIN members m ON br.member_id = m.id
    ORDER BY br.borrow_date DESC
  `).all();
}

function borrowBook(data) {
  const book = db.prepare('SELECT * FROM books WHERE id=?').get(data.book_id);
  if (!book) throw new Error('Không tìm thấy sách');
  if (book.available_qty <= 0) throw new Error('Sách không còn khả dụng');

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO borrows (book_id, member_id, due_date)
      VALUES (@book_id, @member_id, @due_date)
    `).run(data);
    db.prepare('UPDATE books SET available_qty = available_qty - 1 WHERE id=?').run(data.book_id);
  });
  tx();
}

function returnBook(id) {
  const borrow = db.prepare("SELECT * FROM borrows WHERE id=? AND status='active'").get(id);
  if (!borrow) throw new Error('Không tìm thấy phiếu mượn hoặc đã trả rồi');

  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE borrows SET return_date=date('now','localtime'), status='returned' WHERE id=?
    `).run(id);
    db.prepare('UPDATE books SET available_qty = available_qty + 1 WHERE id=?').run(borrow.book_id);
  });
  tx();
}

function getStats() {
  const totalBooks = db.prepare('SELECT COUNT(*) as cnt FROM books').get().cnt;
  const totalMembers = db.prepare('SELECT COUNT(*) as cnt FROM members').get().cnt;
  const activeBorrows = db.prepare("SELECT COUNT(*) as cnt FROM borrows WHERE status='active'").get().cnt;
  const overdueBooks = db.prepare(`
    SELECT COUNT(*) as cnt FROM borrows
    WHERE status='active' AND due_date < date('now','localtime')
  `).get().cnt;
  return { totalBooks, totalMembers, activeBorrows, overdueBooks };
}

// Auto-mark overdue
function markOverdue() {
  db.prepare(`
    UPDATE borrows SET status='overdue'
    WHERE status='active' AND due_date < date('now','localtime')
  `).run();
}

module.exports = {
  getAllBooks, getBookById, createBook, updateBook, deleteBook,
  getAllMembers, getMemberById, createMember, updateMember, deleteMember,
  getAllBorrows, borrowBook, returnBook, getStats, markOverdue,
};
