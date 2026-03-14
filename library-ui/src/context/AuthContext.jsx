import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const credentials = localStorage.getItem('credentials');
        const savedUser = localStorage.getItem('user');
        if (credentials && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const credentials = btoa(`${username}:${password}`);
        try {
            const res = await authService.login({ username, password });
            const userData = res.data.data;
            localStorage.setItem('credentials', credentials);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            localStorage.removeItem('credentials');
            throw err;
        }
    };

    const register = async (data) => {
        const res = await authService.register(data);
        return res.data.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('credentials');
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

    const role = user?.role || 'USER';
    const isAdmin = role === 'ADMIN';
    const isLibrarian = role === 'LIBRARIAN';
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
