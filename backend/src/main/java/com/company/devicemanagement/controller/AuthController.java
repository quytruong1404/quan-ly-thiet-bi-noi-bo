package com.company.devicemanagement.controller;

import com.company.devicemanagement.dto.AuthResponse;
import com.company.devicemanagement.dto.LoginRequest;
import com.company.devicemanagement.model.User;
import com.company.devicemanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "1. Xác thực & Người dùng (Auth & Users)", description = "Đăng nhập, danh sách nhân viên và thông tin người dùng")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống (Admin / Nhân viên)")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    @Operation(summary = "Lấy danh sách tất cả người dùng trong công ty")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Lấy thông tin chi tiết một người dùng")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }
}
