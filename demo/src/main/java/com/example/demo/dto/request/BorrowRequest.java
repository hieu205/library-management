package com.example.demo.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequest {

    @NotEmpty(message = "Danh sách sách mượn không được để trống")
    @Valid
    private List<BorrowItemLine> items;

    @Future(message = "Ngày hạn trả phải sau ngày hôm nay")
    private LocalDate dueDate; // Nếu null -> mặc định 14 ngày từ ngày mượn

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BorrowItemLine {

        @NotNull(message = "BookId không được để trống")
        @Positive(message = "BookId phải là số dương")
        private Long bookId;

        @NotNull(message = "Số lượng mượn không được để trống")
        @Min(value = 1, message = "Số lượng mượn phải ít nhất là 1")
        private Integer quantity;
    }
}
