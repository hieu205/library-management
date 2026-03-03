package com.example.demo.dto.response;

import java.time.LocalDateTime;

import com.example.demo.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String phone;
    private Long roleId;
    private String role;
    private String fullName;
    private String email;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roleId(user.getRole() != null ? user.getRole().getId() : null)
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .fullName(user.getFullName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .active(user.isActive())
                .build();
    }
}
