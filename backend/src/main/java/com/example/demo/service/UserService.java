package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.ChangePasswordRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.request.UserStatusUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "user_profiles")
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final BorrowRecordRepository borrowRecordRepository;

    @CacheEvict(value = "user_profiles", allEntries = true)
    public UserResponse register(UserRequest userRequest) {
        log.info("[Cache EVICT] register - clearing user profiles cache");
        System.out.println("[BACKEND] Bắt đầu đăng ký người dùng - username=" + userRequest.getUsername());
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            System.err.println("[BACKEND] Đăng ký thất bại do email đã tồn tại - email=" + userRequest.getEmail());
            throw new RuntimeException("Email đã tồn tại");
        }
        if (userRepository.existsByUsername((userRequest.getUsername()))) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByPhone(userRequest.getPhone())) {
            throw new RuntimeException("Phone đã được đăng kí rồi");

        }

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò của User"));
        User user = User.builder()
                .username(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .phone(userRequest.getPhone())
                .email(userRequest.getEmail())
                .fullName(userRequest.getFullName())
                .role(role)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
        System.out.println("[BACKEND] Đăng ký người dùng thành công - userId=" + user.getId() + ", username="
                + user.getUsername());
        return UserResponse.fromEntity(user);
    }

    public UserResponse login(LoginRequest loginRequest) {
        System.out.println("[BACKEND] Bắt đầu đăng nhập - username=" + loginRequest.getUsername());
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không đúng"));
        if (!user.isActive()) {
            System.err.println(
                    "[BACKEND] Đăng nhập thất bại do tài khoản bị khóa - username=" + loginRequest.getUsername());
            throw new RuntimeException("Tài khoản đã bị khóa");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            System.err.println(
                    "[BACKEND] Đăng nhập thất bại do sai mật khẩu - username=" + loginRequest.getUsername());
            throw new RuntimeException("Sai mật khẩu");
        }
        System.out.println("[BACKEND] Đăng nhập thành công - userId=" + user.getId() + ", username="
                + user.getUsername());
        return UserResponse.fromEntity(user);
    }

    @Cacheable(value = "user_profiles", key = "'user_profile_' + #name")
    public UserResponse getCurrentUserProfile(String name) {
        log.info("[Cache MISS] getCurrentUserProfile(name={}) - fetching from DB", name);
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("Không thể tim thấy user"));
        return UserResponse.fromEntity(user);
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public UserResponse updateCurrentUserProfile(String username, ProfileUpdateRequest profileUpdateRequest) {
        log.info("[Cache EVICT] updateCurrentUserProfile(username={}) - clearing user profiles cache", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        if (userRepository.existsByEmail(profileUpdateRequest.getEmail())
                && !user.getEmail().equals(profileUpdateRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (userRepository.existsByUsername(profileUpdateRequest.getUsername())
                && !user.getUsername().equals(profileUpdateRequest.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByPhone(profileUpdateRequest.getPhone())
                && !profileUpdateRequest.getPhone().equals(user.getPhone())) {
            throw new RuntimeException("Phone này đã được sử dụng");
        }
        user.setUsername(profileUpdateRequest.getUsername());
        user.setEmail(profileUpdateRequest.getEmail());
        user.setPhone(profileUpdateRequest.getPhone());
        user.setFullName(profileUpdateRequest.getFullName());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return UserResponse.fromEntity(user);
    }

    @Override
    @Cacheable(value = "user_profiles", key = "'user_profile_' + #username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("[Cache MISS] loadUserByUsername(username={}) - fetching from DB", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isActive(),
                true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())));
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public UserResponse createUser(UserRequest userRequest) {
        log.info("[Cache EVICT] createUser - clearing user profiles cache");
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (userRepository.existsByUsername((userRequest.getUsername()))) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByPhone(userRequest.getPhone())) {
            throw new RuntimeException("Phone đã được đăng kí rồi");

        }

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò User"));
        User user = User.builder()
                .username(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .phone(userRequest.getPhone())
                .email(userRequest.getEmail())
                .fullName(userRequest.getFullName())
                .role(role)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public UserResponse updateUserById(Long id, UserRequest userRequest) {
        log.info("[Cache EVICT] updateUserById(id={}) - clearing user profiles cache", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User có id là: " + id));
        if (userRequest.getUsername() != null && !user.getUsername().equals(userRequest.getUsername()) &&
                userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRequest.getEmail() != null && !user.getEmail().equals(userRequest.getEmail()) &&
                userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (userRepository.existsByPhone(userRequest.getPhone())) {
            throw new RuntimeException("Phone đã được đăng kí rồi");

        }

        if (userRequest.getUsername() != null) {
            user.setUsername(userRequest.getUsername());
        }
        if (userRequest.getEmail() != null) {
            user.setEmail(userRequest.getEmail());
        }

        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        if (userRequest.getFullName() != null) {
            user.setFullName(userRequest.getFullName());
        }

        if (userRequest.getPhone() != null) {
            user.setPhone(userRequest.getPhone());
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public UserResponse updateStatusUserById(Long id, UserStatusUpdateRequest userStatusUpdateRequest) {
        log.info("[Cache EVICT] updateStatusUserById(id={}) - clearing user profiles cache", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User có id là: " + id));
        user.setActive(userStatusUpdateRequest.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public void changePassword(String username, ChangePasswordRequest request) {
        log.info("[Cache EVICT] changePassword(username={}) - clearing user profiles cache", username);
        System.out.println("[BACKEND] Bắt đầu đổi mật khẩu - username=" + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            System.err.println(
                    "[BACKEND] Đổi mật khẩu thất bại do mật khẩu hiện tại không đúng - username=" + username);
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        System.out.println("[BACKEND] Đổi mật khẩu thành công - username=" + username);
    }

    @CacheEvict(value = "user_profiles", allEntries = true)
    public void deleteUserById(Long id) {
        log.info("[Cache EVICT] deleteUserById(id={}) - clearing user profiles cache", id);
        System.out.println("[BACKEND] Bắt đầu xóa người dùng - userId=" + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User có id là: " + id));
        if (borrowRecordRepository.existsByUser_Id(id)) {
            System.err.println("[BACKEND] Không thể xóa user vì đã có lịch sử mượn sách - userId=" + id);
            throw new RuntimeException("Không thể xóa user vì đã có lịch sử mượn sách");
        }
        userRepository.delete(user);
        System.out.println("[BACKEND] Xóa người dùng thành công - userId=" + id);
    }

    public List<UserResponse> getAllUser() {
        List<User> listUser = userRepository.findAll();
        return listUser.stream().map(UserResponse::fromEntity).toList();
    }
}
