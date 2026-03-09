package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.AuthorRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.AuthorResponse;
import com.example.demo.service.AuthorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @PostMapping
    public ResponseEntity<ApiResponse<AuthorResponse>> createAuthor(
            @Valid @RequestBody AuthorRequest authorRequest) {
        AuthorResponse data = authorService.createAuthor(authorRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<AuthorResponse>builder()
                .success(true)
                .message("Tạo tác giả thành công")
                .data(data)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuthorResponse>>> getAllAuthors() {
        List<AuthorResponse> data = authorService.getAllAuthors();
        return ResponseEntity.ok(ApiResponse.<List<AuthorResponse>>builder()
                .success(true)
                .message("Lấy danh sách tác giả thành công")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuthorResponse>> getAuthorById(@PathVariable Long id) {
        AuthorResponse data = authorService.getAuthorById(id);
        return ResponseEntity.ok(ApiResponse.<AuthorResponse>builder()
                .success(true)
                .message("Lấy tác giả thành công")
                .data(data)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AuthorResponse>> updateAuthor(
            @PathVariable Long id,
            @Valid @RequestBody AuthorRequest request) {
        AuthorResponse data = authorService.updateAuthor(id, request);
        return ResponseEntity.ok(ApiResponse.<AuthorResponse>builder()
                .success(true)
                .message("Cập nhật tác giả thành công")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa tác giả thành công")
                .build());
    }
}
