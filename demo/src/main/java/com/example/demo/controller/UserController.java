package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // dang ki
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.register(userRequest);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("OK")
                .data(userResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // dang nhap
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@RequestBody LoginRequest loginRequest) {
        UserResponse userResponse = userService.login(loginRequest);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("OK")
                .data(userResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // lấy dữ liệu của user hiện tại
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(Authentication authentication) {
        String name = authentication.getName();
        UserResponse userResponse = userService.getCurrentUserProfile(name);

        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("OK")
                .data(userResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // cập nhật profile (cho cập nhật tất cả trừ password)
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUserProfile(
            @RequestBody ProfileUpdateRequest profileUpdateRequest, Authentication authentication) {
        UserResponse userResponse = userService.getCurrentUserProfile(authentication.getName(),
                profileUpdateRequest);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("OK")
                .data(userResponse)
                .build();
    }
}
