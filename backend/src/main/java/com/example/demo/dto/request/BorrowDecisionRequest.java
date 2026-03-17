package com.example.demo.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDecisionRequest {

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String adminNote;
}
