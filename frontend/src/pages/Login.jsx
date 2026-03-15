import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoLibrary } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(username, password);
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại!');
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
                <p className="auth-subtitle">Đăng nhập để quản lý thư viện</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '-8px', marginBottom: '16px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 400,
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                        }}>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                style={{ accentColor: 'var(--accent-blue)' }}
                            />
                            Hiển thị mật khẩu
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}
