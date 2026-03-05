package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.request.UserStatusUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(UserRequest userRequest) {
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
        return UserResponse.fromEntity(user);
    }

    public UserResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không đúng"));
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }
        return UserResponse.fromEntity(user);
    }

    public UserResponse getCurrentUserProfile(String name) {
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("Không thể tim thấy user"));
        return UserResponse.fromEntity(user);
    }

    public UserResponse updateCurrentUserProfile(String username, ProfileUpdateRequest profileUpdateRequest) {
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isActive(),
                true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())));
    }

    public UserResponse createUser(UserRequest userRequest) {
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

    public UserResponse updateUserById(Long id, UserRequest userRequest) {
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

    public UserResponse updateStatusUserById(Long id, UserStatusUpdateRequest userStatusUpdateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User có id là: " + id));
        user.setActive(userStatusUpdateRequest.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    public List<UserResponse> getAllUser() {
        List<User> listUser = userRepository.findAll();
        return listUser.stream().map(UserResponse::fromEntity).toList();
    }
}
