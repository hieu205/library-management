package com.example.demo.repository;

import com.example.demo.entity.BookImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookImageRepository extends JpaRepository<BookImage, Long> {

    Optional<BookImage> findByBookId(Long bookId);

    void deleteByBookId(Long bookId);
}
