import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        const publicPaths = ['/', '/books'];
        if (publicPaths.includes(location.pathname)) {
            return children;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
}
