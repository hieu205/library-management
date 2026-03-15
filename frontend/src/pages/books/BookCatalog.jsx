import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IoSearch, IoBookSharp, IoFilter, IoClose,
    IoLibrary, IoTime, IoRocket, IoShieldCheckmark
} from 'react-icons/io5';
import { bookService, authorService, categoryService } from '../../services/api';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

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

export default function BookCatalog() {
    const { isAdmin, isLibrarian } = useAuth();
    const canManage = isAdmin || isLibrarian;

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

    const clearAllFilters = () => {
        setSelectedCategories(new Set());
        setSelectedAuthors(new Set());
        setSearchKeyword('');
    };

    const hasActiveFilters = selectedCategories.size > 0 || selectedAuthors.size > 0 || searchKeyword.trim();

    const openDetail = (book) => {
        setSelectedBook(book);
        setDetailModal(true);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="book-catalog">
            {/* Hero Section */}
            <section className="catalog-hero">
                <div className="catalog-hero-content">
                    <h1>Thư viện Sách</h1>
                    <p>Khám phá bộ sưu tập sách phong phú với đa dạng thể loại và tác giả</p>
                    <div className="catalog-hero-search">
                        <IoSearch />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách, tác giả, thể loại..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="catalog-features">
                {features.map((f, i) => (
                    <div key={i} className="feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <div>
                            <h4>{f.title}</h4>
                            <p>{f.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Products Section Header */}
            <section className="catalog-section-header">
                <div>
                    <h2>Sản Phẩm</h2>
                    <p>Hiển thị {filteredBooks.length} trên tổng {allBooks.length} cuốn sách</p>
                </div>
                <div className="catalog-section-actions">
                    {canManage && (
                        <Link to="/books/manage" className="btn btn-primary">Quản lý sách</Link>
                    )}
                    <button
                        className="btn btn-outline filter-toggle-btn"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <IoFilter /> Bộ lọc
                    </button>
                </div>
            </section>

            {/* Active filters bar */}
            {hasActiveFilters && (
                <div className="catalog-results-bar">
                    <div className="active-filters">
                        {[...selectedCategories].map(id => {
                            const cat = categories.find(c => c.id === id);
                            return cat ? (
                                <span key={`cat-${id}`} className="active-filter-tag" onClick={() => toggleCategory(id)}>
                                    {cat.name} <IoClose />
                                </span>
                            ) : null;
                        })}
                        {[...selectedAuthors].map(id => {
                            const author = authors.find(a => a.id === id);
                            return author ? (
                                <span key={`auth-${id}`} className="active-filter-tag" onClick={() => toggleAuthor(id)}>
                                    {author.name} <IoClose />
                                </span>
                            ) : null;
                        })}
                        <button className="btn btn-ghost btn-sm" onClick={clearAllFilters}>
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* Content: Filter + Grid */}
            <div className="catalog-content">
                {filterOpen && <div className="filter-overlay" onClick={() => setFilterOpen(false)} />}
                <aside className={`filter-panel ${filterOpen ? 'open' : ''}`}>
                    <div className="filter-header">
                        <h3>Bộ lọc</h3>
                        <button className="filter-close-btn" onClick={() => setFilterOpen(false)}>
                            <IoClose />
                        </button>
                        {hasActiveFilters && (
                            <button onClick={clearAllFilters}>Xóa tất cả</button>
                        )}
                    </div>

                    {categories.length > 0 && (
                        <div className="filter-section">
                            <h4>Thể loại</h4>
                            <div className="filter-options">
                                {categories.map(c => (
                                    <label key={c.id} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.has(c.id)}
                                            onChange={() => toggleCategory(c.id)}
                                        />
                                        <span>{c.name}</span>
                                        <span className="filter-count">
                                            ({allBooks.filter(b => b.categories?.some(bc => bc.id === c.id)).length})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {authors.length > 0 && (
                        <div className="filter-section">
                            <h4>Tác giả</h4>
                            <div className="filter-options">
                                {authors.map(a => (
                                    <label key={a.id} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedAuthors.has(a.id)}
                                            onChange={() => toggleAuthor(a.id)}
                                        />
                                        <span>{a.name}</span>
                                        <span className="filter-count">
                                            ({allBooks.filter(b => b.authors?.some(ba => ba.id === a.id)).length})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <div className="book-grid">
                    {filteredBooks.length === 0 ? (
                        <div className="catalog-empty">
                            <IoBookSharp style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.3 }} />
                            <p>Không tìm thấy sách nào</p>
                        </div>
                    ) : (
                        filteredBooks.map(book => (
                            <div key={book.id} className="book-card" onClick={() => openDetail(book)}>
                                <div
                                    className="book-card-cover"
                                    style={{ backgroundColor: coverColors[book.id % coverColors.length] }}
                                >
                                    <IoBookSharp className="book-card-icon" />
                                </div>
                                <div className="book-card-body">
                                    <span className="book-card-category">
                                        {book.categories?.[0]?.name || 'Sách'}
                                    </span>
                                    <h3 className="book-card-title">{book.title}</h3>
                                    <p className="book-card-author">
                                        {book.authors?.map(a => a.name).join(', ') || 'Chưa rõ tác giả'}
                                    </p>
                                    <div className="book-card-footer">
                                        {book.publishYear && <span>{book.publishYear}</span>}
                                        {book.language && <span>{book.language}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Modal isOpen={detailModal} onClose={() => setDetailModal(false)}
                title="Chi tiết sách" size="md">
                {selectedBook && (
                    <div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-label">Tiêu đề</div>
                                <div className="detail-value">{selectedBook.title}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">ISBN</div>
                                <div className="detail-value">{selectedBook.isbn || '—'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Năm xuất bản</div>
                                <div className="detail-value">{selectedBook.publishYear || '—'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Ngôn ngữ</div>
                                <div className="detail-value">{selectedBook.language || '—'}</div>
                            </div>
                        </div>
                        <div className="detail-item mt-lg">
                            <div className="detail-label">Mô tả</div>
                            <div className="detail-value">{selectedBook.description || 'Chưa có mô tả'}</div>
                        </div>
                        <div className="detail-item mt-md">
                            <div className="detail-label">Tác giả</div>
                            <div className="tag-list mt-md">
                                {selectedBook.authors?.map((a) => <span key={a.id} className="badge badge-blue">{a.name}</span>)}
                            </div>
                        </div>
                        <div className="detail-item mt-md">
                            <div className="detail-label">Thể loại</div>
                            <div className="tag-list mt-md">
                                {selectedBook.categories?.map((c) => <span key={c.id} className="badge badge-purple">{c.name}</span>)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
