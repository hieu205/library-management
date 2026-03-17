package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AuthToken;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByTokenHashAndRevokedFalse(String tokenHash);

    List<AuthToken> findByUser_IdAndRevokedFalse(Long userId);
}
