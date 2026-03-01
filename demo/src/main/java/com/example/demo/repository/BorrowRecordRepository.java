package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    Page<BorrowRecord> findByUser_Id(Long userId, Pageable pageable);

    Page<BorrowRecord> findByStatus(String status, Pageable pageable);

    Page<BorrowRecord> findByUser_IdAndStatus(Long userId, String status, Pageable pageable);

    List<BorrowRecord> findByDueDateBeforeAndStatus(LocalDate currentDate, String status);
}
