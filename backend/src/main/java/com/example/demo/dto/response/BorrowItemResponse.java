package com.example.demo.dto.response;

import com.example.demo.entity.BorrowItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowItemResponse {
    private Long id;
    private Long borrowRecordId;
    private Long bookId;
    private String bookTitle;
    private Integer quantity;
    private Integer returnedQuantity;

    public static BorrowItemResponse fromEntity(BorrowItem borrowItem) {
        if (borrowItem == null) {
            return null;
        }
        return BorrowItemResponse.builder()
                .id(borrowItem.getId())
                .borrowRecordId(borrowItem.getBorrowRecord() != null ? borrowItem.getBorrowRecord().getId() : null)
                .bookId(borrowItem.getBook() != null ? borrowItem.getBook().getId() : null)
                .bookTitle(borrowItem.getBook() != null ? borrowItem.getBook().getTitle() : null)
                .quantity(borrowItem.getQuantity())
                .returnedQuantity(borrowItem.getReturnedQuantity())
                .build();
    }
}
