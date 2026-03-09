package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.BorrowRequest;
import com.example.demo.dto.request.ReturnRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.BorrowResponse;
import com.example.demo.service.BorrowService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping
    public ResponseEntity<ApiResponse<BorrowResponse>> createBorrow(
            @Valid @RequestBody BorrowRequest request) {
        BorrowResponse data = borrowService.createBorrow(request);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Mượn sách thành công")
                .data(data)
                .build());
    }

    @PostMapping("/{borrowId}/return")
    public ResponseEntity<ApiResponse<BorrowResponse>> returnBorrow(
            @PathVariable Long borrowId,
            @Valid @RequestBody ReturnRequest returnRequest) {
        BorrowResponse data = borrowService.returnBorrow(borrowId, returnRequest);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Trả sách thành công")
                .data(data)
                .build());
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getAllBorrow() {
        List<BorrowResponse> listBorrowResponses = borrowService.getAllBorrow();
        return ResponseEntity.ok(ApiResponse.<List<BorrowResponse>>builder()
                .success(true)
                .message("Trả sách thành công")
                .data(listBorrowResponses)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BorrowResponse>> getBorrowById(@PathVariable Long id) {
        BorrowResponse borrowResponse = borrowService.getBorrowById(id);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Lấy BorrowRecord thành công")
                .data(borrowResponse)
                .build());
    }
}
