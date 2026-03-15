import { useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoTrash, IoLockClosed, IoLockOpen } from 'react-icons/io5';
import { userService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function UserList() {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        username: '', email: '', password: '', fullName: '', phone: '',
    });

    useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

    const loadData = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data.data || []);
        } catch { toast.error('Không thể tải danh sách người dùng'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        if (!isAdmin) return;
        setSelected(null);
        setForm({ username: '', email: '', password: '', fullName: '', phone: '' });
        setModalOpen(true);
    };

    const openEdit = (user) => {
        if (!isAdmin) return;
        setSelected(user);
        setForm({
            username: user.username || '',
            email: user.email || '',
            password: '',
            fullName: user.fullName || '',
            phone: user.phone || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selected) {
                const payload = { ...form };
                if (!payload.password) delete payload.password;
                await userService.update(selected.id, payload);
                toast.success('Cập nhật người dùng thành công!');
            } else {
                await userService.create(form);
                toast.success('Tạo người dùng thành công!');
            }
            setModalOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const toggleStatus = async (user) => {
        if (!isAdmin) return;
        try {
            await userService.updateStatus(user.id, { active: !user.active });
            toast.success(user.active ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await userService.delete(id);
            toast.success('Xóa người dùng thành công!');
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa thất bại!');
        }
    };

    if (!isAdmin) {
        return (
            <div className="card">
                <p className="text-muted">Bạn không có quyền truy cập trang quản lý người dùng.</p>
            </div>
        );
    }

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý Người dùng</h1>
                    <p className="page-title-sub">{users.length} người dùng</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}><IoAdd /> Thêm người dùng</button>
            </div>

            <div className="table-wrapper">
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Họ tên</th><th>Username</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td><strong>{u.fullName}</strong></td>
                                    <td>{u.username}</td>
                                    <td className="text-muted">{u.email}</td>
                                    <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-blue'}`}>{u.role || 'MEMBER'}</span></td>
                                    <td>
                                        {u.active ?
                                            <span className="badge badge-green">Hoạt động</span> :
                                            <span className="badge badge-red">Bị khóa</span>
                                        }
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><IoPencil /></button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(u)}
                                                title={u.active ? 'Khóa' : 'Mở khóa'}>
                                                {u.active ? <IoLockClosed /> : <IoLockOpen />}
                                            </button>
                                            <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(u.id)}><IoTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modalOpen && isAdmin} onClose={() => setModalOpen(false)}
                title={selected ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên *</label>
                        <input type="text" className="form-control" required
                            value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Tên đăng nhập *</label>
                        <input type="text" className="form-control" required disabled={!!selected}
                            value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" className="form-control" required
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" className="form-control"
                            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>{selected ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}</label>
                        <input type="password" className="form-control" required={!selected}
                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary">{selected ? 'Cập nhật' : 'Thêm mới'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
