package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String tokenType;
    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiresInMs;
    private long refreshTokenExpiresInMs;
    private UserResponse user;
}
