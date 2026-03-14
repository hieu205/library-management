import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, refreshProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('info'); // 'info' | 'history' | 'current' | 'password'
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', username: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [history, setHistory] = useState([]);
    const [currentBorrows, setCurrentBorrows] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '', username: user.username || '' });
        }
    }, [user]);

    useEffect(() => {
        if (tab === 'history') loadHistory();
        if (tab === 'current') loadCurrentBorrows();
    }, [tab]);

    const loadHistory = async () => {
        setLoadingData(true);
        try {
            const res = await authService.getMyBorrowHistory();
            setHistory(res.data.data?.content || []);
        } catch { toast.error('Không thể tải lịch sử mượn'); }
        finally { setLoadingData(false); }
    };

    const loadCurrentBorrows = async () => {
        setLoadingData(true);
        try {
            const res = await authService.getMyCurrentBorrows();
            setCurrentBorrows(res.data.data?.content || []);
        } catch { toast.error('Không thể tải danh sách đang mượn'); }
        finally { setLoadingData(false); }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await authService.updateProfile(form);
            toast.success('Cập nhật hồ sơ thành công!');
            await refreshProfile();
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cập nhật thất bại!');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            logout();
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'BORROWING') return <span className="badge badge-orange">Đang mượn</span>;
        if (status === 'RETURNED') return <span className="badge badge-green">Đã trả</span>;
        return <span className="badge badge-purple">{status}</span>;
    };

    return (
        <div>
            <div className="page-header">
                <div className="profile-header">
                    <div className="profile-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <div className="profile-info">
                        <h2>{user?.fullName || 'User'}</h2>
                        <p>{user?.email} • <span className={`badge ${user?.role === 'ADMIN' ? 'badge-purple' : 'badge-blue'}`}>{user?.role || 'MEMBER'}</span></p>
                    </div>
                </div>
            </div>

            <div className="tab-nav">
                <button className={`tab-item ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Thông tin</button>
                <button className={`tab-item ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Lịch sử mượn</button>
                <button className={`tab-item ${tab === 'current' ? 'active' : ''}`} onClick={() => setTab('current')}>Đang mượn</button>
                <button className={`tab-item ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>Đổi mật khẩu</button>
            </div>

            {/* Info Tab */}
            {tab === 'info' && (
                <div className="card">
                    {!editing ? (
                        <div>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <div className="detail-label">Họ và tên</div>
                                    <div className="detail-value">{user?.fullName}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Tên đăng nhập</div>
                                    <div className="detail-value">{user?.username}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Email</div>
                                    <div className="detail-value">{user?.email}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Số điện thoại</div>
                                    <div className="detail-value">{user?.phone || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Vai trò</div>
                                    <div className="detail-value">{user?.role}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Trạng thái</div>
                                    <div className="detail-value">
                                        {user?.active ? <span className="badge badge-green">Hoạt động</span> : <span className="badge badge-red">Bị khóa</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={() => setEditing(true)}>Chỉnh sửa</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" className="form-control" value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="text" className="form-control" value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* History Tab */}
            {tab === 'history' && (
                <div className="table-wrapper">
                    {loadingData ? (
                        <div className="loading-screen"><div className="spinner" /></div>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead><tr><th>#</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th><th>Sách</th></tr></thead>
                                <tbody>
                                    {history.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '40px' }}>Chưa có lịch sử mượn</td></tr>
                                    ) : history.map((b) => (
                                        <tr key={b.record.id}>
                                            <td>#{b.record.id}</td>
                                            <td>{b.record.borrowDate}</td>
                                            <td>{b.record.dueDate}</td>
                                            <td>{getStatusBadge(b.record.status)}</td>
                                            <td>
                                                <div className="tag-list">
                                                    {b.items?.map((item, i) => (
                                                        <span key={i} className="tag">{item.bookTitle} (x{item.quantity})</span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Current Borrows Tab */}
            {tab === 'current' && (
                <div className="table-wrapper">
                    {loadingData ? (
                        <div className="loading-screen"><div className="spinner" /></div>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead><tr><th>#</th><th>Ngày mượn</th><th>Hạn trả</th><th>Sách</th><th>Đã trả</th></tr></thead>
                                <tbody>
                                    {currentBorrows.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '40px' }}>Không có sách đang mượn</td></tr>
                                    ) : currentBorrows.map((b) => (
                                        <tr key={b.record.id}>
                                            <td>#{b.record.id}</td>
                                            <td>{b.record.borrowDate}</td>
                                            <td>{b.record.dueDate}</td>
                                            <td>
                                                <div className="tag-list">
                                                    {b.items?.map((item, i) => (
                                                        <span key={i} className="tag">{item.bookTitle} (x{item.quantity})</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                {b.items?.map((item, i) => (
                                                    <span key={i} className="text-muted">{item.returnedQuantity}/{item.quantity} </span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Change Password Tab */}
            {tab === 'password' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label>Mật khẩu hiện tại</label>
                            <input type="password" className="form-control" required value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input type="password" className="form-control" required minLength="6" value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input type="password" className="form-control" required value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
