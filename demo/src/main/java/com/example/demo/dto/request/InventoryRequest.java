package com.example.demo.dto.request;

import jakarta.validation.constraints.AssertTrue;
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

    @NotNull(message = "Tổng số lượng không được để trống")
    @Min(value = 0, message = "Tổng số lượng không được âm")
    private Integer totalQuantity;

    @NotNull(message = "Số lượng có sẵn không được để trống")
    @Min(value = 0, message = "Số lượng có sẵn không được âm")
    private Integer availableQuantity;

    @AssertTrue(message = "Số lượng có sẵn không được lớn hơn tổng số lượng")
    public boolean isAvailableQuantityValid() {
        if (totalQuantity == null || availableQuantity == null) {
            return true;
        }
        return availableQuantity <= totalQuantity;
    }
}
