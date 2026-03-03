package com.example.demo.dto.response;

import com.example.demo.entity.BookCategory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCategoryResponse {
    private Long bookId;
    private String bookTitle;
    private Long categoryId;
    private String categoryName;

    public static BookCategoryResponse fromEntity(BookCategory bookCategory) {
        if (bookCategory == null) {
            return null;
        }
        return BookCategoryResponse.builder()
                .bookId(bookCategory.getBook() != null ? bookCategory.getBook().getId() : null)
                .bookTitle(bookCategory.getBook() != null ? bookCategory.getBook().getTitle() : null)
                .categoryId(bookCategory.getCategory() != null ? bookCategory.getCategory().getId() : null)
                .categoryName(bookCategory.getCategory() != null ? bookCategory.getCategory().getName() : null)
                .build();
    }
}
