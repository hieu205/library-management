import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoLibrary } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({
        username: '', email: '', password: '', fullName: '', phone: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            toast.success('Đăng ký thành công! Hãy đăng nhập.');
            navigate('/login');
        } catch (err) {
            const details = err.response?.data?.details;
            if (details) {
                Object.values(details).forEach((msg) => toast.error(msg));
            } else {
                toast.error(err.response?.data?.message || 'Đăng ký thất bại!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <IoLibrary />
                    <h1>LibraryMS</h1>
                </div>
                <p className="auth-subtitle">Tạo tài khoản mới</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" name="fullName" className="form-control"
                            placeholder="Nguyễn Văn A" value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" name="username" className="form-control"
                            placeholder="nguyenvana" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control"
                            placeholder="email@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" name="phone" className="form-control"
                            placeholder="+84123456789" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" className="form-control"
                            placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
