import { useEffect, useState } from 'react';
import { IoBookSharp, IoPeople, IoSwapHorizontal, IoWarning } from 'react-icons/io5';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { bookService, userService, reportService } from '../services/api';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

export default function Dashboard() {
    const [stats, setStats] = useState({ books: 0, users: 0, borrowing: 0, overdue: 0 });
    const [topBooks, setTopBooks] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [booksRes, usersRes, topBooksRes, topUsersRes, borrowingRes, overdueRes] = await Promise.all([
                bookService.getAll(),
                userService.getAll(),
                reportService.getTopBooks(8),
                reportService.getTopUsers(8),
                reportService.getBorrowingBooks(),
                reportService.getOverdueBooks(),
            ]);

            setStats({
                books: booksRes.data.data?.length || 0,
                users: usersRes.data.data?.length || 0,
                borrowing: borrowingRes.data.data?.length || 0,
                overdue: overdueRes.data.data?.length || 0,
            });

            setTopBooks(topBooksRes.data.data || []);
            setTopUsers(topUsersRes.data.data || []);
        } catch (err) {
            toast.error('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-screen"><div className="spinner" /><p>Đang tải dashboard...</p></div>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                }}>
                    <p style={{ fontWeight: 600 }}>{label}</p>
                    <p style={{ color: 'var(--accent-blue)' }}>{payload[0].value} lượt mượn</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-title-sub">Tổng quan hệ thống quản lý thư viện</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon blue"><IoBookSharp /></div>
                    <div className="stat-value">{stats.books}</div>
                    <div className="stat-label">Tổng số sách</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon purple"><IoPeople /></div>
                    <div className="stat-value">{stats.users}</div>
                    <div className="stat-label">Người dùng</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon green"><IoSwapHorizontal /></div>
                    <div className="stat-value">{stats.borrowing}</div>
                    <div className="stat-label">Sách đang mượn</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon orange"><IoWarning /></div>
                    <div className="stat-value">{stats.overdue}</div>
                    <div className="stat-label">Phiếu quá hạn</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>📚 Top sách được mượn nhiều nhất</h3>
                    {topBooks.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topBooks} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="title" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                    angle={-35} textAnchor="end" interval={0} height={80} />
                                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="totalBorrowed" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state"><p>Chưa có dữ liệu</p></div>
                    )}
                </div>

                <div className="chart-card">
                    <h3>👤 Top người dùng mượn nhiều nhất</h3>
                    {topUsers.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={topUsers} dataKey="borrowCount" nameKey="username"
                                    cx="50%" cy="50%" outerRadius={100} label={({ username, borrowCount }) =>
                                        `${username}: ${borrowCount}`
                                    }
                                    labelLine={{ stroke: 'var(--text-muted)' }}
                                >
                                    {topUsers.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{
                                    background: 'var(--surface-2)', border: '1px solid var(--border-color)',
                                    borderRadius: '8px', color: 'var(--text-primary)'
                                }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state"><p>Chưa có dữ liệu</p></div>
                    )}
                </div>
            </div>
        </div>
    );
}
