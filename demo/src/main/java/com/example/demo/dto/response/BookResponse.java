package com.example.demo.dto.response;

import java.time.LocalDateTime;

import com.example.demo.entity.Book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String description;
    private String isbn;
    private Integer publishYear;
    private String language;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookResponse fromEntity(Book book) {
        if (book == null) {
            return null;
        }
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .isbn(book.getIsbn())
                .publishYear(book.getPublishYear())
                .language(book.getLanguage())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
