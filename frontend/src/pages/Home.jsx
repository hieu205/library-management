import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoSearch, IoBookSharp, IoFilter, IoClose,
    IoLibrary, IoTime, IoRocket, IoShieldCheckmark, IoAdd
} from 'react-icons/io5';
import { bookService, authorService, categoryService, borrowService } from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const coverColors = [
    '#1e3a5f',
    '#1a4731',
    '#4c1d95',
    '#92400e',
    '#1e40af',
    '#065f46',
    '#6b21a8',
    '#9a3412',
];

const features = [
    { icon: <IoLibrary />, title: 'Kho sách phong phú', desc: 'Đa dạng thể loại và tác giả' },
    { icon: <IoRocket />, title: 'Tìm kiếm nhanh', desc: 'Lọc theo thể loại, tác giả' },
    { icon: <IoTime />, title: 'Mượn trả dễ dàng', desc: 'Quản lý phiếu mượn online' },
    { icon: <IoShieldCheckmark />, title: 'Miễn phí thành viên', desc: 'Đăng ký tài khoản miễn phí' },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [allBooks, setAllBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [selectedAuthors, setSelectedAuthors] = useState(new Set());
    const [filterOpen, setFilterOpen] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [borrowModal, setBorrowModal] = useState(false);
    const [borrowQuantity, setBorrowQuantity] = useState(1);
    const [borrowDueDate, setBorrowDueDate] = useState('');
    const [borrowLoading, setBorrowLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [booksRes, authorsRes, catsRes] = await Promise.all([
                    bookService.getAll(),
                    authorService.getAll(),
                    categoryService.getAll(),
                ]);
                setAllBooks(booksRes.data.data || []);
                setAuthors(authorsRes.data.data || []);
                setCategories(catsRes.data.data || []);
            } catch {
                toast.error('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredBooks = useMemo(() => {
        return allBooks
            .filter(book =>
                selectedCategories.size === 0 ||
                book.categories?.some(c => selectedCategories.has(c.id))
            )
            .filter(book =>
                selectedAuthors.size === 0 ||
                book.authors?.some(a => selectedAuthors.has(a.id))
            )
            .filter(book => {
                if (!searchKeyword.trim()) return true;
                const kw = searchKeyword.toLowerCase();
                return (
                    book.title?.toLowerCase().includes(kw) ||
                    book.isbn?.toLowerCase().includes(kw) ||
                    book.authors?.some(a => a.name.toLowerCase().includes(kw)) ||
                    book.categories?.some(c => c.name.toLowerCase().includes(kw))
                );
            });
    }, [allBooks, selectedCategories, selectedAuthors, searchKeyword]);

    const toggleCategory = (id) => {
        setSelectedCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAuthor = (id) => {
        setSelectedAuthors(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleBorrowClick = () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để mượn sách');
            navigate('/login', { state: { from: '/' } });
            return;
        }
        setBorrowModal(true);
    };

    const handleBorrow = async () => {
        if (!borrowDueDate) {
            toast.error('Vui lòng chọn ngày trả');
            return;
        }
        
        setBorrowLoading(true);
        try {
            const payload = {
                bookId: selectedBook.id,
                quantity: borrowQuantity,
                dueDate: borrowDueDate,
            };
            await borrowService.create(payload);
            toast.success('Mượn sách thành công');
            setBorrowModal(false);
            setDetailModal(false);
            setBorrowQuantity(1);
            setBorrowDueDate('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Không thể mượn sách');
        } finally {
            setBorrowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Đang tải sách...</p>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Thư Viện Sách Trực Tuyến</h1>
                    <p>Khám phá hàng ngàn cuốn sách hay - Đọc miễn phí, Mượn dễ dàng</p>
                </div>

                {/* Features */}
                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="search-section">
                <div className="search-container">
                    <span className="search-icon"><IoSearch /></span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách, tác giả..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="search-input"
                    />
                </div>

                <button
                    className={`filter-toggle ${filterOpen ? 'active' : ''}`}
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    <IoFilter /> Bộ lọc
                </button>

                {filterOpen && (
                    <div className="filter-panel">
                        <div className="filter-section">
                            <h3>Thể loại</h3>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <label key={cat.id} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.has(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3>Tác giả</h3>
                            <div className="filter-options">
                                {authors.map(author => (
                                    <label key={author.id} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedAuthors.has(author.id)}
                                            onChange={() => toggleAuthor(author.id)}
                                        />
                                        <span>{author.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {(selectedCategories.size > 0 || selectedAuthors.size > 0) && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setSelectedCategories(new Set());
                                    setSelectedAuthors(new Set());
                                }}
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Books Grid */}
            <section className="books-section">
                <div className="books-header">
                    <h2>Sách ({filteredBooks.length})</h2>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="empty-state">
                        <IoBookSharp />
                        <p>Không tìm thấy sách phù hợp</p>
                    </div>
                ) : (
                    <div className="books-grid">
                        {filteredBooks.map((book) => {
                            const colorIdx = book.id % coverColors.length;
                            return (
                                <div
                                    key={book.id}
                                    className="book-card"
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setDetailModal(true);
                                    }}
                                >
                                    <div
                                        className="book-cover"
                                        style={{ backgroundColor: coverColors[colorIdx] }}
                                    >
                                        <IoBookSharp />
                                    </div>
                                    <div className="book-info">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">
                                            {book.authors?.map(a => a.name).join(', ') || 'N/A'}
                                        </p>
                                        <p className="book-isbn">ISBN: {book.isbn}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Book Detail Modal */}
            {detailModal && selectedBook && (
                <Modal
                    title={selectedBook.title}
                    onClose={() => {
                        setDetailModal(false);
                        setBorrowModal(false);
                    }}
                >
                    <div className="book-detail">
                        <div
                            className="book-cover-detail"
                            style={{
                                backgroundColor: coverColors[selectedBook.id % coverColors.length],
                            }}
                        >
                            <IoBookSharp />
                        </div>

                        <div className="book-info-detail">
                            <h2>{selectedBook.title}</h2>

                            <div className="detail-row">
                                <span className="label">Tác giả:</span>
                                <span>{selectedBook.authors?.map(a => a.name).join(', ') || 'N/A'}</span>
                            </div>

                            <div className="detail-row">
                                <span className="label">Thể loại:</span>
                                <span>
                                    {selectedBook.categories?.map(c => c.name).join(', ') || 'N/A'}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="label">ISBN:</span>
                                <span>{selectedBook.isbn}</span>
                            </div>

                            <div className="detail-row">
                                <span className="label">Năm xuất bản:</span>
                                <span>{selectedBook.publicationYear || 'N/A'}</span>
                            </div>

                            <div className="detail-row">
                                <span className="label">Mô tả:</span>
                                <p className="description">{selectedBook.description || 'Không có mô tả'}</p>
                            </div>

                            <div className="detail-row">
                                <span className="label">Số lượng có sẵn:</span>
                                <span className="available-qty">
                                    {(selectedBook.inventory?.available || 0)} / {selectedBook.inventory?.total || 0}
                                </span>
                            </div>

                            {(selectedBook.inventory?.available || 0) > 0 ? (
                                <button className="btn btn-primary" onClick={handleBorrowClick}>
                                    <IoAdd /> {isAuthenticated ? 'Mượn sách' : 'Đăng nhập để mượn'}
                                </button>
                            ) : (
                                <button className="btn btn-disabled" disabled>
                                    Hết sách
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Borrow Modal */}
                    {borrowModal && (
                        <div className="nested-modal">
                            <div className="nested-modal-content">
                                <div className="nested-modal-header">
                                    <h3>Mượn sách</h3>
                                    <button
                                        className="close-btn"
                                        onClick={() => setBorrowModal(false)}
                                    >
                                        <IoClose />
                                    </button>
                                </div>

                                <div className="nested-modal-body">
                                    <div className="form-group">
                                        <label>Tên sách</label>
                                        <input
                                            type="text"
                                            value={selectedBook.title}
                                            disabled
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Số lượng mượn</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedBook.inventory?.available || 0}
                                            value={borrowQuantity}
                                            onChange={(e) =>
                                                setBorrowQuantity(
                                                    Math.max(
                                                        1,
                                                        Math.min(
                                                            parseInt(e.target.value) || 1,
                                                            selectedBook.inventory?.available || 0
                                                        )
                                                    )
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ngày trả dự kiến</label>
                                        <input
                                            type="date"
                                            value={borrowDueDate}
                                            onChange={(e) => setBorrowDueDate(e.target.value)}
                                            className="form-input"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="nested-modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setBorrowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleBorrow}
                                        disabled={borrowLoading}
                                    >
                                        {borrowLoading ? 'Đang xử lý...' : 'Xác nhận mượn'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}
