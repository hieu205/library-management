import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    IoLibrary, IoBookSharp, IoPeople, IoLogOut, IoMenu, IoClose,
    IoGrid, IoPerson, IoLayers, IoArchive, IoSwapHorizontal, IoStatsChart, IoLogIn
} from 'react-icons/io5';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    const { user, logout, isAdmin, isLibrarian, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: <IoLibrary />, label: 'Thư viện sách' },
        ...(isAuthenticated && isAdmin ? [{ to: '/dashboard', icon: <IoGrid />, label: 'Dashboard' }] : []),
        ...(isAuthenticated && (isAdmin || isLibrarian)
            ? [{ to: '/books/manage', icon: <IoBookSharp />, label: 'Quản lý sách' }]
            : []),
        ...(isAuthenticated && (isAdmin || isLibrarian)
            ? [
                { to: '/authors', icon: <IoPerson />, label: 'Tác giả' },
                { to: '/categories', icon: <IoLayers />, label: 'Thể loại' },
            ]
            : []),
        ...(isAdmin || isLibrarian ? [{ to: '/inventory', icon: <IoArchive />, label: 'Kho sách' }] : []),
        ...(isAuthenticated && (isAdmin || isLibrarian)
            ? [{ to: '/borrow', icon: <IoSwapHorizontal />, label: 'Mượn / Trả' }]
            : []),
        ...(isAdmin ? [{ to: '/users', icon: <IoPeople />, label: 'Người dùng' }] : []),
        ...(isAuthenticated ? [{ to: '/profile', icon: <IoStatsChart />, label: 'Hồ sơ' }] : []),
    ];

    return (
        <div className="app-layout">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--surface-2)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    },
                }}
            />

            {/* Mobile overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <IoLibrary className="sidebar-logo-icon" />
                    <span className="sidebar-title">LibraryMS</span>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                        <IoClose />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'G'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.fullName || 'Khách'}</span>
                            <span className="user-role">{user?.role || 'Guest'}</span>
                        </div>
                    </div>
                    {isAuthenticated ? (
                        <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                            <IoLogOut />
                        </button>
                    ) : (
                        <div className="auth-buttons">
                            <NavLink to="/login" className="btn btn-primary btn-sm">
                                <IoLogIn /> Đăng nhập
                            </NavLink>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <header className="topbar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <IoMenu />
                    </button>
                    <div className="topbar-right">
                        <span className="greeting">Xin chào, <strong>{user?.fullName || 'Khách'}</strong></span>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
