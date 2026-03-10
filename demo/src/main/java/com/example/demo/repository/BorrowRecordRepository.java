package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.BorrowRecord;
import com.example.demo.repository.TopUserProjection;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    boolean existsByUser_Id(Long userId);

    Page<BorrowRecord> findByUser_Id(Long userId, Pageable pageable);

    Page<BorrowRecord> findByStatus(String status, Pageable pageable);

    Page<BorrowRecord> findByUser_IdAndStatus(Long userId, String status, Pageable pageable);

    List<BorrowRecord> findByDueDateBeforeAndStatus(LocalDate currentDate, String status);

    @Query("""
                SELECT
                    u.id as userId,
                    u.username as username,
                    COUNT(br.id) as borrowCount
                FROM BorrowRecord br
                JOIN br.user u
                GROUP BY u.id, u.username
                ORDER BY COUNT(br.id) DESC
            """)
    List<TopUserProjection> getTopUsers(Pageable pageable);
}
