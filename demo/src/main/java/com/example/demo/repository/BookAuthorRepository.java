package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.BookAuthor;
import com.example.demo.entity.BookAuthorId;

public interface BookAuthorRepository extends JpaRepository<BookAuthor, BookAuthorId> {
    List<BookAuthor> findByBook_Id(Long bookId);

    List<BookAuthor> findByAuthor_Id(Long authorId);

    boolean existsByBook_IdAndAuthor_Id(Long bookId, Long authorId);

    void deleteByBook_IdAndAuthor_Id(Long bookId, Long authorId);
}
