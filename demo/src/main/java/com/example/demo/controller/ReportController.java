package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.BorrowingBookReportResponse;
import com.example.demo.dto.response.OverdueRecordReportResponse;
import com.example.demo.dto.response.TopBookReportResponse;
import com.example.demo.dto.response.TopUserReportResponse;
import com.example.demo.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/top-books")
    public ResponseEntity<ApiResponse<List<TopBookReportResponse>>> getTopBooks(
            @RequestParam(defaultValue = "10") int limit) {
        List<TopBookReportResponse> data = reportService.getTopBooks(limit);
        return ResponseEntity.ok(ApiResponse.<List<TopBookReportResponse>>builder()
                .success(true)
                .message("Lấy danh sách sách được mượn nhiều nhất thành công")
                .data(data)
                .build());
    }

    @GetMapping("/top-users")
    public ResponseEntity<ApiResponse<List<TopUserReportResponse>>> getTopUsers(
            @RequestParam(defaultValue = "10") int limit) {
        List<TopUserReportResponse> data = reportService.getTopUsers(limit);
        return ResponseEntity.ok(ApiResponse.<List<TopUserReportResponse>>builder()
                .success(true)
                .message("Lấy danh sách người dùng mượn nhiều nhất thành công")
                .data(data)
                .build());
    }

    @GetMapping("/borrowing-books")
    public ResponseEntity<ApiResponse<List<BorrowingBookReportResponse>>> getBorrowingBooks() {
        List<BorrowingBookReportResponse> data = reportService.getBorrowingBooks();
        return ResponseEntity.ok(ApiResponse.<List<BorrowingBookReportResponse>>builder()
                .success(true)
                .message("Lấy danh sách sách đang được mượn thành công")
                .data(data)
                .build());
    }

    @GetMapping("/overdue-books")
    public ResponseEntity<ApiResponse<List<OverdueRecordReportResponse>>> getOverdueBooks() {
        List<OverdueRecordReportResponse> data = reportService.getOverdueRecords();
        return ResponseEntity.ok(ApiResponse.<List<OverdueRecordReportResponse>>builder()
                .success(true)
                .message("Lấy danh sách phiếu mượn quá hạn thành công")
                .data(data)
                .build());
    }
}
