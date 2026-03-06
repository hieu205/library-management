package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.AuthorRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.AuthorResponse;
import com.example.demo.service.AuthorService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<AuthorResponse>> createAuthor(@RequestBody AuthorRequest authorRequest) {
        AuthorResponse authorResponse = authorService.createAuthor(authorRequest);
        ApiResponse<AuthorResponse> apiResponse = ApiResponse.<AuthorResponse>builder()
                .success(true)
                .message("Tao Author thang cong")
                .data(authorResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
