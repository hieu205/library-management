package com.example.demo.controller;

import java.util.Locale.Category;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.CategoryRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.CategoryResponse;
import com.example.demo.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/c1/categies")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping()
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody CategoryRequest categoryRequest) {
        CategoryResponse categoryResponse = categoryService.createCategory(categoryRequest);
        ApiResponse<CategoryResponse> apiResponse = ApiResponse.<CategoryResponse>builder()
                .success(true)
                .message("OK")
                .data(categoryResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
