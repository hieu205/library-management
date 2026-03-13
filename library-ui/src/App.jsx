import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/books/BookList';
import AuthorList from './pages/authors/AuthorList';
import CategoryList from './pages/categories/CategoryList';
import InventoryList from './pages/inventory/InventoryList';
import BorrowList from './pages/borrow/BorrowList';
import UserList from './pages/users/UserList';
import Profile from './pages/profile/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="books" element={<BookList />} />
            <Route path="authors" element={<AuthorList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="borrow" element={<BorrowList />} />
            <Route path="users" element={<UserList />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
