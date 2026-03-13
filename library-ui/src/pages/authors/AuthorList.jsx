import { useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';
import { authorService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AuthorList() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ name: '', biography: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await authorService.getAll();
            setAuthors(res.data.data || []);
        } catch { toast.error('Không thể tải danh sách tác giả'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        if (!canManage) return;
        setSelected(null);
        setForm({ name: '', biography: '' });
        setModalOpen(true);
    };

    const openEdit = (author) => {
        if (!canManage) return;
        setSelected(author);
        setForm({ name: author.name || '', biography: author.biography || '' });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selected) {
                await authorService.update(selected.id, form);
                toast.success('Cập nhật tác giả thành công!');
            } else {
                await authorService.create(form);
                toast.success('Thêm tác giả thành công!');
            }
            setModalOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!canManage) return;
        if (!confirm('Bạn có chắc muốn xóa tác giả này?')) return;
        try {
            await authorService.delete(id);
            toast.success('Xóa tác giả thành công!');
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa thất bại!');
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý Tác giả</h1>
                    <p className="page-title-sub">{authors.length} tác giả</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={openCreate}><IoAdd /> Thêm tác giả</button>
                )}
            </div>

            <div className="table-wrapper">
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>ID</th><th>Tên tác giả</th><th>Tiểu sử</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {authors.length === 0 ? (
                                <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '40px' }}>Chưa có tác giả nào</td></tr>
                            ) : authors.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td><strong>{a.name}</strong></td>
                                    <td><span className="text-muted">{a.biography ? (a.biography.length > 80 ? a.biography.substring(0, 80) + '...' : a.biography) : '—'}</span></td>
                                    <td>
                                        {canManage && (
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}><IoPencil /></button>
                                                <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(a.id)}><IoTrash /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modalOpen && canManage} onClose={() => setModalOpen(false)}
                title={selected ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên tác giả *</label>
                        <input type="text" className="form-control" required
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Tiểu sử</label>
                        <textarea className="form-control" rows="4"
                            value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} />
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
