package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

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
            throw new RuntimeException("Tác giả \"" + authorRequest.getName() + "\" đã tồn tại");
        }
        Author author = Author.builder()
                .name(authorRequest.getName())
                .biography(authorRequest.getBiography())
                .build();
        authorRepository.save(author);
        return AuthorResponse.fromEntity(author);
    }

    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả với id: " + id));
        return AuthorResponse.fromEntity(author);
    }

    public AuthorResponse updateAuthor(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả với id: " + id));
        // Kiểm tra tên trùng với tác giả khác (không phải chính nó)
        authorRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Tên tác giả \"" + request.getName() + "\" đã tồn tại");
                    }
                });
        author.setName(request.getName());
        author.setBiography(request.getBiography());
        authorRepository.save(author);
        return AuthorResponse.fromEntity(author);
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tác giả với id: " + id);
        }
        authorRepository.deleteById(id);
    }
}
