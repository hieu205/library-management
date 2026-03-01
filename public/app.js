// ===== State =====
let currentSection = 'dashboard';
let books = [], members = [], borrows = [];

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  navigate('dashboard');
});

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.section);
    });
  });
}

async function navigate(section) {
  currentSection = section;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });
  const titles = { dashboard: 'Tổng quan', books: 'Quản lý Sách', members: 'Quản lý Thành viên', borrows: 'Mượn / Trả Sách' };
  document.getElementById('page-title').textContent = titles[section] || '';
  const actionsEl = document.getElementById('topbar-actions');
  actionsEl.innerHTML = '';

  if (section === 'books') {
    const btn = makeBtn('+ Thêm sách', 'btn-primary');
    btn.onclick = () => showBookModal();
    actionsEl.appendChild(btn);
    await loadBooks();
  } else if (section === 'members') {
    const btn = makeBtn('+ Thêm thành viên', 'btn-primary');
    btn.onclick = () => showMemberModal();
    actionsEl.appendChild(btn);
    await loadMembers();
  } else if (section === 'borrows') {
    const btn = makeBtn('+ Tạo phiếu mượn', 'btn-primary');
    btn.onclick = () => showBorrowModal();
    actionsEl.appendChild(btn);
    await loadBorrows();
  } else {
    await loadDashboard();
  }
}

// ===== API helpers =====
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Lỗi không xác định');
  return data;
}

// ===== Toast =====
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast'; }, 3000);
}

// ===== Modal =====
function showModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').style.display = 'flex';
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal-overlay').onclick = e => { if (e.target === document.getElementById('modal-overlay')) closeModal(); };
}
function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; }

// ===== Helpers =====
function makeBtn(text, cls = 'btn-primary') {
  const b = document.createElement('button');
  b.className = `btn ${cls}`;
  b.innerHTML = text;
  return b;
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function today() { return new Date().toISOString().split('T')[0]; }

function defaultDue() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

function borrowStatusBadge(status) {
  const map = { active: ['badge-active', 'Đang mượn'], overdue: ['badge-overdue', 'Quá hạn'], returned: ['badge-returned', 'Đã trả'] };
  const [cls, label] = map[status] || ['badge-returned', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function setContent(html) { document.getElementById('content').innerHTML = html; }

// ===== Dashboard =====
async function loadDashboard() {
  setContent('<p style="color:var(--text-muted);padding:20px">Đang tải...</p>');
  try {
    const [stats, b] = await Promise.all([api('/api/stats'), api('/api/borrows')]);
    borrows = b;
    const recent = borrows.filter(x => x.status !== 'returned').slice(0, 8);
    setContent(`
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div><div class="stat-value">${stats.totalBooks}</div><div class="stat-label">Tổng số sách</div></div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">👥</div>
          <div><div class="stat-value">${stats.totalMembers}</div><div class="stat-label">Thành viên</div></div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">🔄</div>
          <div><div class="stat-value">${stats.activeBorrows}</div><div class="stat-label">Đang mượn</div></div>
        </div>
        <div class="stat-card danger">
          <div class="stat-icon">⚠️</div>
          <div><div class="stat-value">${stats.overdueBooks}</div><div class="stat-label">Quá hạn</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">📋 Phiếu mượn đang hoạt động</span></div>
        ${recent.length === 0
          ? '<div class="empty-state"><div class="empty-icon">🎉</div><p>Không có phiếu mượn nào đang hoạt động</p></div>'
          : `<div class="table-wrap"><table>
              <thead><tr><th>Sách</th><th>Thành viên</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th></tr></thead>
              <tbody>${recent.map(r => `
                <tr class="recent-borrow-row">
                  <td>${r.book_title}</td>
                  <td>${r.member_name}</td>
                  <td>${fmtDate(r.borrow_date)}</td>
                  <td>${fmtDate(r.due_date)}</td>
                  <td>${borrowStatusBadge(r.status)}</td>
                </tr>`).join('')}
              </tbody></table></div>`
        }
      </div>
    `);
  } catch (e) {
    setContent(`<p style="color:var(--danger)">Lỗi: ${e.message}</p>`);
  }
}

// ===== Books =====
async function loadBooks(search = '') {
  setContent('<p style="color:var(--text-muted);padding:20px">Đang tải...</p>');
  try {
    books = await api(`/api/books${search ? '?search=' + encodeURIComponent(search) : ''}`);
    renderBooks(books, search);
  } catch (e) {
    setContent(`<p style="color:var(--danger)">Lỗi: ${e.message}</p>`);
  }
}

function renderBooks(data, search = '') {
  setContent(`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Danh sách sách (${data.length})</span>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input id="book-search" type="text" placeholder="Tìm kiếm..." value="${search}" />
        </div>
      </div>
      ${data.length === 0
        ? '<div class="empty-state"><div class="empty-icon">📭</div><p>Không tìm thấy sách nào</p></div>'
        : `<div class="table-wrap"><table>
            <thead><tr><th>#</th><th>Tiêu đề</th><th>Tác giả</th><th>ISBN</th><th>Thể loại</th><th>SL</th><th>Còn lại</th><th>Thao tác</th></tr></thead>
            <tbody>${data.map((b, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${esc(b.title)}</strong></td>
                <td>${esc(b.author)}</td>
                <td>${esc(b.isbn || '—')}</td>
                <td>${esc(b.category || '—')}</td>
                <td>${b.quantity}</td>
                <td><span class="${b.available_qty > 0 ? 'qty-available' : 'qty-zero'}">${b.available_qty}</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="showBookModal(${b.id})">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteBook(${b.id})">🗑️ Xóa</button>
                </td>
              </tr>`).join('')}
            </tbody></table></div>`
      }
    </div>
  `);
  const searchEl = document.getElementById('book-search');
  if (searchEl) {
    searchEl.focus();
    searchEl.selectionStart = searchEl.selectionEnd = searchEl.value.length;
    let timer;
    searchEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadBooks(searchEl.value), 350);
    });
  }
}

function showBookModal(id = null) {
  const book = id ? books.find(b => b.id === id) : null;
  const title = book ? 'Chỉnh sửa sách' : 'Thêm sách mới';
  showModal(title, `
    <form id="book-form">
      <div class="form-grid">
        <div class="form-group full">
          <label>Tiêu đề *</label>
          <input name="title" type="text" value="${esc(book?.title || '')}" required />
        </div>
        <div class="form-group">
          <label>Tác giả *</label>
          <input name="author" type="text" value="${esc(book?.author || '')}" required />
        </div>
        <div class="form-group">
          <label>ISBN</label>
          <input name="isbn" type="text" value="${esc(book?.isbn || '')}" />
        </div>
        <div class="form-group">
          <label>Thể loại</label>
          <input name="category" type="text" value="${esc(book?.category || '')}" />
        </div>
        <div class="form-group">
          <label>Số lượng</label>
          <input name="quantity" type="number" min="1" value="${book?.quantity ?? 1}" required />
        </div>
        <div class="form-group">
          <label>Số lượng còn lại</label>
          <input name="available_qty" type="number" min="0" value="${book?.available_qty ?? 1}" required />
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">${book ? 'Cập nhật' : 'Thêm mới'}</button>
      </div>
    </form>
  `);
  document.getElementById('book-form').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    try {
      if (book) {
        await api(`/api/books/${book.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Cập nhật sách thành công!');
      } else {
        await api('/api/books', { method: 'POST', body: JSON.stringify(payload) });
        toast('Thêm sách thành công!');
      }
      closeModal();
      await loadBooks();
    } catch (err) {
      toast(err.message, 'error');
    }
  };
}

async function deleteBook(id) {
  const book = books.find(b => b.id === id);
  if (!confirm(`Xóa sách "${book?.title}"?`)) return;
  try {
    await api(`/api/books/${id}`, { method: 'DELETE' });
    toast('Xóa sách thành công!');
    await loadBooks();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ===== Members =====
async function loadMembers(search = '') {
  setContent('<p style="color:var(--text-muted);padding:20px">Đang tải...</p>');
  try {
    members = await api(`/api/members${search ? '?search=' + encodeURIComponent(search) : ''}`);
    renderMembers(members, search);
  } catch (e) {
    setContent(`<p style="color:var(--danger)">Lỗi: ${e.message}</p>`);
  }
}

function renderMembers(data, search = '') {
  setContent(`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Danh sách thành viên (${data.length})</span>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input id="member-search" type="text" placeholder="Tìm kiếm..." value="${search}" />
        </div>
      </div>
      ${data.length === 0
        ? '<div class="empty-state"><div class="empty-icon">👤</div><p>Không tìm thấy thành viên nào</p></div>'
        : `<div class="table-wrap"><table>
            <thead><tr><th>Mã TV</th><th>Họ tên</th><th>Email</th><th>Số điện thoại</th><th>Ngày tham gia</th><th>Thao tác</th></tr></thead>
            <tbody>${data.map(m => `
              <tr>
                <td><strong>${esc(m.member_id)}</strong></td>
                <td>${esc(m.name)}</td>
                <td>${esc(m.email || '—')}</td>
                <td>${esc(m.phone || '—')}</td>
                <td>${fmtDate(m.join_date)}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="showMemberModal(${m.id})">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteMember(${m.id})">🗑️ Xóa</button>
                </td>
              </tr>`).join('')}
            </tbody></table></div>`
      }
    </div>
  `);
  const searchEl = document.getElementById('member-search');
  if (searchEl) {
    searchEl.focus();
    searchEl.selectionStart = searchEl.selectionEnd = searchEl.value.length;
    let timer;
    searchEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadMembers(searchEl.value), 350);
    });
  }
}

function showMemberModal(id = null) {
  const member = id ? members.find(m => m.id === id) : null;
  const title = member ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới';
  showModal(title, `
    <form id="member-form">
      <div class="form-grid">
        <div class="form-group full">
          <label>Họ và tên *</label>
          <input name="name" type="text" value="${esc(member?.name || '')}" required />
        </div>
        <div class="form-group">
          <label>Mã thành viên *</label>
          <input name="member_id" type="text" value="${esc(member?.member_id || '')}" required />
        </div>
        <div class="form-group">
          <label>Ngày tham gia</label>
          <input name="join_date" type="date" value="${member?.join_date || today()}" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" value="${esc(member?.email || '')}" />
        </div>
        <div class="form-group">
          <label>Số điện thoại</label>
          <input name="phone" type="tel" value="${esc(member?.phone || '')}" />
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">${member ? 'Cập nhật' : 'Thêm mới'}</button>
      </div>
    </form>
  `);
  document.getElementById('member-form').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    try {
      if (member) {
        await api(`/api/members/${member.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Cập nhật thành viên thành công!');
      } else {
        await api('/api/members', { method: 'POST', body: JSON.stringify(payload) });
        toast('Thêm thành viên thành công!');
      }
      closeModal();
      await loadMembers();
    } catch (err) {
      toast(err.message, 'error');
    }
  };
}

async function deleteMember(id) {
  const member = members.find(m => m.id === id);
  if (!confirm(`Xóa thành viên "${member?.name}"?`)) return;
  try {
    await api(`/api/members/${id}`, { method: 'DELETE' });
    toast('Xóa thành viên thành công!');
    await loadMembers();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ===== Borrows =====
async function loadBorrows() {
  setContent('<p style="color:var(--text-muted);padding:20px">Đang tải...</p>');
  try {
    borrows = await api('/api/borrows');
    renderBorrows(borrows);
  } catch (e) {
    setContent(`<p style="color:var(--danger)">Lỗi: ${e.message}</p>`);
  }
}

function renderBorrows(data) {
  const active = data.filter(b => b.status !== 'returned');
  const returned = data.filter(b => b.status === 'returned');
  setContent(`
    <div class="card" style="margin-bottom:22px">
      <div class="card-header"><span class="card-title">📋 Phiếu đang mượn (${active.length})</span></div>
      ${active.length === 0
        ? '<div class="empty-state"><div class="empty-icon">✅</div><p>Không có phiếu mượn nào đang hoạt động</p></div>'
        : `<div class="table-wrap"><table>
            <thead><tr><th>#</th><th>Sách</th><th>Thành viên</th><th>Mã TV</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>${active.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${esc(r.book_title)}</strong></td>
                <td>${esc(r.member_name)}</td>
                <td>${esc(r.member_code)}</td>
                <td>${fmtDate(r.borrow_date)}</td>
                <td>${fmtDate(r.due_date)}</td>
                <td>${borrowStatusBadge(r.status)}</td>
                <td><button class="btn btn-success btn-sm" onclick="returnBook(${r.id})">↩️ Trả sách</button></td>
              </tr>`).join('')}
            </tbody></table></div>`
      }
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">📂 Lịch sử trả sách (${returned.length})</span></div>
      ${returned.length === 0
        ? '<div class="empty-state"><div class="empty-icon">📭</div><p>Chưa có lịch sử trả sách</p></div>'
        : `<div class="table-wrap"><table>
            <thead><tr><th>#</th><th>Sách</th><th>Thành viên</th><th>Ngày mượn</th><th>Ngày trả</th><th>Trạng thái</th></tr></thead>
            <tbody>${returned.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${esc(r.book_title)}</td>
                <td>${esc(r.member_name)}</td>
                <td>${fmtDate(r.borrow_date)}</td>
                <td>${fmtDate(r.return_date)}</td>
                <td>${borrowStatusBadge(r.status)}</td>
              </tr>`).join('')}
            </tbody></table></div>`
      }
    </div>
  `);
}

async function showBorrowModal() {
  try {
    const [booksData, membersData] = await Promise.all([api('/api/books'), api('/api/members')]);
    const availableBooks = booksData.filter(b => b.available_qty > 0);
    showModal('Tạo phiếu mượn sách', `
      <form id="borrow-form">
        <div class="form-grid">
          <div class="form-group full">
            <label>Chọn sách *</label>
            <select name="book_id" required>
              <option value="">-- Chọn sách --</option>
              ${availableBooks.map(b => `<option value="${b.id}">${esc(b.title)} — ${esc(b.author)} (còn ${b.available_qty})</option>`).join('')}
            </select>
          </div>
          <div class="form-group full">
            <label>Chọn thành viên *</label>
            <select name="member_id" required>
              <option value="">-- Chọn thành viên --</option>
              ${membersData.map(m => `<option value="${m.id}">[${esc(m.member_id)}] ${esc(m.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full">
            <label>Ngày hết hạn *</label>
            <input name="due_date" type="date" value="${defaultDue()}" min="${today()}" required />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn btn-primary">Tạo phiếu mượn</button>
        </div>
      </form>
    `);
    document.getElementById('borrow-form').onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      try {
        await api('/api/borrows', { method: 'POST', body: JSON.stringify(payload) });
        toast('Tạo phiếu mượn thành công!');
        closeModal();
        await loadBorrows();
      } catch (err) {
        toast(err.message, 'error');
      }
    };
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function returnBook(id) {
  if (!confirm('Xác nhận trả sách này?')) return;
  try {
    await api(`/api/borrows/${id}/return`, { method: 'PUT' });
    toast('Trả sách thành công!');
    await loadBorrows();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ===== Sanitize =====
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
