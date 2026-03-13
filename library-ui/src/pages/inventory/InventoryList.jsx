import { useEffect, useState } from 'react';
import { IoAdd, IoArrowUp, IoArrowDown, IoDocumentText } from 'react-icons/io5';
import { inventoryService, bookService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function InventoryList() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [inventory, setInventory] = useState([]);
    const [logs, setLogs] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('stock'); // 'stock' | 'logs'
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'increase' | 'decrease'
    const [form, setForm] = useState({ bookId: '', quantity: '', note: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [invRes, logsRes, booksRes] = await Promise.all([
                inventoryService.getAll(),
                inventoryService.getAllLogs(),
                bookService.getAll(),
            ]);
            setInventory(invRes.data.data || []);
            setLogs(logsRes.data.data || []);
            setBooks(booksRes.data.data || []);
        } catch { toast.error('Không thể tải dữ liệu kho'); }
        finally { setLoading(false); }
    };

    const openModal = (type) => {
        if (!canManage) return;
        setModalType(type);
        setForm({ bookId: '', quantity: '', note: '' });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { bookId: parseInt(form.bookId), quantity: parseInt(form.quantity), note: form.note };
        try {
            if (modalType === 'add') await inventoryService.add(payload);
            else if (modalType === 'increase') await inventoryService.increase(payload);
            else await inventoryService.decrease(payload);
            toast.success('Thao tác kho thành công!');
            setModalOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const getChangeTypeBadge = (type) => {
        const map = {
            IMPORT: ['badge-green', 'Nhập kho'],
            BORROW: ['badge-orange', 'Mượn'],
            RETURN: ['badge-blue', 'Trả'],
            INCREASE: ['badge-cyan', 'Tăng'],
            DECREASE: ['badge-red', 'Giảm'],
        };
        const [cls, label] = map[type] || ['badge-purple', type];
        return <span className={`badge ${cls}`}>{label}</span>;
    };

    const modalTitle = { add: 'Nhập kho sách', increase: 'Tăng số lượng', decrease: 'Giảm số lượng' };

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý Kho sách</h1>
                    <p className="page-title-sub">{inventory.length} đầu sách trong kho</p>
                </div>
                {canManage && (
                    <div className="page-actions">
                        <button className="btn btn-primary" onClick={() => openModal('add')}><IoAdd /> Nhập kho</button>
                        <button className="btn btn-success" onClick={() => openModal('increase')}><IoArrowUp /> Tăng</button>
                        <button className="btn btn-danger" onClick={() => openModal('decrease')}><IoArrowDown /> Giảm</button>
                    </div>
                )}
            </div>

            <div className="tab-nav">
                <button className={`tab-item ${tab === 'stock' ? 'active' : ''}`} onClick={() => setTab('stock')}>
                    Tồn kho
                </button>
                <button className={`tab-item ${tab === 'logs' ? 'active' : ''}`} onClick={() => setTab('logs')}>
                    <IoDocumentText style={{ marginRight: 4 }} /> Lịch sử ({logs.length})
                </button>
            </div>

            {tab === 'stock' ? (
                <div className="table-wrapper">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>Sách</th><th>Tổng SL</th><th>Khả dụng</th><th>Đang mượn</th><th>Trạng thái</th></tr>
                            </thead>
                            <tbody>
                                {inventory.map((inv) => (
                                    <tr key={inv.id}>
                                        <td><strong>{inv.bookTitle}</strong> <span className="text-muted">(#{inv.bookId})</span></td>
                                        <td>{inv.totalQuantity}</td>
                                        <td style={{ color: inv.availableQuantity > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                                            {inv.availableQuantity}
                                        </td>
                                        <td>{inv.totalQuantity - inv.availableQuantity}</td>
                                        <td>
                                            {inv.availableQuantity > 0 ?
                                                <span className="badge badge-green">Còn sách</span> :
                                                <span className="badge badge-red">Hết sách</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="table-wrapper">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>Thời gian</th><th>Sách</th><th>Loại</th><th>SL thay đổi</th><th>Tổng sau</th><th>KD sau</th><th>Ghi chú</th></tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="text-muted">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                        <td><strong>{log.bookTitle}</strong></td>
                                        <td>{getChangeTypeBadge(log.changeType)}</td>
                                        <td style={{ fontWeight: 600 }}>{log.quantityChanged > 0 ? '+' : ''}{log.quantityChanged}</td>
                                        <td>{log.totalAfter}</td>
                                        <td>{log.availableAfter}</td>
                                        <td className="text-muted">{log.note || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={modalOpen && canManage} onClose={() => setModalOpen(false)} title={modalTitle[modalType]}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Chọn sách *</label>
                        <select className="form-control" required value={form.bookId}
                            onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
                            <option value="">-- Chọn sách --</option>
                            {books.map((b) => <option key={b.id} value={b.id}>{b.title} (#{b.id})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Số lượng *</label>
                        <input type="number" className="form-control" min="1" required
                            value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea className="form-control" rows="2" value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary">Xác nhận</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
