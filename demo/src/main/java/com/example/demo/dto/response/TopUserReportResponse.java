package com.example.demo.dto.response;

import com.example.demo.repository.TopUserProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopUserReportResponse {
    private Long userId;
    private String username;
    private Long borrowCount;

    public static TopUserReportResponse from(TopUserProjection projection) {
        return TopUserReportResponse.builder()
                .userId(projection.getUserId())
                .username(projection.getUsername())
                .borrowCount(projection.getBorrowCount())
                .build();
    }
}
