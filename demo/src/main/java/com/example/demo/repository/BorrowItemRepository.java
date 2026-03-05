package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.BorrowItem;

public interface BorrowItemRepository extends JpaRepository<BorrowItem, Long> {
    List<BorrowItem> findByBorrowRecord_Id(Long borrowRecordId);

    Optional<BorrowItem> findByBorrowRecord_IdAndBook_Id(Long borrowRecordId, Long bookId);

    @Query("SELECT COUNT(bi) > 0 FROM BorrowItem bi WHERE bi.book.id = :bookId AND bi.returnedQuantity < bi.quantity")
    boolean existsActiveBorrowByBookId(@Param("bookId") Long bookId);
}
