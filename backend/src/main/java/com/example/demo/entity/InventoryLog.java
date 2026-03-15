package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inventory_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLog {

    // Các loại thay đổi tồn kho
    // IMPORT : nhập kho (add + increase)
    // EXPORT : xuất kho (decrease)
    public static final String IMPORT = "IMPORT";
    public static final String EXPORT = "EXPORT";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Loại thay đổi: IMPORT | EXPORT
    @Column(name = "change_type", nullable = false, length = 20)
    private String changeType;

    // Số lượng thay đổi (dương = thêm vào, âm = bớt đi)
    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;

    // Tổng số lượng sau khi thay đổi
    @Column(name = "total_after", nullable = false)
    private Integer totalAfter;

    // Số lượng khả dụng sau khi thay đổi
    @Column(name = "available_after", nullable = false)
    private Integer availableAfter;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
