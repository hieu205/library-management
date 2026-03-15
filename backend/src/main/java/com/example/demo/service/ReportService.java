package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.demo.dto.response.BorrowingBookReportResponse;
import com.example.demo.dto.response.OverdueRecordReportResponse;
import com.example.demo.dto.response.TopBookReportResponse;
import com.example.demo.dto.response.TopUserReportResponse;
import com.example.demo.repository.BorrowItemRepository;
import com.example.demo.repository.BorrowRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowItemRepository borrowItemRepository;

    public List<TopBookReportResponse> getTopBooks(int limit) {
        return borrowItemRepository.getTopBooks(PageRequest.of(0, limit))
                .stream()
                .map(TopBookReportResponse::from)
                .collect(Collectors.toList());
    }

    public List<TopUserReportResponse> getTopUsers(int limit) {
        return borrowRecordRepository.getTopUsers(PageRequest.of(0, limit))
                .stream()
                .map(TopUserReportResponse::from)
                .collect(Collectors.toList());
    }

    public List<BorrowingBookReportResponse> getBorrowingBooks() {
        return borrowItemRepository.getBorrowingBooks()
                .stream()
                .map(BorrowingBookReportResponse::from)
                .collect(Collectors.toList());
    }

    public List<OverdueRecordReportResponse> getOverdueRecords() {
        return borrowRecordRepository.findByDueDateBeforeAndStatus(LocalDate.now(), "BORROWING")
                .stream()
                .map(OverdueRecordReportResponse::from)
                .collect(Collectors.toList());
    }
}
