package com.example.demo.dto.request;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRequest {

    @NotBlank(message = "Tiêu đề sách không được để trống")
    @Size(max = 255, message = "Tiêu đề sách không được vượt quá 255 ký tự")
    private String title;

    @Size(max = 5000, message = "Mô tả không được vượt quá 5000 ký tự")
    private String description;

    @Size(max = 50, message = "ISBN không được vượt quá 50 ký tự")
    private String isbn;

    @Min(value = 1450, message = "Năm xuất bản không hợp lệ")
    @Max(value = 2100, message = "Năm xuất bản không hợp lệ")
    private Integer publishYear;

    @Size(min = 2, max = 50, message = "Ngôn ngữ phải từ 2-50 ký tự")
    private String language;

    private List<Long> authorIds;

    private List<Long> categoryIds;

    @NotBlank(message = "Ảnh chính (image_url_1) không được để trống")
    @Size(max = 500, message = "URL ảnh chính không được vượt quá 500 ký tự")
    private String imageUrl1;

    @NotBlank(message = "Ảnh phụ 1 (image_url_2) không được để trống")
    @Size(max = 500, message = "URL ảnh phụ 1 không được vượt quá 500 ký tự")
    private String imageUrl2;

    @NotBlank(message = "Ảnh phụ 2 (image_url_3) không được để trống")
    @Size(max = 500, message = "URL ảnh phụ 2 không được vượt quá 500 ký tự")
    private String imageUrl3;

}
