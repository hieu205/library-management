package com.example.demo.dto.response;

import java.time.LocalDateTime;

import com.example.demo.entity.Inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static InventoryResponse fromEntity(Inventory inventory) {
        if (inventory == null) {
            return null;
        }
        return InventoryResponse.builder()
                .id(inventory.getId())
                .bookId(inventory.getBook() != null ? inventory.getBook().getId() : null)
                .bookTitle(inventory.getBook() != null ? inventory.getBook().getTitle() : null)
                .totalQuantity(inventory.getTotalQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}
