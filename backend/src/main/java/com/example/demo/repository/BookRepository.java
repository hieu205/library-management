package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
        Optional<Book> findByIsbn(String isbn);

        boolean existsByIsbn(String isbn);

        Page<Book> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

        @Query(value = """
                        SELECT DISTINCT b.*
                        FROM books b
                        LEFT JOIN book_authors ba ON b.id = ba.book_id
                        LEFT JOIN authors a ON ba.author_id = a.id
                        LEFT JOIN book_categories bc ON b.id = bc.book_id
                        LEFT JOIN categories c ON bc.category_id = c.id
                        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        	OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        	OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """, countQuery = """
                        SELECT COUNT(DISTINCT b.id)
                        FROM books b
                        LEFT JOIN book_authors ba ON b.id = ba.book_id
                        LEFT JOIN authors a ON ba.author_id = a.id
                        LEFT JOIN book_categories bc ON b.id = bc.book_id
                        LEFT JOIN categories c ON bc.category_id = c.id
                        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        	OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        	OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """, nativeQuery = true)
        Page<Book> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

        // JPQL: JOIN (không fetch) để filter, tránh MultipleBagFetchException khi JOIN
        // FETCH 2 List cùng lúc
        // @Transactional(readOnly=true) ở service giữ session mở để lazy load hoạt động
        @Query("SELECT DISTINCT b FROM Book b "
                        + "LEFT JOIN b.bookAuthors ba LEFT JOIN ba.author a "
                        + "LEFT JOIN b.bookCategories bc LEFT JOIN bc.category c "
                        + "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
                        + "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
                        + "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Book> searchByKeywordJpql(@Param("keyword") String keyword);

        @Query("SELECT DISTINCT b FROM Book b JOIN b.bookAuthors ba WHERE ba.author.id = :authorId")
        List<Book> findByAuthorId(@Param("authorId") Long authorId);
}
