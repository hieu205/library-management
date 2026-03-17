package com.example.demo.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TokenStoreService tokenStoreService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        tokenStoreService.revokeAllUserRefreshTokens(user.getId());
        tokenStoreService.saveRefreshToken(user, refreshToken, jwtService.extractExpirationInstant(refreshToken));

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresInMs(jwtService.getAccessTokenExpirationMs())
                .refreshTokenExpiresInMs(jwtService.getRefreshTokenExpirationMs())
                .user(UserResponse.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Token refresh không hợp lệ");
        }

        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (!jwtService.isTokenValid(refreshToken, username)) {
            throw new RuntimeException("Refresh token đã hết hạn hoặc không hợp lệ");
        }

        if (!tokenStoreService.isRefreshTokenActive(refreshToken)) {
            throw new RuntimeException("Refresh token đã bị thu hồi hoặc không tồn tại");
        }

        tokenStoreService.revokeRefreshToken(refreshToken);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        tokenStoreService.saveRefreshToken(user, newRefreshToken, jwtService.extractExpirationInstant(newRefreshToken));

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .accessTokenExpiresInMs(jwtService.getAccessTokenExpirationMs())
                .refreshTokenExpiresInMs(jwtService.getRefreshTokenExpirationMs())
                .user(UserResponse.fromEntity(user))
                .build();
    }

    @Transactional
    public void logout(String refreshToken, String accessToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            tokenStoreService.revokeRefreshToken(refreshToken);
        }

        if (accessToken != null && !accessToken.isBlank()) {
            try {
                String username = jwtService.extractUsername(accessToken);
                if (jwtService.isTokenValid(accessToken, username)) {
                    userRepository.findByUsername(username)
                            .ifPresent(user -> tokenStoreService.revokeAllUserRefreshTokens(user.getId()));
                }
            } catch (Exception ex) {
                // ignore invalid access token while logout
            }
        }
    }
}
