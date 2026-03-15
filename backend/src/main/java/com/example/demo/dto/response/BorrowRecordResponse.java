package com.example.demo.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.entity.BorrowRecord;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRecordResponse {
    private Long id;
    private Long userId;
    private String username;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private String status;
    private LocalDateTime createdAt;

    public static BorrowRecordResponse fromEntity(BorrowRecord borrowRecord) {
        if (borrowRecord == null) {
            return null;
        }
        return BorrowRecordResponse.builder()
                .id(borrowRecord.getId())
                .userId(borrowRecord.getUser() != null ? borrowRecord.getUser().getId() : null)
                .username(borrowRecord.getUser() != null ? borrowRecord.getUser().getUsername() : null)
                .borrowDate(borrowRecord.getBorrowDate())
                .dueDate(borrowRecord.getDueDate())
                .status(borrowRecord.getStatus())
                .createdAt(borrowRecord.getCreatedAt())
                .build();
    }
}
