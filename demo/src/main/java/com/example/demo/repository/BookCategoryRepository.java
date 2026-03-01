package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.BookCategory;
import com.example.demo.entity.BookCategoryId;

public interface BookCategoryRepository extends JpaRepository<BookCategory, BookCategoryId> {
    List<BookCategory> findByBook_Id(Long bookId);

    List<BookCategory> findByCategory_Id(Long categoryId);

    boolean existsByBook_IdAndCategory_Id(Long bookId, Long categoryId);

    void deleteByBook_IdAndCategory_Id(Long bookId, Long categoryId);
}
