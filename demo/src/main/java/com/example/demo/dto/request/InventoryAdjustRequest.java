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
public class InventoryAdjustRequest {

    @NotNull(message = "BookId không được để trống")
    @Positive(message = "BookId phải là số dương")
    private Long bookId;

    // Số lượng tuyệt đối mới (không phải delta)
    @NotNull(message = "Số lượng mới không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer newTotalQuantity;

    private String note;
}
