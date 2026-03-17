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
import org.springframework.web.bind.annotation.RequestParam;
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
                System.out.println("[BACKEND] API tạo sách - title=" + bookRequest.getTitle());
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
                System.out.println("[BACKEND] API cập nhật sách - bookId=" + id);
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
                System.out.println("[BACKEND] API xóa sách - bookId=" + id);
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
                System.out.println("[BACKEND] API lấy toàn bộ danh sách sách");
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
                System.out.println("[BACKEND] API lấy sách theo id - bookId=" + id);
                BookResponse bookResponse = bookService.getBookById(id);
                ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
                                .success(true)
                                .message("Lay sach theo id thanh cong")
                                .data(bookResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);

        }

        // cap nhat danh sach tac gia cho book
        @PostMapping("/{id}/authors")
        public ResponseEntity<ApiResponse<BookResponse>> addAuthorsToBook(@PathVariable Long id,
                        @Valid @RequestBody AddAuthorsToBookRequest addAuthorsToBookRequest) {
                System.out.println("[BACKEND] API thêm tác giả cho sách - bookId=" + id + ", soTacGia="
                                + (addAuthorsToBookRequest.getAuthorIds() != null
                                                ? addAuthorsToBookRequest.getAuthorIds().size()
                                                : 0));
                BookResponse bookResponse = bookService.addAuthorsToBook(id,
                                addAuthorsToBookRequest);
                ApiResponse<BookResponse> apiResponse = ApiResponse.<BookResponse>builder()
                                .success(true)
                                .message("cap nhat danh sach author thanh cong")
                                .data(bookResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // search book
        @GetMapping("/search")
        public ResponseEntity<ApiResponse<List<BookResponse>>> searchBook(@RequestParam String keyword) {
                System.out.println("[BACKEND] API tìm kiếm sách - keyword=" + keyword);
                List<BookResponse> bookResponses = bookService.searchBook(keyword);
                ApiResponse<List<BookResponse>> apiResponse = ApiResponse.<List<BookResponse>>builder()
                                .success(true)
                                .message("Tìm kiếm sách thành công")
                                .data(bookResponses)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }
}
