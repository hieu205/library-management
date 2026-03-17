import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        if (accessToken && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await authService.login({ username, password });
            const authData = res.data.data;
            const userData = authData.user;

            localStorage.setItem('accessToken', authData.accessToken);
            localStorage.setItem('refreshToken', authData.refreshToken);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw err;
        }
    };

    const register = async (data) => {
        const res = await authService.register(data);
        return res.data.data;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await authService.logout({ refreshToken });
        } catch {
            // ignore logout errors and still clear client state
        }
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const refreshProfile = async () => {
        try {
            const res = await authService.getProfile();
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch {
            // ignore
        }
    };

    const role = user?.role || null;
    const isAdmin = role === 'ADMIN';
    const isLibrarian = false;
    const isMember = role === 'USER';

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                refreshProfile,
                loading,
                isAuthenticated: !!user,
                role,
                isAdmin,
                isLibrarian,
                isMember,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
