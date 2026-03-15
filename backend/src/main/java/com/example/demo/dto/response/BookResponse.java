package com.example.demo.dto.response;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<AuthorResponse> authors;
    private List<CategoryResponse> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookResponse fromEntity(Book book) {
        if (book == null) {
            return null;
        }

        List<AuthorResponse> authors = book.getBookAuthors() == null
                ? Collections.emptyList()
                : book.getBookAuthors().stream()
                        .map(ba -> AuthorResponse.fromEntity(ba.getAuthor()))
                        .collect(Collectors.toList());

        List<CategoryResponse> categories = book.getBookCategories() == null
                ? Collections.emptyList()
                : book.getBookCategories().stream()
                        .map(bc -> CategoryResponse.fromEntity(bc.getCategory()))
                        .collect(Collectors.toList());

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .isbn(book.getIsbn())
                .publishYear(book.getPublishYear())
                .language(book.getLanguage())
                .authors(authors)
                .categories(categories)
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
