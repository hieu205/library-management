import { useEffect, useMemo, useState } from 'react';
import { IoAdd, IoSearch, IoPencil, IoTrash, IoEye } from 'react-icons/io5';
import { bookService, authorService, categoryService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function BookList() {
    const { isAdmin } = useAuth();
    const canManage = isAdmin;
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', isbn: '', publishYear: '', language: 'Tiếng Việt',
        authorIds: [], categoryIds: [],
        imageUrl1: '', imageUrl2: '', imageUrl3: '',
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const requests = [bookService.getAll(), authorService.getAll(), categoryService.getAll()];
            const responses = await Promise.all(requests);
            const [booksRes, authorsRes, catsRes] = responses;
            setBooks(booksRes.data.data || []);
            setAuthors(authorsRes?.data?.data || []);
            setCategories(catsRes?.data?.data || []);
        } catch { toast.error('Không thể tải danh sách sách'); }
        finally { setLoading(false); }
    };

    const filteredBooks = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return books
            .filter((book) => {
                if (authorFilter === 'all') return true;
                return book.authors?.some((a) => String(a.id) === authorFilter);
            })
            .filter((book) => {
                if (categoryFilter === 'all') return true;
                return book.categories?.some((c) => String(c.id) === categoryFilter);
            })
            .filter((book) => {
                if (!keyword) return true;
                return (
                    book.title?.toLowerCase().includes(keyword) ||
                    book.isbn?.toLowerCase().includes(keyword) ||
                    book.authors?.some((a) => a.name?.toLowerCase().includes(keyword)) ||
                    book.categories?.some((c) => c.name?.toLowerCase().includes(keyword))
                );
            });
    }, [books, search, authorFilter, categoryFilter]);

    const openCreate = () => {
        setSelectedBook(null);
        setForm({ title: '', description: '', isbn: '', publishYear: '', language: 'Tiếng Việt', authorIds: [], categoryIds: [], imageUrl1: '', imageUrl2: '', imageUrl3: '' });
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
            imageUrl1: book.images?.imageUrl1 || '',
            imageUrl2: book.images?.imageUrl2 || '',
            imageUrl3: book.images?.imageUrl3 || '',
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
            isbn: form.isbn || null,
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
            const details = err.response?.data?.details;
            const detailMessage = details
                ? Object.values(details).join(' | ')
                : null;
            const status = err.response?.status;
            if (status === 403) {
                toast.error('Bạn không có quyền thêm/cập nhật sách (chỉ ADMIN).');
                return;
            }
            toast.error(detailMessage || err.response?.data?.message || 'Thao tác thất bại!');
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
            if (err.response?.status === 403) {
                toast.error('Bạn không có quyền xóa sách (chỉ ADMIN).');
                return;
            }
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
                    <p className="page-title-sub">{filteredBooks.length} / {books.length} cuốn sách trong thư viện</p>
                </div>
                {canManage && (
                    <div className="page-actions">
                        <button className="btn btn-primary" onClick={openCreate}><IoAdd /> Thêm sách</button>
                    </div>
                )}
            </div>

            <div className="table-wrapper">
                <div className="table-toolbar" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center' }}>
                    <div className="search-wrapper">
                        <IoSearch />
                        <input type="text" className="search-input" placeholder="Tìm kiếm sách..."
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select
                        className="form-control"
                        value={authorFilter}
                        onChange={(e) => setAuthorFilter(e.target.value)}
                    >
                        <option value="all">Tất cả tác giả</option>
                        {authors.map((a) => (
                            <option key={a.id} value={String(a.id)}>{a.name}</option>
                        ))}
                    </select>
                    <select
                        className="form-control"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Tất cả thể loại</option>
                        {categories.map((c) => (
                            <option key={c.id} value={String(c.id)}>{c.name}</option>
                        ))}
                    </select>
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
                            {filteredBooks.length === 0 ? (
                                <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Không tìm thấy sách nào
                                </td></tr>
                            ) : filteredBooks.map((book) => (
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
                    <div className="form-group">
                        <label>Ảnh chính (URL) *</label>
                        <input type="text" className="form-control" required placeholder="https://example.com/image1.jpg"
                            value={form.imageUrl1} onChange={(e) => setForm({ ...form, imageUrl1: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Ảnh phụ 1 (URL) *</label>
                        <input type="text" className="form-control" required placeholder="https://example.com/image2.jpg"
                            value={form.imageUrl2} onChange={(e) => setForm({ ...form, imageUrl2: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Ảnh phụ 2 (URL) *</label>
                        <input type="text" className="form-control" required placeholder="https://example.com/image3.jpg"
                            value={form.imageUrl3} onChange={(e) => setForm({ ...form, imageUrl3: e.target.value })} />
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
                        {selectedBook.images && (
                            <div className="detail-item mt-md">
                                <div className="detail-label">Hình ảnh</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
                                    <div>
                                        <img src={selectedBook.images.imageUrl1} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} alt="Ảnh chính" />
                                        <small className="text-muted" style={{ marginTop: '8px', display: 'block' }}>Ảnh chính</small>
                                    </div>
                                    <div>
                                        <img src={selectedBook.images.imageUrl2} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} alt="Ảnh phụ 1" />
                                        <small className="text-muted" style={{ marginTop: '8px', display: 'block' }}>Ảnh phụ 1</small>
                                    </div>
                                    <div>
                                        <img src={selectedBook.images.imageUrl3} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} alt="Ảnh phụ 2" />
                                        <small className="text-muted" style={{ marginTop: '8px', display: 'block' }}>Ảnh phụ 2</small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
