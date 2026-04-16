package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.AuthorRequest;
import com.example.demo.dto.response.AuthorResponse;
import com.example.demo.entity.Author;
import com.example.demo.repository.AuthorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "authors")
public class AuthorService {
    private final AuthorRepository authorRepository;

    @CacheEvict(value = "authors", allEntries = true)
    public AuthorResponse createAuthor(AuthorRequest authorRequest) {
        log.info("[Cache EVICT] createAuthor - clearing all author cache");
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

    @Cacheable(value = "authors", key = "'author_all'")
    public List<AuthorResponse> getAllAuthors() {
        log.info("[Cache MISS] getAllAuthors - fetching from DB");
        return authorRepository.findAll().stream()
                .map(AuthorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "authors", key = "'author_' + #id")
    public AuthorResponse getAuthorById(Long id) {
        log.info("[Cache MISS] getAuthorById(id={}) - fetching from DB", id);
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả với id: " + id));
        return AuthorResponse.fromEntity(author);
    }

    @CacheEvict(value = "authors", allEntries = true)
    public AuthorResponse updateAuthor(Long id, AuthorRequest request) {
        log.info("[Cache EVICT] updateAuthor(id={}) - clearing all author cache", id);
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

    @CacheEvict(value = "authors", allEntries = true)
    public void deleteAuthor(Long id) {
        log.info("[Cache EVICT] deleteAuthor(id={}) - clearing all author cache", id);
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tác giả với id: " + id);
        }
        authorRepository.deleteById(id);
    }
}
