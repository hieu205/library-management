package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorRequest {

    @NotBlank(message = "Tên tác giả không được để trống")
    @Size(min = 2, max = 255, message = "Tên tác giả phải từ 2-255 ký tự")
    private String name;

    @Size(max = 5000, message = "Tiểu sử không được vượt quá 5000 ký tự")
    private String biography;

}
