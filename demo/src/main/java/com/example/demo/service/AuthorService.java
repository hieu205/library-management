package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.dto.request.AuthorRequest;
import com.example.demo.dto.response.AuthorResponse;
import com.example.demo.entity.Author;
import com.example.demo.repository.AuthorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public AuthorResponse createAuthor(AuthorRequest authorRequest) {
        if (authorRepository.existsByNameIgnoreCase(authorRequest.getName())) {
            throw new RuntimeException("da ton tai tac gia nay");
        }
        Author author = Author.builder()
                .name(authorRequest.getName())
                .biography(authorRequest.getBiography())
                .build();
        authorRepository.save(author);
        return AuthorResponse.fromEntity(author);
    }
}
