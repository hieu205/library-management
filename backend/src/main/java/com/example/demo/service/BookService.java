package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.AddAuthorsToBookRequest;
import com.example.demo.dto.request.BookRequest;
import com.example.demo.dto.response.BookResponse;
import com.example.demo.entity.Author;
import com.example.demo.entity.Book;
import com.example.demo.entity.BookAuthor;
import com.example.demo.entity.BookCategory;
import com.example.demo.entity.Category;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookAuthorRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowItemRepository;
import com.example.demo.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = { "books", "book_search" })
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowItemRepository borrowItemRepository;
    private final BookAuthorRepository bookAuthorRepository;
    private final InventoryService inventoryService;
    private final BookImageService bookImageService;

    @CacheEvict(value = { "books", "book_search" }, allEntries = true)
    @Transactional
    public BookResponse createBook(BookRequest request) {
        log.info("[Cache EVICT] createBook - clearing all books and search cache");
        System.out.println("[BACKEND] Bắt đầu tạo sách mới - title=" + request.getTitle());
        if (request.getIsbn() != null && !request.getIsbn().isBlank()
                && bookRepository.existsByIsbn(request.getIsbn())) {
            System.err.println("[BACKEND] Tạo sách thất bại do ISBN đã tồn tại - isbn=" + request.getIsbn());
            throw new RuntimeException("ISBN đã tồn tại");
        }

        if (request.getAuthorIds() != null) {
            for (Long authorId : request.getAuthorIds()) {
                if (!authorRepository.existsById(authorId)) {
                    throw new RuntimeException("Không tìm thấy tác giả với id: " + authorId);
                }
            }
        }

        if (request.getCategoryIds() != null) {
            for (Long categoryId : request.getCategoryIds()) {
                if (!categoryRepository.existsById(categoryId)) {
                    throw new RuntimeException("Không tìm thấy thể loại với id: " + categoryId);
                }
            }
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .isbn(request.getIsbn())
                .publishYear(request.getPublishYear())
                .language(request.getLanguage())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (request.getAuthorIds() != null) {
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.getReferenceById(authorId);
                book.getBookAuthors().add(new BookAuthor(book, author));
            }
        }

        if (request.getCategoryIds() != null) {
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.getReferenceById(categoryId);
                book.getBookCategories().add(new BookCategory(book, category));
            }
        }

        book = bookRepository.save(book);

        // Tạo ảnh cho sách
        bookImageService.createBookImages(book, request);
        // Reload để lấy ảnh vừa tạo
        book = bookRepository.findById(book.getId()).orElse(book);

        inventoryService.createInventoryForBook(book);
        System.out.println("[BACKEND] Tạo sách thành công - bookId=" + book.getId() + ", title=" + book.getTitle());
        return BookResponse.fromEntity(book);
    }

    @CacheEvict(value = { "books", "book_search" }, allEntries = true)
    @Transactional
    public BookResponse updateBookById(Long id, BookRequest request) {
        log.info("[Cache EVICT] updateBookById(id={}) - clearing all books and search cache", id);
        System.out.println("[BACKEND] Bắt đầu cập nhật sách - bookId=" + id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + id));

        if (request.getIsbn() != null && !request.getIsbn().isBlank()
                && bookRepository.existsByIsbn(request.getIsbn())
                && !request.getIsbn().equals(book.getIsbn())) {
            throw new RuntimeException("ISBN đã được sử dụng bởi sách khác");
        }

        if (request.getAuthorIds() != null) {
            for (Long authorId : request.getAuthorIds()) {
                if (!authorRepository.existsById(authorId)) {
                    throw new RuntimeException("Không tìm thấy tác giả với id: " + authorId);
                }
            }
        }

        if (request.getCategoryIds() != null) {
            for (Long categoryId : request.getCategoryIds()) {
                if (!categoryRepository.existsById(categoryId)) {
                    throw new RuntimeException("Không tìm thấy thể loại với id: " + categoryId);
                }
            }
        }

        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setIsbn(request.getIsbn());
        book.setPublishYear(request.getPublishYear());
        book.setLanguage(request.getLanguage());
        book.setUpdatedAt(LocalDateTime.now());

        // phải xóa hết dữ liệu trước đi vì nếu tiếp tục update thì những cái cũ sẽ vẫn
        // còn trong DB
        // VD: đang có ListAuthorId=[10,20] muốn cập nhật thành [20,30]. nếu chỉ insert
        // thêm vào thì sẽ thành [10,20,30]
        // vậy nên phái xóa hết đi
        book.getBookAuthors().clear();
        if (request.getAuthorIds() != null) {
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.getReferenceById(authorId);
                book.getBookAuthors().add(new BookAuthor(book, author));
            }
        }

        // tương tụ như trên BookAuthor
        book.getBookCategories().clear();
        if (request.getCategoryIds() != null) {
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.getReferenceById(categoryId);
                book.getBookCategories().add(new BookCategory(book, category));
            }
        }

        book = bookRepository.save(book);

        // Cập nhật ảnh
        bookImageService.updateBookImages(book, request);
        // Reload để lấy ảnh vừa cập nhật
        book = bookRepository.findById(book.getId()).orElse(book);

        System.out.println("[BACKEND] Cập nhật sách thành công - bookId=" + id);
        return BookResponse.fromEntity(book);
    }

    @CacheEvict(value = { "books", "book_search" }, allEntries = true)
    @Transactional
    public void deleteBookById(Long id) {
        log.info("[Cache EVICT] deleteBookById(id={}) - clearing all books and search cache", id);
        System.out.println("[BACKEND] Bắt đầu xóa sách - bookId=" + id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + id));

        // nếu xóa sách đang được mượn đi thì lúc trả sẽ không thể biết được sách đó là
        // sách nào trong list<book> của cửa hàng
        if (borrowItemRepository.existsActiveBorrowByBookId(id)) {
            System.err.println("[BACKEND] Không thể xóa sách vì đang được mượn - bookId=" + id);
            throw new RuntimeException("Không thể xóa sách đang được mượn");
        }

        bookRepository.delete(book);
        System.out.println("[BACKEND] Xóa sách thành công - bookId=" + id);
    }

    @Cacheable(value = "books", key = "'book_all'")
    public List<BookResponse> getAllBook() {
        log.info("[Cache MISS] getAllBook - fetching from DB");
        List<Book> listBookResponse = bookRepository.findAll();

        List<BookResponse> res = new ArrayList<>();
        for (Book x : listBookResponse) {
            res.add(BookResponse.fromEntity(x));
        }
        return res;
    }

    @Cacheable(value = "books", key = "'book_' + #id")
    public BookResponse getBookById(Long id) {
        log.info("[Cache MISS] getBookById(id={}) - fetching from DB", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay book co id " + id));
        return BookResponse.fromEntity(book);
    }

    @Transactional
    public BookResponse addAuthorsToBook(Long id, AddAuthorsToBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + id));

        for (Long authorId : request.getAuthorIds()) {
            if (!authorRepository.existsById(authorId)) {
                throw new RuntimeException("Không tìm thấy tác giả với id: " + authorId);
            }
            if (bookAuthorRepository.existsByBook_IdAndAuthor_Id(id, authorId)) {
                throw new RuntimeException("Tác giả id " + authorId + " đã được gán cho sách này");
            }
        }

        for (Long authorId : request.getAuthorIds()) {
            Author author = authorRepository.getReferenceById(authorId);
            book.getBookAuthors().add(new BookAuthor(book, author));
        }

        book = bookRepository.save(book);
        return BookResponse.fromEntity(book);
    }

    @Cacheable(value = "book_search", key = "'search_' + #keyword")
    @Transactional(readOnly = true)
    public List<BookResponse> searchBook(String keyword) {
        log.info("[Cache MISS] searchBook(keyword={}) - fetching from DB", keyword);
        if (keyword == null || keyword.isBlank()) {
            throw new RuntimeException("Từ khóa tìm kiếm không được để trống");
        }
        return bookRepository.searchByKeywordJpql(keyword.trim())
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "books", key = "'book_author_' + #authorId")
    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByAuthorId(Long authorId) {
        log.info("[Cache MISS] getBooksByAuthorId(authorId={}) - fetching from DB", authorId);
        if (!authorRepository.existsById(authorId)) {
            throw new RuntimeException("Không tìm thấy tác giả với id: " + authorId);
        }
        return bookRepository.findByAuthorId(authorId)
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
