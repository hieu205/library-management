package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.AdminBorrowRequest;
import com.example.demo.dto.request.BorrowDecisionRequest;
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
            @Valid @RequestBody AdminBorrowRequest request) {
        BorrowResponse data = borrowService.createBorrowByAdmin(request);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Admin tạo phiếu mượn trực tiếp thành công")
                .data(data)
                .build());
    }

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<BorrowResponse>> createBorrowRequest(
            @Valid @RequestBody BorrowRequest request) {
        BorrowResponse data = borrowService.createBorrowRequest(request);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Đã gửi đơn mượn sách online, vui lòng chờ admin xét duyệt")
                .data(data)
                .build());
    }

    @PostMapping("/{borrowId}/approve")
    public ResponseEntity<ApiResponse<BorrowResponse>> approveBorrow(
            @PathVariable Long borrowId,
            @Valid @RequestBody(required = false) BorrowDecisionRequest request) {
        BorrowResponse data = borrowService.approveBorrow(
                borrowId,
                request != null ? request.getAdminNote() : null);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Duyệt đơn mượn thành công")
                .data(data)
                .build());
    }

    @PostMapping("/{borrowId}/reject")
    public ResponseEntity<ApiResponse<BorrowResponse>> rejectBorrow(
            @PathVariable Long borrowId,
            @Valid @RequestBody(required = false) BorrowDecisionRequest request) {
        BorrowResponse data = borrowService.rejectBorrow(
                borrowId,
                request != null ? request.getAdminNote() : null);
        return ResponseEntity.ok(ApiResponse.<BorrowResponse>builder()
                .success(true)
                .message("Đã từ chối đơn mượn")
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
                .message("Lấy danh sách phiếu mượn thành công")
                .data(listBorrowResponses)
                .build());
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getPendingBorrowRequests() {
        List<BorrowResponse> data = borrowService.getPendingBorrowRequests();
        return ResponseEntity.ok(ApiResponse.<List<BorrowResponse>>builder()
                .success(true)
                .message("Lấy danh sách đơn chờ duyệt thành công")
                .data(data)
                .build());
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getMyRequests(Authentication authentication) {
        List<BorrowResponse> data = borrowService.getMyBorrowRequests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<BorrowResponse>>builder()
                .success(true)
                .message("Lấy danh sách đơn mượn của bạn thành công")
                .data(data)
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
