import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    IoLibrary, IoBookSharp, IoPeople, IoLogOut, IoMenu, IoClose,
    IoGrid, IoPerson, IoLayers, IoArchive, IoSwapHorizontal, IoStatsChart
} from 'react-icons/io5';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    const { user, logout, isAdmin, isLibrarian } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: <IoGrid />, label: 'Dashboard' },
        { to: '/books', icon: <IoBookSharp />, label: 'Sách' },
        { to: '/authors', icon: <IoPerson />, label: 'Tác giả' },
        { to: '/categories', icon: <IoLayers />, label: 'Thể loại' },
        ...(isAdmin || isLibrarian ? [{ to: '/inventory', icon: <IoArchive />, label: 'Kho sách' }] : []),
        { to: '/borrow', icon: <IoSwapHorizontal />, label: 'Mượn / Trả' },
        ...(isAdmin ? [{ to: '/users', icon: <IoPeople />, label: 'Người dùng' }] : []),
        { to: '/profile', icon: <IoStatsChart />, label: 'Hồ sơ' },
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
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.fullName || 'User'}</span>
                            <span className="user-role">{user?.role || 'Member'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                        <IoLogOut />
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <header className="topbar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <IoMenu />
                    </button>
                    <div className="topbar-right">
                        <span className="greeting">Xin chào, <strong>{user?.fullName || 'User'}</strong></span>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
