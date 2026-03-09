package com.example.demo.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequest {
    @NotEmpty
    @Valid
    private List<ReturnItemLine> items;

    @Data
    public static class ReturnItemLine {
        @NotNull
        @Positive
        private Long bookId;

        @NotNull
        @Min(1)
        private Integer returnQuantity;
    }
}
