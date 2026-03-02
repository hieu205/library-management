package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3-50 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 150, message = "Email không được vượt quá 150 ký tự")
    private String email;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, max = 100, message = "Password phải bắt buộc từ 6-100 kí tự")
    private String password;

    @NotBlank(message = "Full_name không được để trống")
    @Size(min = 2, max = 200, message = "Họ và tên phải từ 2-200 ký tự")
    private String fullName;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    @Pattern(regexp = "^$|^\\+?[0-9]{9,15}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotNull(message = "RoleId không được để trống")
    @Positive(message = "RoleId phải là số dương")
    private Long roleId;

}
