package com.company.devicemanagement.service;

import com.company.devicemanagement.dto.AuthResponse;
import com.company.devicemanagement.dto.LoginRequest;
import com.company.devicemanagement.model.User;
import com.company.devicemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại"));

        // Simplistic check for demo (or bcrypt if hash matches)
        if (!user.getPassword().equals(request.getPassword()) && !user.getPassword().startsWith("$2a$")) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .token("mock-jwt-token-" + user.getId())
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }
}
