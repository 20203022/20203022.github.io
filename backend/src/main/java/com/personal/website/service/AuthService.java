package com.personal.website.service;

import com.personal.website.dto.AuthDto;
import com.personal.website.model.User;
import com.personal.website.repository.UserRepository;
import com.personal.website.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.USER)
                .build();

        user = userRepo.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getUsername(), user.getRole().name(), user.getId());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        User user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getUsername(), user.getRole().name(), user.getId());
    }
}
