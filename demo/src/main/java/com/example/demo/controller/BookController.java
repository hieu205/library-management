package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.demo.dto.request.AddAuthorsToBookRequest;
import com.example.demo.dto.request.BookRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.BookResponse;
import com.example.demo.service.BookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor

public class BookController {
    private final BookService bookService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<BookResponse>> createBook(@Valid @RequestBody BookRequest bookRequest) {
        BookResponse bookResponse = bookService.createBook(bookRequest);
        ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
                .success(true)
                .message("ok")
                .data(bookResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> updateBookById(@PathVariable Long id,
            @Valid @RequestBody BookRequest bookRequest) {
        BookResponse bookResponse = bookService.updateBookById(id, bookRequest);
        ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
                .success(true)
                .message("update book thành công")
                .data(bookResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBookById(@PathVariable Long id) {
        bookService.deleteBookById(id);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa sách thành công")
                .data(null)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBook() {
        List<BookResponse> listBookResponse = bookService.getAllBook();
        ApiResponse<List<BookResponse>> apiResponse = ApiResponse.<List<BookResponse>>builder()
                .success(true)
                .message("lay danh sach book thanh cong")
                .data(listBookResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        BookResponse bookResponse = bookService.getBookById(id);
        ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
                .success(true)
                .message("Lay sach theo id thanh cong")
                .data(bookResponse)
                .build();
        return ResponseEntity.ok(apiResponse);

    }

    // cap nhat danh sach tac gia cho book
    // @PostMapping("/{id}/authors")
    // public ResponseEntity<ApiResponse<BookResponse>>
    // addAuthorsToBook(@PathVariable Long id,
    // @RequestBody AddAuthorsToBookRequest addAuthorsToBookRequest) {
    // BookResponse bookResponse = bookService.addAuthorsToBook(id,
    // addAuthorsToBookRequest);
    // ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
    // .success(true)
    // .message("cap nhat danh sach author thanh cong")
    // .data(bookResponse)
    // .build();
    // return ResponseEntity.ok(apiResponse);
    // }
}
