package com.example.demo.dto.response;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import com.example.demo.entity.BorrowRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverdueRecordReportResponse {
    private Long borrowId;
    private Long userId;
    private String username;
    private String fullName;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private Long daysOverdue;

    public static OverdueRecordReportResponse from(BorrowRecord record) {
        long overdue = ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
        return OverdueRecordReportResponse.builder()
                .borrowId(record.getId())
                .userId(record.getUser().getId())
                .username(record.getUser().getUsername())
                .fullName(record.getUser().getFullName())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .daysOverdue(overdue)
                .build();
    }
}
