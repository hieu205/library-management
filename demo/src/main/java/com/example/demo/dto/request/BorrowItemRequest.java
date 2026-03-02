package com.example.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowItemRequest {

    @NotNull(message = "BorrowRecordId không được để trống")
    @Positive(message = "BorrowRecordId phải là số dương")
    private Long borrowRecordId;

    @NotNull(message = "BookId không được để trống")
    @Positive(message = "BookId phải là số dương")
    private Long bookId;

    @NotNull(message = "Số lượng mượn không được để trống")
    @Min(value = 1, message = "Số lượng mượn phải lớn hơn 0")
    private Integer quantity;

    @NotNull(message = "Số lượng đã trả không được để trống")
    @Min(value = 0, message = "Số lượng đã trả không được âm")
    private Integer returnedQuantity;

    @AssertTrue(message = "Số lượng đã trả không được lớn hơn số lượng mượn")
    public boolean isReturnedQuantityValid() {
        if (quantity == null || returnedQuantity == null) {
            return true;
        }
        return returnedQuantity <= quantity;
    }

}
