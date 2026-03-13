import { useEffect, useState } from 'react';
import { IoAdd, IoEye, IoReturnUpBack } from 'react-icons/io5';
import { borrowService, bookService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function BorrowList() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [borrows, setBorrows] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowModal, setBorrowModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedBorrow, setSelectedBorrow] = useState(null);

    // Borrow form
    const [borrowForm, setBorrowForm] = useState({ items: [{ bookId: '', quantity: 1 }], dueDate: '' });
    // Return form
    const [returnItems, setReturnItems] = useState([]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [borrowRes, booksRes] = await Promise.all([
                borrowService.getAll(), bookService.getAll(),
            ]);
            setBorrows(borrowRes.data.data || []);
            setBooks(booksRes.data.data || []);
        } catch { toast.error('Không thể tải dữ liệu'); }
        finally { setLoading(false); }
    };

    // ─── Borrow ───
    const addBorrowItem = () => {
        setBorrowForm({ ...borrowForm, items: [...borrowForm.items, { bookId: '', quantity: 1 }] });
    };

    const removeBorrowItem = (idx) => {
        setBorrowForm({
            ...borrowForm,
            items: borrowForm.items.filter((_, i) => i !== idx),
        });
    };

    const updateBorrowItem = (idx, field, value) => {
        const items = [...borrowForm.items];
        items[idx][field] = value;
        setBorrowForm({ ...borrowForm, items });
    };

    const handleBorrow = async (e) => {
        e.preventDefault();
        const payload = {
            items: borrowForm.items.map((i) => ({ bookId: parseInt(i.bookId), quantity: parseInt(i.quantity) })),
            dueDate: borrowForm.dueDate || null,
        };
        try {
            await borrowService.create(payload);
            toast.success('Mượn sách thành công!');
            setBorrowModal(false);
            setBorrowForm({ items: [{ bookId: '', quantity: 1 }], dueDate: '' });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Mượn sách thất bại!');
        }
    };

    // ─── Return ───
    const openReturn = (borrow) => {
        if (!canManage) return;
        setSelectedBorrow(borrow);
        setReturnItems(
            borrow.items
                .filter((i) => i.quantity - i.returnedQuantity > 0)
                .map((i) => ({
                    bookId: i.bookId,
                    bookTitle: i.bookTitle,
                    maxReturn: i.quantity - i.returnedQuantity,
                    returnQuantity: i.quantity - i.returnedQuantity,
                }))
        );
        setReturnModal(true);
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        const payload = {
            items: returnItems
                .filter((i) => i.returnQuantity > 0)
                .map((i) => ({ bookId: i.bookId, returnQuantity: parseInt(i.returnQuantity) })),
        };
        try {
            await borrowService.returnBooks(selectedBorrow.record.id, payload);
            toast.success('Trả sách thành công!');
            setReturnModal(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Trả sách thất bại!');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'BORROWING') return <span className="badge badge-orange">Đang mượn</span>;
        if (status === 'RETURNED') return <span className="badge badge-green">Đã trả</span>;
        return <span className="badge badge-purple">{status}</span>;
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mượn / Trả sách</h1>
                    <p className="page-title-sub">{borrows.length} phiếu mượn</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={() => setBorrowModal(true)}><IoAdd /> Tạo phiếu mượn</button>
                )}
            </div>

            <div className="table-wrapper">
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Người mượn</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th><th>Sách</th><th>Thao tác</th></tr>
                        </thead>
                        <tbody>
                            {borrows.length === 0 ? (
                                <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>Chưa có phiếu mượn nào</td></tr>
                            ) : borrows.map((b) => (
                                <tr key={b.record.id}>
                                    <td>#{b.record.id}</td>
                                    <td><strong>{b.record.username}</strong></td>
                                    <td>{b.record.borrowDate}</td>
                                    <td>{b.record.dueDate}</td>
                                    <td>{getStatusBadge(b.record.status)}</td>
                                    <td>
                                        <div className="tag-list">
                                            {b.items?.map((item, i) => (
                                                <span key={i} className="tag">
                                                    {item.bookTitle} (x{item.quantity})
                                                    {item.returnedQuantity > 0 && ` ✓${item.returnedQuantity}`}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedBorrow(b); setDetailModal(true); }}>
                                                <IoEye />
                                            </button>
                                            {b.record.status === 'BORROWING' && canManage && (
                                                <button className="btn btn-ghost btn-sm text-success" onClick={() => openReturn(b)}>
                                                    <IoReturnUpBack />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Borrow Modal */}
            <Modal isOpen={borrowModal && canManage} onClose={() => setBorrowModal(false)} title="Tạo phiếu mượn" size="lg">
                <form onSubmit={handleBorrow}>
                    <div className="form-group">
                        <label>Ngày hạn trả (tùy chọn, mặc định 14 ngày)</label>
                        <input type="date" className="form-control" value={borrowForm.dueDate}
                            onChange={(e) => setBorrowForm({ ...borrowForm, dueDate: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Danh sách sách mượn</label>
                        {borrowForm.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <select className="form-control" style={{ flex: 3 }} required value={item.bookId}
                                    onChange={(e) => updateBorrowItem(idx, 'bookId', e.target.value)}>
                                    <option value="">-- Chọn sách --</option>
                                    {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                                <input type="number" className="form-control" style={{ flex: 1 }} min="1" required
                                    value={item.quantity} onChange={(e) => updateBorrowItem(idx, 'quantity', e.target.value)} />
                                {borrowForm.items.length > 1 && (
                                    <button type="button" className="btn btn-ghost btn-sm text-danger"
                                        onClick={() => removeBorrowItem(idx)}>✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addBorrowItem}>
                            <IoAdd /> Thêm sách
                        </button>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setBorrowModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary">Tạo phiếu mượn</button>
                    </div>
                </form>
            </Modal>

            {/* Return Modal */}
            <Modal isOpen={returnModal && canManage} onClose={() => setReturnModal(false)} title="Trả sách" size="md">
                <form onSubmit={handleReturn}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Phiếu mượn #{selectedBorrow?.record?.id} - {selectedBorrow?.record?.username}
                    </p>
                    {returnItems.map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px',
                            padding: '12px', background: 'var(--surface-2)', borderRadius: '8px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <strong>{item.bookTitle}</strong>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Tối đa trả: {item.maxReturn}</p>
                            </div>
                            <input type="number" className="form-control" style={{ width: '80px' }}
                                min="0" max={item.maxReturn} value={item.returnQuantity}
                                onChange={(e) => {
                                    const items = [...returnItems];
                                    items[idx].returnQuantity = e.target.value;
                                    setReturnItems(items);
                                }} />
                        </div>
                    ))}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setReturnModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-success">Xác nhận trả sách</button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Chi tiết phiếu mượn" size="md">
                {selectedBorrow && (
                    <div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-label">Mã phiếu</div>
                                <div className="detail-value">#{selectedBorrow.record.id}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Người mượn</div>
                                <div className="detail-value">{selectedBorrow.record.username}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Ngày mượn</div>
                                <div className="detail-value">{selectedBorrow.record.borrowDate}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Hạn trả</div>
                                <div className="detail-value">{selectedBorrow.record.dueDate}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Trạng thái</div>
                                <div className="detail-value">{getStatusBadge(selectedBorrow.record.status)}</div>
                            </div>
                        </div>
                        <h3 style={{ marginTop: '20px', marginBottom: '12px', fontSize: '1rem' }}>Sách mượn</h3>
                        <div className="table-responsive">
                            <table>
                                <thead><tr><th>Sách</th><th>SL mượn</th><th>Đã trả</th><th>Còn lại</th></tr></thead>
                                <tbody>
                                    {selectedBorrow.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.bookTitle}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-success">{item.returnedQuantity}</td>
                                            <td className={item.quantity - item.returnedQuantity > 0 ? 'text-warning' : 'text-success'}>
                                                {item.quantity - item.returnedQuantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
