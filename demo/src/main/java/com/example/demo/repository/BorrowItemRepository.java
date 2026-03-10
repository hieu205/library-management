package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.BorrowItem;
import com.example.demo.repository.BorrowingBookProjection;
import com.example.demo.repository.TopBookProjection;

public interface BorrowItemRepository extends JpaRepository<BorrowItem, Long> {
    List<BorrowItem> findByBorrowRecord_Id(Long borrowRecordId);

    Optional<BorrowItem> findByBorrowRecord_IdAndBook_Id(Long borrowRecordId, Long bookId);

    @Query("SELECT COUNT(bi) > 0 FROM BorrowItem bi WHERE bi.book.id = :bookId AND bi.returnedQuantity < bi.quantity")
    boolean existsActiveBorrowByBookId(@Param("bookId") Long bookId);

    @Query("""
                SELECT
                    bi.book.id as bookId,
                    bi.book.title as title,
                    SUM(bi.quantity) as totalBorrowed
                FROM BorrowItem bi
                GROUP BY bi.book.id, bi.book.title
                ORDER BY SUM(bi.quantity) DESC
            """)
    List<TopBookProjection> getTopBooks(Pageable pageable);

    @Query("""
                SELECT
                    bi.book.id as bookId,
                    bi.book.title as title,
                    bi.book.isbn as isbn,
                    SUM(bi.quantity - COALESCE(bi.returnedQuantity, 0)) as quantityCurrentlyBorrowed,
                    COUNT(DISTINCT bi.borrowRecord.id) as activeBorrowCount
                FROM BorrowItem bi
                JOIN bi.borrowRecord br
                WHERE br.status = 'BORROWING'
                GROUP BY bi.book.id, bi.book.title, bi.book.isbn
                ORDER BY SUM(bi.quantity - COALESCE(bi.returnedQuantity, 0)) DESC
            """)
    List<BorrowingBookProjection> getBorrowingBooks();
}
