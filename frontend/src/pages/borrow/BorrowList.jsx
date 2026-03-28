import { useEffect, useState } from 'react';
import { IoAdd, IoEye, IoReturnUpBack, IoCheckmark, IoClose } from 'react-icons/io5';
import { borrowService, bookService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function BorrowList() {
    const { isAdmin, isLibrarian, user } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [borrows, setBorrows] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'my-requests'
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');
    
    const [borrowModal, setBorrowModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [decisionModal, setDecisionModal] = useState(false);
    const [selectedBorrow, setSelectedBorrow] = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [decisionAction, setDecisionAction] = useState(null); // 'approve' or 'reject'

    // Borrow form (for admin creating borrow directly)
    const [borrowForm, setBorrowForm] = useState({ items: [{ bookId: '', quantity: 1 }], dueDate: '' });
    // Request form (for user requesting to borrow)
    const [requestForm, setRequestForm] = useState({ items: [{ bookId: '', quantity: 1 }], dueDate: '' });
    // Return form
    const [returnItems, setReturnItems] = useState([]);
    // Decision form
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => { loadData(); }, [user, canManage]);

    const loadData = async () => {
        try {
            const promises = [
                borrowService.getAll(),
                bookService.getAll(),
            ];
            
            // Load pending requests only for admins
            if (canManage) {
                promises.push(borrowService.getPending());
            } else {
                promises.push(Promise.resolve({ data: { data: [] } }));
            }
            
            // Load my requests only for regular users
            if (user && !canManage) {
                promises.push(borrowService.getMyRequests());
            } else {
                promises.push(Promise.resolve({ data: { data: [] } }));
            }
            
            const [borrowRes, booksRes, pendingRes, myReqRes] = await Promise.all(promises);
            setBorrows(borrowRes.data.data || []);
            setBooks(booksRes.data.data || []);
            setPendingRequests(pendingRes.data.data || []);
            setMyRequests(myReqRes.data.data || []);
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

    // ─── Borrow Request (User Request) ───
    const addRequestItem = () => {
        setRequestForm({ ...requestForm, items: [...requestForm.items, { bookId: '', quantity: 1 }] });
    };

    const removeRequestItem = (idx) => {
        setRequestForm({
            ...requestForm,
            items: requestForm.items.filter((_, i) => i !== idx),
        });
    };

    const updateRequestItem = (idx, field, value) => {
        const items = [...requestForm.items];
        items[idx][field] = value;
        setRequestForm({ ...requestForm, items });
    };

    const handleBorrowRequest = async (e) => {
        e.preventDefault();
        const payload = {
            items: requestForm.items.map((i) => ({ bookId: parseInt(i.bookId), quantity: parseInt(i.quantity) })),
            dueDate: requestForm.dueDate || null,
        };
        try {
            await borrowService.createRequest(payload);
            toast.success('Đã gửi yêu cầu mượn sách, vui lòng chờ admin duyệt!');
            setRequestModal(false);
            setRequestForm({ items: [{ bookId: '', quantity: 1 }], dueDate: '' });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gửi yêu cầu mượn thất bại!');
        }
    };

    // ─── Approve / Reject ───
    const openDecisionModal = (borrowId, action) => {
        setSelectedBorrow({ record: { id: borrowId } });
        setDecisionAction(action);
        setAdminNote('');
        setDecisionModal(true);
    };

    const handleApprove = async () => {
        try {
            setApprovingId(selectedBorrow.record.id);
            await borrowService.approve(selectedBorrow.record.id, { adminNote });
            toast.success('Duyệt yêu cầu mượn thành công!');
            setAdminNote('');
            setDecisionModal(false);
            setPendingRequests(pendingRequests.filter(r => r.record.id !== selectedBorrow.record.id));
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Duyệt yêu cầu thất bại!');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async () => {
        try {
            setApprovingId(selectedBorrow.record.id);
            await borrowService.reject(selectedBorrow.record.id, { adminNote });
            toast.success('Từ chối yêu cầu mượn!');
            setAdminNote('');
            setDecisionModal(false);
            setPendingRequests(pendingRequests.filter(r => r.record.id !== selectedBorrow.record.id));
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Từ chối yêu cầu thất bại!');
        } finally {
            setApprovingId(null);
        }
    };

    // ─── Return ───
    const openReturn = (borrow) => {
        if (!canManage) return;
        setSelectedBorrow(borrow);
        setReturnItems(
            (borrow.items || [])
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
        const statusMap = {
            'PENDING': { label: 'Chờ duyệt', class: 'badge-purple' },
            'APPROVED': { label: 'Đã duyệt', class: 'badge-blue' },
            'REJECTED': { label: 'Bị từ chối', class: 'badge-red' },
            'BORROWING': { label: 'Đang mượn', class: 'badge-orange' },
            'RETURNED': { label: 'Đã trả', class: 'badge-green' },
        };
        const info = statusMap[status] || { label: status, class: 'badge-gray' };
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    const getNextStatusOptions = (status) => {
        if (status === 'PENDING') {
            return [
                { value: 'BORROWING', label: 'Duyệt -> Đang mượn' },
                { value: 'REJECTED', label: 'Từ chối yêu cầu' },
            ];
        }
        if (status === 'BORROWING') {
            return [{ value: 'RETURNED', label: 'Chuyển sang: Đã trả' }];
        }
        return [];
    };

    const handleStatusChange = async (borrow, nextStatus) => {
        if (!canManage || !nextStatus) return;

        const currentStatus = borrow?.record?.status;
        const borrowId = borrow?.record?.id;
        if (!borrowId || !currentStatus || currentStatus === nextStatus) return;

        try {
            setApprovingId(borrowId);

            if (currentStatus === 'PENDING' && nextStatus === 'BORROWING') {
                const note = window.prompt('Ghi chú duyệt (tùy chọn):', '') || '';
                await borrowService.approve(borrowId, { adminNote: note });
                toast.success('Đã cập nhật trạng thái: Đang mượn');
                await loadData();
                return;
            }

            if (currentStatus === 'PENDING' && nextStatus === 'REJECTED') {
                const note = window.prompt('Lý do từ chối (tùy chọn):', '') || '';
                await borrowService.reject(borrowId, { adminNote: note });
                toast.success('Đã cập nhật trạng thái: Bị từ chối');
                await loadData();
                return;
            }

            if (currentStatus === 'BORROWING' && nextStatus === 'RETURNED') {
                openReturn(borrow);
                return;
            }

            toast.error('Không thể chuyển trạng thái theo lựa chọn này.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại!');
        } finally {
            setApprovingId(null);
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    const getDisplayData = () => {
        if (activeTab === 'pending') return pendingRequests;
        if (activeTab === 'my-requests') return myRequests;
        return borrows;
    };

    const parseDate = (value) => {
        if (!value) return null;
        const date = new Date(`${value}T00:00:00`);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const rawDisplayData = getDisplayData();
    const displayData = rawDisplayData.filter((b) => {
        if (statusFilter !== 'all' && b.record.status !== statusFilter) {
            return false;
        }

        const borrowDate = parseDate(b.record.borrowDate);
        const fromDate = parseDate(fromDateFilter);
        const toDate = parseDate(toDateFilter);

        if (fromDate && borrowDate && borrowDate < fromDate) {
            return false;
        }
        if (toDate && borrowDate && borrowDate > toDate) {
            return false;
        }

        return true;
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mượn / Trả sách</h1>
                    <p className="page-title-sub">{borrows.length} phiếu mượn</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {!canManage && (
                        <button className="btn btn-primary" onClick={() => setRequestModal(true)}>
                            <IoAdd /> Gửi yêu cầu mượn
                        </button>
                    )}
                    {canManage && (
                        <button className="btn btn-primary" onClick={() => setBorrowModal(true)}>
                            <IoAdd /> Tạo phiếu mượn
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        padding: '8px 16px',
                        background: activeTab === 'all' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'all' ? 'white' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'all' ? '600' : '400',
                    }}
                >
                    Tất cả phiếu ({borrows.length})
                </button>
                {canManage && (
                    <button
                        onClick={() => setActiveTab('pending')}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'pending' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'pending' ? '600' : '400',
                        }}
                    >
                        Chờ duyệt ({pendingRequests.length})
                    </button>
                )}
                {!canManage && (
                    <button
                        onClick={() => setActiveTab('my-requests')}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === 'my-requests' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'my-requests' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'my-requests' ? '600' : '400',
                        }}
                    >
                        Yêu cầu của tôi ({myRequests.length})
                    </button>
                )}
            </div>

            {canManage && (
                <div className="table-wrapper" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto auto', gap: '12px', alignItems: 'end' }}>
                        <label style={{ fontSize: '1rem', fontWeight: '600', color: '#546e7a' }}>Bộ lọc:</label>
                        <select
                            className="form-control"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ duyệt</option>
                            <option value="BORROWING">Đang mượn</option>
                            <option value="RETURNED">Đã trả</option>
                            <option value="REJECTED">Bị từ chối</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#546e7a' }}>Từ:</span>
                            <input
                                type="date"
                                className="form-control"
                                style={{ minWidth: '140px' }}
                                value={fromDateFilter}
                                onChange={(e) => setFromDateFilter(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#546e7a' }}>Đến:</span>
                            <input
                                type="date"
                                className="form-control"
                                style={{ minWidth: '140px' }}
                                value={toDateFilter}
                                onChange={(e) => setToDateFilter(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setStatusFilter('all');
                                setFromDateFilter('');
                                setToDateFilter('');
                            }}
                        >
                            Xóa lọc
                        </button>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người mượn</th>
                                <th>Ngày mượn</th>
                                <th>Hạn trả</th>
                                <th>Trạng thái</th>
                                <th>Sách</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>
                                        {activeTab === 'pending' ? 'Không có yêu cầu nào chờ duyệt' : 'Chưa có phiếu mượn nào'}
                                    </td>
                                </tr>
                            ) : displayData.map((b) => (
                                <tr key={b.record.id}>
                                    <td>#{b.record.id}</td>
                                    <td><strong>{b.record.username}</strong></td>
                                    <td>{b.record.borrowDate}</td>
                                    <td>{b.record.dueDate || '-'}</td>
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
                                            <button 
                                                className="btn btn-ghost btn-sm" 
                                                onClick={() => { setSelectedBorrow(b); setDetailModal(true); }}
                                            >
                                                <IoEye />
                                            </button>
                                            {canManage && getNextStatusOptions(b.record.status).length > 0 && (
                                                <select
                                                    className="form-control"
                                                    style={{ minWidth: '180px', height: '32px' }}
                                                    defaultValue=""
                                                    disabled={approvingId === b.record.id}
                                                    onChange={(e) => {
                                                        const nextStatus = e.target.value;
                                                        e.target.value = '';
                                                        handleStatusChange(b, nextStatus);
                                                    }}
                                                >
                                                    <option value="">Chỉnh trạng thái...</option>
                                                    {getNextStatusOptions(b.record.status).map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {activeTab === 'pending' && canManage && (
                                                <>
                                                    <button 
                                                        className="btn btn-ghost btn-sm text-success" 
                                                        onClick={() => openDecisionModal(b.record.id, 'approve')}
                                                        disabled={approvingId === b.record.id}
                                                    >
                                                        <IoCheckmark />
                                                    </button>
                                                    <button 
                                                        className="btn btn-ghost btn-sm text-danger" 
                                                        onClick={() => openDecisionModal(b.record.id, 'reject')}
                                                        disabled={approvingId === b.record.id}
                                                    >
                                                        <IoClose />
                                                    </button>
                                                </>
                                            )}
                                            {b.record.status === 'BORROWING' && canManage && (
                                                <button 
                                                    className="btn btn-ghost btn-sm text-success" 
                                                    onClick={() => openReturn(b)}
                                                >
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

            {/* ───── MODALS ───── */}

            {/* Create Borrow Modal (Admin) */}
            <Modal isOpen={borrowModal && canManage} onClose={() => setBorrowModal(false)} title="Tạo phiếu mượn" size="lg">
                <form onSubmit={handleBorrow}>
                    <div className="form-group">
                        <label>Ngày hạn trả (tùy chọn, mặc định 14 ngày)</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={borrowForm.dueDate}
                            onChange={(e) => setBorrowForm({ ...borrowForm, dueDate: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Danh sách sách mượn</label>
                        {borrowForm.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <select 
                                    className="form-control" 
                                    style={{ flex: 3 }} 
                                    required 
                                    value={item.bookId}
                                    onChange={(e) => updateBorrowItem(idx, 'bookId', e.target.value)}
                                >
                                    <option value="">-- Chọn sách --</option>
                                    {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    style={{ flex: 1 }} 
                                    min="1" 
                                    required
                                    value={item.quantity} 
                                    onChange={(e) => updateBorrowItem(idx, 'quantity', e.target.value)} 
                                />
                                {borrowForm.items.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-ghost btn-sm text-danger"
                                        onClick={() => removeBorrowItem(idx)}
                                    >
                                        ✕
                                    </button>
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

            {/* Borrow Request Modal (User) */}
            <Modal isOpen={requestModal && !canManage} onClose={() => setRequestModal(false)} title="Gửi yêu cầu mượn sách" size="lg">
                <form onSubmit={handleBorrowRequest}>
                    <div className="form-group">
                        <label>Ngày hạn trả (tùy chọn)</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={requestForm.dueDate}
                            onChange={(e) => setRequestForm({ ...requestForm, dueDate: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Danh sách sách muốn mượn</label>
                        {requestForm.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <select 
                                    className="form-control" 
                                    style={{ flex: 3 }} 
                                    required 
                                    value={item.bookId}
                                    onChange={(e) => updateRequestItem(idx, 'bookId', e.target.value)}
                                >
                                    <option value="">-- Chọn sách --</option>
                                    {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    style={{ flex: 1 }} 
                                    min="1" 
                                    required
                                    value={item.quantity} 
                                    onChange={(e) => updateRequestItem(idx, 'quantity', e.target.value)} 
                                />
                                {requestForm.items.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-ghost btn-sm text-danger"
                                        onClick={() => removeRequestItem(idx)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addRequestItem}>
                            <IoAdd /> Thêm sách
                        </button>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setRequestModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary">Gửi yêu cầu mượn</button>
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
                            <input 
                                type="number" 
                                className="form-control" 
                                style={{ width: '80px' }}
                                min="0" 
                                max={item.maxReturn} 
                                value={item.returnQuantity}
                                onChange={(e) => {
                                    const items = [...returnItems];
                                    items[idx].returnQuantity = e.target.value;
                                    setReturnItems(items);
                                }} 
                            />
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
                                <div className="detail-value">{selectedBorrow.record.dueDate || '-'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Trạng thái</div>
                                <div className="detail-value">{getStatusBadge(selectedBorrow.record.status)}</div>
                            </div>
                            {selectedBorrow.record.adminNote && (
                                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                    <div className="detail-label">Ghi chú từ admin</div>
                                    <div className="detail-value">{selectedBorrow.record.adminNote}</div>
                                </div>
                            )}
                        </div>
                        <h3 style={{ marginTop: '20px', marginBottom: '12px', fontSize: '1rem' }}>Sách mượn</h3>
                        <div className="table-responsive">
                            <table>
                                <thead><tr><th>Sách</th><th>SL mượn</th><th>Đã trả</th><th>Còn lại</th></tr></thead>
                                <tbody>
                                    {(selectedBorrow.items || []).map((item) => (
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

            {/* Decision Modal (Approve/Reject) */}
            <Modal 
                isOpen={decisionModal && canManage} 
                onClose={() => { setDecisionModal(false); setDecisionAction(null); }} 
                title={decisionAction === 'approve' ? 'Duyệt yêu cầu mượn' : 'Từ chối yêu cầu mượn'} 
                size="md"
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (decisionAction === 'approve') {
                        handleApprove();
                    } else {
                        handleReject();
                    }
                }}>
                    <div className="form-group">
                        <label>Mã phiếu</label>
                        <div className="form-control" style={{ background: 'var(--surface-2)', cursor: 'default' }}>
                            #{selectedBorrow?.record?.id}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Ghi chú từ admin (tùy chọn)</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Nhập ghi chú (tối đa 500 ký tự)..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value.slice(0, 500))}
                            maxLength="500"
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {adminNote.length}/500
                        </div>
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => { setDecisionModal(false); setDecisionAction(null); }}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className={decisionAction === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
                        >
                            {decisionAction === 'approve' ? 'Duyệt' : 'Từ chối'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
