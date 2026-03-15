package com.example.demo.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddAuthorsToBookRequest {

    @NotEmpty(message = "Danh sách tác giả không được để trống")
    private List<Long> authorIds;
}
