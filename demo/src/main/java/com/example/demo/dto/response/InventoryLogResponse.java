package com.example.demo.dto.response;

import java.time.LocalDateTime;

import com.example.demo.entity.InventoryLog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLogResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String changeType;
    private Integer quantityChanged;
    private Integer totalAfter;
    private Integer availableAfter;
    private String note;
    private LocalDateTime createdAt;

    public static InventoryLogResponse fromEntity(InventoryLog log) {
        if (log == null) {
            return null;
        }
        return InventoryLogResponse.builder()
                .id(log.getId())
                .bookId(log.getBook() != null ? log.getBook().getId() : null)
                .bookTitle(log.getBook() != null ? log.getBook().getTitle() : null)
                .changeType(log.getChangeType())
                .quantityChanged(log.getQuantityChanged())
                .totalAfter(log.getTotalAfter())
                .availableAfter(log.getAvailableAfter())
                .note(log.getNote())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
