package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.BorrowItem;

public interface BorrowItemRepository extends JpaRepository<BorrowItem, Long> {
    List<BorrowItem> findByBorrowRecord_Id(Long borrowRecordId);

    Optional<BorrowItem> findByBorrowRecord_IdAndBook_Id(Long borrowRecordId, Long bookId);
}
