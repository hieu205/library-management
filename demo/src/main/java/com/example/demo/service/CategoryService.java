package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.dto.request.CategoryRequest;
import com.example.demo.dto.response.CategoryResponse;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.entity.Category;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if (categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new RuntimeException("Category nay da ton tai");
        }
        Category category = Category.builder()
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .build();
        categoryRepository.save(category);
        return CategoryResponse.fromEntity(category);
    }
}
