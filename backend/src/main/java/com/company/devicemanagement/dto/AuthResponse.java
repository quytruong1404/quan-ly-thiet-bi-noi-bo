package com.company.devicemanagement.dto;

import com.company.devicemanagement.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String department;
    private Role role;
    private String avatar;
    private String token;
}
