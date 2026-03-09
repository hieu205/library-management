package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.InventoryLog;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {

    // Lấy log theo bookId, mới nhất trước
    List<InventoryLog> findByBook_IdOrderByCreatedAtDesc(Long bookId);

    // Lấy toàn bộ log, mới nhất trước — dùng cho GET /inventory/logs
    List<InventoryLog> findAllByOrderByCreatedAtDesc();
}
