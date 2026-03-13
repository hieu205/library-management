import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth header to every request
api.interceptors.request.use((config) => {
    const credentials = localStorage.getItem('credentials');
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/users/login') || url.includes('/users/register');
    if (credentials && !isAuthEndpoint) {
        config.headers.Authorization = `Basic ${credentials}`;
    }
    return config;
});

// ─── Auth / User ───
export const authService = {
    login: (data) => api.post('/users/login', data),
    register: (data) => api.post('/users/register', data),
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    changePassword: (data) => api.patch('/users/me/password', data),
    getMyBorrowHistory: (page = 0, size = 20) =>
        api.get(`/users/me/borrow-history?page=${page}&size=${size}`),
    getMyCurrentBorrows: (page = 0, size = 20) =>
        api.get(`/users/me/current-borrows?page=${page}&size=${size}`),
};

// ─── Admin User Management ───
export const userService = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    updateStatus: (id, data) => api.patch(`/users/${id}/status`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getBorrowHistory: (userId, page = 0, size = 20) =>
        api.get(`/users/${userId}/borrow-history?page=${page}&size=${size}`),
};

// ─── Books ───
export const bookService = {
    getAll: () => api.get('/books'),
    getById: (id) => api.get(`/books/${id}`),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
    addAuthors: (id, data) => api.post(`/books/${id}/authors`, data),
    search: (keyword) => api.get(`/books/search?keyword=${encodeURIComponent(keyword)}`),
};

// ─── Authors ───
export const authorService = {
    getAll: () => api.get('/authors'),
    getById: (id) => api.get(`/authors/${id}`),
    create: (data) => api.post('/authors', data),
    update: (id, data) => api.put(`/authors/${id}`, data),
    delete: (id) => api.delete(`/authors/${id}`),
};

// ─── Categories ───
export const categoryService = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Inventory ───
export const inventoryService = {
    getAll: () => api.get('/inventory'),
    getByBookId: (bookId) => api.get(`/inventory/${bookId}`),
    add: (data) => api.post('/inventory/add', data),
    decrease: (data) => api.patch('/inventory/decrease', data),
    increase: (data) => api.patch('/inventory/increase', data),
    getAllLogs: () => api.get('/inventory/logs'),
    getLogsByBookId: (bookId) => api.get(`/inventory/logs/${bookId}`),
};

// ─── Borrow ───
export const borrowService = {
    getAll: () => api.get('/borrow'),
    getById: (id) => api.get(`/borrow/${id}`),
    create: (data) => api.post('/borrow', data),
    returnBooks: (borrowId, data) => api.post(`/borrow/${borrowId}/return`, data),
};

// ─── Reports ───
export const reportService = {
    getTopBooks: (limit = 10) => api.get(`/reports/top-books?limit=${limit}`),
    getTopUsers: (limit = 10) => api.get(`/reports/top-users?limit=${limit}`),
    getBorrowingBooks: () => api.get('/reports/borrowing-books'),
    getOverdueBooks: () => api.get('/reports/overdue-books'),
};

export default api;
