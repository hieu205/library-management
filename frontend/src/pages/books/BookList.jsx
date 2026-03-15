import { useEffect, useState } from 'react';
import { IoAdd, IoSearch, IoPencil, IoTrash, IoEye } from 'react-icons/io5';
import { bookService, authorService, categoryService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function BookList() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', isbn: '', publishYear: '', language: 'Tiếng Việt',
        authorIds: [], categoryIds: [],
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const requests = [bookService.getAll()];
            if (canManage) {
                requests.push(authorService.getAll(), categoryService.getAll());
            }

            const responses = await Promise.all(requests);
            const [booksRes, authorsRes, catsRes] = responses;
            setBooks(booksRes.data.data || []);
            setAuthors(authorsRes?.data?.data || []);
            setCategories(catsRes?.data?.data || []);
        } catch { toast.error('Không thể tải danh sách sách'); }
        finally { setLoading(false); }
    };

    const handleSearch = async () => {
        if (!search.trim()) { loadData(); return; }
        try {
            const res = await bookService.search(search);
            setBooks(res.data.data || []);
        } catch { toast.error('Tìm kiếm thất bại'); }
    };

    useEffect(() => {
        const timer = setTimeout(handleSearch, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const openCreate = () => {
        setSelectedBook(null);
        setForm({ title: '', description: '', isbn: '', publishYear: '', language: 'Tiếng Việt', authorIds: [], categoryIds: [] });
        setModalOpen(true);
    };

    const openEdit = (book) => {
        setSelectedBook(book);
        setForm({
            title: book.title || '',
            description: book.description || '',
            isbn: book.isbn || '',
            publishYear: book.publishYear || '',
            language: book.language || '',
            authorIds: book.authors?.map((a) => a.id) || [],
            categoryIds: book.categories?.map((c) => c.id) || [],
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canManage) {
            return;
        }
        const payload = {
            ...form,
            publishYear: form.publishYear ? parseInt(form.publishYear) : null,
        };
        try {
            if (selectedBook) {
                await bookService.update(selectedBook.id, payload);
                toast.success('Cập nhật sách thành công!');
            } else {
                await bookService.create(payload);
                toast.success('Thêm sách thành công!');
            }
            setModalOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!canManage) {
            return;
        }
        if (!confirm('Bạn có chắc muốn xóa sách này?')) return;
        try {
            await bookService.delete(id);
            toast.success('Xóa sách thành công!');
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa thất bại!');
        }
    };

    const toggleArray = (arr, id) =>
        arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{canManage ? 'Quản lý Sách' : 'Danh sách Sách'}</h1>
                    <p className="page-title-sub">{books.length} cuốn sách trong thư viện</p>
                </div>
                {canManage && (
                    <div className="page-actions">
                        <button className="btn btn-primary" onClick={openCreate}><IoAdd /> Thêm sách</button>
                    </div>
                )}
            </div>

            <div className="table-wrapper">
                <div className="table-toolbar">
                    <div className="search-wrapper">
                        <IoSearch />
                        <input type="text" className="search-input" placeholder="Tìm kiếm sách..."
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th><th>Tiêu đề</th><th>ISBN</th><th>Năm XB</th>
                                <th>Tác giả</th><th>Thể loại</th><th>{canManage ? 'Thao tác' : 'Chi tiết'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.length === 0 ? (
                                <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Không tìm thấy sách nào
                                </td></tr>
                            ) : books.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td><strong>{book.title}</strong></td>
                                    <td><span className="text-muted">{book.isbn || '—'}</span></td>
                                    <td>{book.publishYear || '—'}</td>
                                    <td>
                                        <div className="tag-list">
                                            {book.authors?.map((a) => <span key={a.id} className="tag">{a.name}</span>)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tag-list">
                                            {book.categories?.map((c) => <span key={c.id} className="tag">{c.name}</span>)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedBook(book); setDetailModal(true); }}><IoEye /></button>
                                            {canManage && <button className="btn btn-ghost btn-sm" onClick={() => openEdit(book)}><IoPencil /></button>}
                                            {canManage && <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(book.id)}><IoTrash /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {canManage && (
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                    title={selectedBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'} size="lg">
                    <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tiêu đề *</label>
                        <input type="text" className="form-control" required
                            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>ISBN</label>
                            <input type="text" className="form-control"
                                value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Năm xuất bản</label>
                            <input type="number" className="form-control"
                                value={form.publishYear} onChange={(e) => setForm({ ...form, publishYear: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Ngôn ngữ</label>
                        <input type="text" className="form-control"
                            value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea className="form-control" rows="3"
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Tác giả</label>
                        <div className="checkbox-grid">
                            {authors.map((a) => (
                                <label key={a.id} className="checkbox-item">
                                    <input type="checkbox" checked={form.authorIds.includes(a.id)}
                                        onChange={() => setForm({ ...form, authorIds: toggleArray(form.authorIds, a.id) })} />
                                    {a.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Thể loại</label>
                        <div className="checkbox-grid">
                            {categories.map((c) => (
                                <label key={c.id} className="checkbox-item">
                                    <input type="checkbox" checked={form.categoryIds.includes(c.id)}
                                        onChange={() => setForm({ ...form, categoryIds: toggleArray(form.categoryIds, c.id) })} />
                                    {c.name}
                                </label>
                            ))}
                        </div>
                    </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                            <button type="submit" className="btn btn-primary">{selectedBook ? 'Cập nhật' : 'Thêm mới'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Detail Modal */}
            <Modal isOpen={detailModal} onClose={() => setDetailModal(false)}
                title="Chi tiết sách" size="md">
                {selectedBook && (
                    <div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-label">Tiêu đề</div>
                                <div className="detail-value">{selectedBook.title}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">ISBN</div>
                                <div className="detail-value">{selectedBook.isbn || '—'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Năm xuất bản</div>
                                <div className="detail-value">{selectedBook.publishYear || '—'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Ngôn ngữ</div>
                                <div className="detail-value">{selectedBook.language || '—'}</div>
                            </div>
                        </div>
                        <div className="detail-item mt-lg">
                            <div className="detail-label">Mô tả</div>
                            <div className="detail-value">{selectedBook.description || 'Chưa có mô tả'}</div>
                        </div>
                        <div className="detail-item mt-md">
                            <div className="detail-label">Tác giả</div>
                            <div className="tag-list mt-md">
                                {selectedBook.authors?.map((a) => <span key={a.id} className="badge badge-blue">{a.name}</span>)}
                            </div>
                        </div>
                        <div className="detail-item mt-md">
                            <div className="detail-label">Thể loại</div>
                            <div className="tag-list mt-md">
                                {selectedBook.categories?.map((c) => <span key={c.id} className="badge badge-purple">{c.name}</span>)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
