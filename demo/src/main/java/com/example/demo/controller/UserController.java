package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.request.UserStatusUpdateRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
        private final UserService userService;

        // dang ki
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody UserRequest userRequest) {
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
                String name = authentication.getName();
                UserResponse userResponse = userService.updateCurrentUserProfile(name,
                                profileUpdateRequest);
                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // tạo mới user (chỉ có admin có thể làm)
        @PostMapping()
        public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserRequest userRequest) {
                UserResponse userResponse = userService.createUser(userRequest);
                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // cập nhật thông tin user theo id (chỉ admin có thể làm)
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<UserResponse>> updateUserById(@PathVariable Long id,
                        @RequestBody UserRequest userRequest) {
                UserResponse userResponse = userService.updateUserById(id, userRequest);

                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // cập nhật status tài khoản User (chỉ có admin có thể làm)
        @PatchMapping("/{id}/status")
        public ResponseEntity<ApiResponse<UserResponse>> updateStatusUserById(@PathVariable Long id,
                        @RequestBody UserStatusUpdateRequest userStatusUpdateRequest) {
                UserResponse userResponse = userService.updateStatusUserById(id, userStatusUpdateRequest);
                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // Lấy về tất cả user (cả user có active = false)
        @GetMapping()
        public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser() {
                List<UserResponse> userResponses = userService.getAllUser();
                ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                                .success(true)
                                .message("Lấy danh sách user thành công")
                                .data(userResponses)
                                .build();

                return ResponseEntity.ok(apiResponse);
        }
}
