package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.CategoryRequest;
import com.example.demo.dto.response.CategoryResponse;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.entity.Category;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "categories")
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        log.info("[Cache EVICT] createCategory - clearing all category cache");
        if (categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new RuntimeException("Category này đã tồn tại");
        }
        Category category = Category.builder()
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .build();
        categoryRepository.save(category);
        return CategoryResponse.fromEntity(category);
    }

    @Cacheable(value = "categories", key = "'category_all'")
    public List<CategoryResponse> getAllCategories() {
        log.info("[Cache MISS] getAllCategories - fetching from DB");
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "categories", key = "'category_' + #id")
    public CategoryResponse getCategoryById(Long id) {
        log.info("[Cache MISS] getCategoryById(id={}) - fetching from DB", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.info("[Cache EVICT] updateCategory(id={}) - clearing all category cache", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));
        // Kiểm tra tên trùng với category khác (không phải chính nó)
        categoryRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Tên category \"" + request.getName() + "\" đã tồn tại");
                    }
                });
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepository.save(category);
        return CategoryResponse.fromEntity(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(Long id) {
        log.info("[Cache EVICT] deleteCategory(id={}) - clearing all category cache", id);
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy category với id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
