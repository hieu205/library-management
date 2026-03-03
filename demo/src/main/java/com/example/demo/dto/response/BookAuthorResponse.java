package com.example.demo.dto.response;

import com.example.demo.entity.BookAuthor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookAuthorResponse {
    private Long bookId;
    private String bookTitle;
    private Long authorId;
    private String authorName;

    public static BookAuthorResponse fromEntity(BookAuthor bookAuthor) {
        if (bookAuthor == null) {
            return null;
        }
        return BookAuthorResponse.builder()
                .bookId(bookAuthor.getBook() != null ? bookAuthor.getBook().getId() : null)
                .bookTitle(bookAuthor.getBook() != null ? bookAuthor.getBook().getTitle() : null)
                .authorId(bookAuthor.getAuthor() != null ? bookAuthor.getAuthor().getId() : null)
                .authorName(bookAuthor.getAuthor() != null ? bookAuthor.getAuthor().getName() : null)
                .build();
    }
}
