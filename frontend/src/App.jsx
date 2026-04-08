import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookCatalog from './pages/books/BookCatalog';
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
            <Route index element={<BookCatalog />} />
            <Route path="home" element={<Home />} />
            <Route
              path="dashboard"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <Dashboard />
                </RoleRoute>
              }
            />
            <Route
              path="books/manage"
              element={
                <RoleRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <BookList />
                </RoleRoute>
              }
            />
            <Route
              path="authors"
              element={
                <RoleRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <AuthorList />
                </RoleRoute>
              }
            />
            <Route
              path="categories"
              element={
                <RoleRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <CategoryList />
                </RoleRoute>
              }
            />
            <Route
              path="inventory"
              element={
                <RoleRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <InventoryList />
                </RoleRoute>
              }
            />
            <Route
              path="borrow"
              element={
                <RoleRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <BorrowList />
                </RoleRoute>
              }
            />
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <UserList />
                </RoleRoute>
              }
            />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Backward compatibility */}
          <Route path="/books" element={<Navigate to="/" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
