package com.example.demo.dto.response;

import com.example.demo.repository.TopBookProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopBookReportResponse {
    private Long bookId;
    private String title;
    private Long totalBorrowed;

    public static TopBookReportResponse from(TopBookProjection projection) {
        return TopBookReportResponse.builder()
                .bookId(projection.getBookId())
                .title(projection.getTitle())
                .totalBorrowed(projection.getTotalBorrowed())
                .build();
    }
}
