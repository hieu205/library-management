package com.example.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.ChangePasswordRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.LogoutRequest;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.RefreshTokenRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.request.UserStatusUpdateRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.BorrowResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.AuthService;
import com.example.demo.service.BorrowService;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
        private final UserService userService;
        private final AuthService authService;
        private final BorrowService borrowService;

        // dang ki
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody UserRequest userRequest) {
                System.out.println("[BACKEND] API đăng ký người dùng - username=" + userRequest.getUsername());
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
        public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
                System.out.println("[BACKEND] API đăng nhập - username=" + loginRequest.getUsername());
                AuthResponse authResponse = authService.login(loginRequest);
                ApiResponse<AuthResponse> apiResponse = ApiResponse.<AuthResponse>builder()
                                .success(true)
                                .message("Đăng nhập thành công")
                                .data(authResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
                System.out.println("[BACKEND] API user refresh token");
                AuthResponse data = authService.refresh(request.getRefreshToken());
                return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                                .success(true)
                                .message("Làm mới token thành công")
                                .data(data)
                                .build());
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout(
                        @RequestBody(required = false) LogoutRequest request,
                        @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

                String refreshToken = request != null ? request.getRefreshToken() : null;
                String accessToken = extractBearerToken(authorizationHeader);

                authService.logout(refreshToken, accessToken);

                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .success(true)
                                .message("Đăng xuất thành công")
                                .build());
        }

        // lấy dữ liệu của user hiện tại
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(Authentication authentication) {
                System.out.println("[BACKEND] API lấy hồ sơ cá nhân - username=" + authentication.getName());
                String name = authentication.getName();
                UserResponse userResponse = userService.getCurrentUserProfile(name);

                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // đổi mật khẩu (chỉ đổi password, giữ nguyên các trường khác)
        @PatchMapping("/me/password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                        @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
                        Authentication authentication) {
                System.out.println("[BACKEND] API đổi mật khẩu - username=" + authentication.getName());
                userService.changePassword(authentication.getName(), changePasswordRequest);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .success(true)
                                .message("Đổi mật khẩu thành công")
                                .build());
        }

        // cập nhật profile (cho cập nhật tất cả trừ password)
        @PutMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUserProfile(
                        @RequestBody ProfileUpdateRequest profileUpdateRequest, Authentication authentication) {
                System.out.println("[BACKEND] API cập nhật hồ sơ cá nhân - username=" + authentication.getName());
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
                System.out.println("[BACKEND] API admin tạo người dùng - username=" + userRequest.getUsername());
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
                System.out.println("[BACKEND] API admin cập nhật người dùng - userId=" + id);
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
                System.out.println("[BACKEND] API admin cập nhật trạng thái người dùng - userId=" + id
                                + ", isActive=" + userStatusUpdateRequest.getIsActive());
                UserResponse userResponse = userService.updateStatusUserById(id, userStatusUpdateRequest);
                ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(userResponse)
                                .build();
                return ResponseEntity.ok(apiResponse);
        }

        // Lịch sử mượn sách của user hiện tại (tất cả trạng thái)
        @GetMapping("/me/borrow-history")
        public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getBorrowHistory(
                        Authentication authentication,
                        @PageableDefault(size = 20, sort = "id") Pageable pageable) {
                System.out.println("[BACKEND] API lấy lịch sử mượn của chính mình - username="
                                + authentication.getName() + ", page=" + pageable.getPageNumber() + ", size="
                                + pageable.getPageSize());
                Page<BorrowResponse> data = borrowService.getBorrowHistory(authentication.getName(), pageable);
                return ResponseEntity.ok(ApiResponse.<Page<BorrowResponse>>builder()
                                .success(true)
                                .message("Lấy lịch sử mượn sách thành công")
                                .data(data)
                                .build());
        }

        // Các phiếu mượn đang còn hiệu lực (status = BORROWING) của user hiện tại
        @GetMapping("/me/current-borrows")
        public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getCurrentBorrows(
                        Authentication authentication,
                        @PageableDefault(size = 20, sort = "id") Pageable pageable) {
                System.out.println("[BACKEND] API lấy danh sách đang mượn của chính mình - username="
                                + authentication.getName() + ", page=" + pageable.getPageNumber() + ", size="
                                + pageable.getPageSize());
                Page<BorrowResponse> data = borrowService.getCurrentBorrows(authentication.getName(), pageable);
                return ResponseEntity.ok(ApiResponse.<Page<BorrowResponse>>builder()
                                .success(true)
                                .message("Lấy danh sách đang mượn thành công")
                                .data(data)
                                .build());
        }

        // Lấy lịch sử mượn sách của 1 user cụ thể theo userId (dành cho admin)
        @GetMapping("/{userId}/borrow-history")
        public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getBorrowHistoryByUserId(
                        @PathVariable Long userId,
                        @PageableDefault(size = 20, sort = "id") Pageable pageable) {
                System.out.println("[BACKEND] API admin lấy lịch sử mượn theo userId - userId=" + userId
                                + ", page=" + pageable.getPageNumber() + ", size=" + pageable.getPageSize());
                Page<BorrowResponse> data = borrowService.getBorrowHistoryByUserId(userId, pageable);
                return ResponseEntity.ok(ApiResponse.<Page<BorrowResponse>>builder()
                                .success(true)
                                .message("Lấy lịch sử mượn sách của user thành công")
                                .data(data)
                                .build());
        }

        // xóa user theo id (chỉ admin)
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteUserById(@PathVariable Long id) {
                System.out.println("[BACKEND] API admin xóa người dùng - userId=" + id);
                userService.deleteUserById(id);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .success(true)
                                .message("Xóa user thành công")
                                .build());
        }

        // Lấy về tất cả user (cả user có active = false)
        @GetMapping()
        public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser() {
                System.out.println("[BACKEND] API admin lấy toàn bộ danh sách người dùng");
                List<UserResponse> userResponses = userService.getAllUser();
                ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                                .success(true)
                                .message("Lấy danh sách user thành công")
                                .data(userResponses)
                                .build();

                return ResponseEntity.ok(apiResponse);
        }

        private String extractBearerToken(String authorizationHeader) {
                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                        return null;
                }
                return authorizationHeader.substring(7);
        }
}
