package com.example.demo.dto.request;

import jakarta.validation.constraints.Min;
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
public class InventoryRequest {

    @NotNull(message = "BookId không được để trống")
    @Positive(message = "BookId phải là số dương")
    private Long bookId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng nhập phải íd nhất là 1")
    private Integer quantity;

    private String note;
}
