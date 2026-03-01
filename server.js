const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Stats
app.get('/api/stats', (req, res) => {
  try {
    db.markOverdue();
    res.json(db.getStats());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Books
app.get('/api/books', (req, res) => {
  try {
    res.json(db.getAllBooks(req.query.search));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/books/:id', (req, res) => {
  try {
    const book = db.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Không tìm thấy sách' });
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/books', (req, res) => {
  try {
    const { title, author, isbn, category, quantity, available_qty } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Tiêu đề và tác giả là bắt buộc' });
    const qty = parseInt(quantity) || 1;
    const avail = available_qty !== undefined ? parseInt(available_qty) : qty;
    const result = db.createBook({ title, author, isbn: isbn || null, category: category || null, quantity: qty, available_qty: avail });
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/books/:id', (req, res) => {
  try {
    const { title, author, isbn, category, quantity, available_qty } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Tiêu đề và tác giả là bắt buộc' });
    db.updateBook(req.params.id, {
      title, author, isbn: isbn || null, category: category || null,
      quantity: parseInt(quantity) || 1, available_qty: parseInt(available_qty) || 0,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/books/:id', (req, res) => {
  try {
    db.deleteBook(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Members
app.get('/api/members', (req, res) => {
  try {
    res.json(db.getAllMembers(req.query.search));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/members/:id', (req, res) => {
  try {
    const member = db.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    res.json(member);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const { name, email, phone, member_id, join_date } = req.body;
    if (!name || !member_id) return res.status(400).json({ error: 'Tên và mã thành viên là bắt buộc' });
    const result = db.createMember({ name, email: email || null, phone: phone || null, member_id, join_date: join_date || new Date().toISOString().split('T')[0] });
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const { name, email, phone, member_id, join_date } = req.body;
    if (!name || !member_id) return res.status(400).json({ error: 'Tên và mã thành viên là bắt buộc' });
    db.updateMember(req.params.id, { name, email: email || null, phone: phone || null, member_id, join_date });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    db.deleteMember(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Borrows
app.get('/api/borrows', (req, res) => {
  try {
    db.markOverdue();
    res.json(db.getAllBorrows());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/borrows', (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;
    if (!book_id || !member_id || !due_date) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    db.borrowBook({ book_id: parseInt(book_id), member_id: parseInt(member_id), due_date });
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/borrows/:id/return', (req, res) => {
  try {
    db.returnBook(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Lỗi khởi động máy chủ:', err.message);
  process.exit(1);
});
