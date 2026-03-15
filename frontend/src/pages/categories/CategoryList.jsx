import { useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';
import { categoryService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CategoryList() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data.data || []);
        } catch { toast.error('Không thể tải danh sách thể loại'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        if (!canManage) return;
        setSelected(null);
        setForm({ name: '', description: '' });
        setModalOpen(true);
    };

    const openEdit = (cat) => {
        if (!canManage) return;
        setSelected(cat);
        setForm({ name: cat.name || '', description: cat.description || '' });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selected) {
                await categoryService.update(selected.id, form);
                toast.success('Cập nhật thể loại thành công!');
            } else {
                await categoryService.create(form);
                toast.success('Thêm thể loại thành công!');
            }
            setModalOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!canManage) return;
        if (!confirm('Bạn có chắc muốn xóa thể loại này?')) return;
        try {
            await categoryService.delete(id);
            toast.success('Xóa thể loại thành công!');
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
                    <h1 className="page-title">Quản lý Thể loại</h1>
                    <p className="page-title-sub">{categories.length} thể loại</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={openCreate}><IoAdd /> Thêm thể loại</button>
                )}
            </div>

            <div className="table-wrapper">
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>ID</th><th>Tên thể loại</th><th>Mô tả</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '40px' }}>Chưa có thể loại nào</td></tr>
                            ) : categories.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td><strong>{c.name}</strong></td>
                                    <td><span className="text-muted">{c.description ? (c.description.length > 80 ? c.description.substring(0, 80) + '...' : c.description) : '—'}</span></td>
                                    <td>
                                        {canManage && (
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><IoPencil /></button>
                                                <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(c.id)}><IoTrash /></button>
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
                title={selected ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên thể loại *</label>
                        <input type="text" className="form-control" required
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea className="form-control" rows="3"
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
