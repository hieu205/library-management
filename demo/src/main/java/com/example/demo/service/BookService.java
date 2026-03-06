package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.BookRequest;
import com.example.demo.dto.response.BookResponse;
import com.example.demo.entity.Author;
import com.example.demo.entity.Book;
import com.example.demo.entity.BookAuthor;
import com.example.demo.entity.BookCategory;
import com.example.demo.entity.Category;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowItemRepository;
import com.example.demo.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowItemRepository borrowItemRepository;

    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (request.getIsbn() != null && !request.getIsbn().isBlank()
                && bookRepository.existsByIsbn(request.getIsbn())) {
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
        return BookResponse.fromEntity(book);
    }

    @Transactional
    public BookResponse updateBookById(Long id, BookRequest request) {
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
        return BookResponse.fromEntity(book);
    }

    @Transactional
    public void deleteBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + id));

        // nếu xóa sách đang được mượn đi thì lúc trả sẽ không thể biết được sách đó là
        // sách nào trong list<book> của cửa hàng
        if (borrowItemRepository.existsActiveBorrowByBookId(id)) {
            throw new RuntimeException("Không thể xóa sách đang được mượn");
        }

        bookRepository.delete(book);
    }

    public List<BookResponse> getAllBook() {
        List<Book> listBookResponse = bookRepository.findAll();

        List<BookResponse> res = new ArrayList<>();
        for (Book x : listBookResponse) {
            res.add(BookResponse.fromEntity(x));
        }
        return res;
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay book co id " + id));
        return BookResponse.fromEntity(book);
    }

}
