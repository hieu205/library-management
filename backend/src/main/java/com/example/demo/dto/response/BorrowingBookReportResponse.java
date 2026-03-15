package com.example.demo.dto.response;

import com.example.demo.repository.BorrowingBookProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingBookReportResponse {
    private Long bookId;
    private String title;
    private String isbn;
    private Long quantityCurrentlyBorrowed;
    private Long activeBorrowCount;

    public static BorrowingBookReportResponse from(BorrowingBookProjection p) {
        return BorrowingBookReportResponse.builder()
                .bookId(p.getBookId())
                .title(p.getTitle())
                .isbn(p.getIsbn())
                .quantityCurrentlyBorrowed(p.getQuantityCurrentlyBorrowed())
                .activeBorrowCount(p.getActiveBorrowCount())
                .build();
    }
}
