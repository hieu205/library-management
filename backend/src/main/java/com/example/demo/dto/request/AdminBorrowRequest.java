package com.example.demo.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminBorrowRequest {

    @NotNull(message = "UserId không được để trống")
    @Positive(message = "UserId phải là số dương")
    private Long userId;

    @NotEmpty(message = "Danh sách sách mượn không được để trống")
    @Valid
    private List<BorrowRequest.BorrowItemLine> items;

    @Future(message = "Ngày hạn trả phải sau ngày hôm nay")
    private LocalDate dueDate;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String adminNote;
}
