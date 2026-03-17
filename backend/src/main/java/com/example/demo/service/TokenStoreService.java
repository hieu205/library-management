package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HexFormat;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.AuthToken;
import com.example.demo.entity.User;
import com.example.demo.repository.AuthTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenStoreService {

    private final AuthTokenRepository authTokenRepository;

    @Transactional
    public void saveRefreshToken(User user, String rawRefreshToken, java.time.Instant expiresAt) {
        String hash = hashToken(rawRefreshToken);
        AuthToken authToken = AuthToken.builder()
                .user(user)
                .tokenHash(hash)
                .tokenType(AuthToken.TYPE_REFRESH)
                .revoked(false)
                .expiresAt(LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault()))
                .createdAt(LocalDateTime.now())
                .build();
        authTokenRepository.save(authToken);
    }

    @Transactional(readOnly = true)
    public boolean isRefreshTokenActive(String rawRefreshToken) {
        String hash = hashToken(rawRefreshToken);
        return authTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .filter(token -> token.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Transactional
    public void revokeRefreshToken(String rawRefreshToken) {
        String hash = hashToken(rawRefreshToken);
        authTokenRepository.findByTokenHashAndRevokedFalse(hash).ifPresent(token -> {
            token.setRevoked(true);
            authTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllUserRefreshTokens(Long userId) {
        List<AuthToken> activeTokens = authTokenRepository.findByUser_IdAndRevokedFalse(userId);
        if (activeTokens.isEmpty()) {
            return;
        }
        for (AuthToken token : activeTokens) {
            token.setRevoked(true);
        }
        authTokenRepository.saveAll(activeTokens);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (Exception ex) {
            throw new RuntimeException("Không thể băm token", ex);
        }
    }
}
