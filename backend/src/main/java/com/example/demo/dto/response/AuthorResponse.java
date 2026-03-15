package com.example.demo.dto.response;

import com.example.demo.entity.Author;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorResponse {
    private Long id;
    private String name;
    private String biography;

    public static AuthorResponse fromEntity(Author author) {
        if (author == null) {
            return null;
        }
        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .biography(author.getBiography())
                .build();
    }
}
