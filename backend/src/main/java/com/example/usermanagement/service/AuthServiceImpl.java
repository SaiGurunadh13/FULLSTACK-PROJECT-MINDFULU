package com.example.usermanagement.service;

import com.example.usermanagement.dto.AuthRequest;
import com.example.usermanagement.dto.AuthResponse;
import com.example.usermanagement.dto.RegisterRequest;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.exception.BadRequestException;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_ROLE = "STUDENT";

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Account already exists for this email.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(request.getPassword());
        user.setRole(normalizeRole(request.getRole()));

        userRepository.save(user);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getPassword() == null || !user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = "token-" + user.getId() + "-" + System.currentTimeMillis();
        AuthResponse.AuthUser authUser = new AuthResponse.AuthUser(
                user.getEmail(),
                normalizeRole(user.getRole()),
                user.getName()
        );

        return new AuthResponse(token, authUser);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return DEFAULT_ROLE;
        }
        return role.trim().toUpperCase(Locale.ROOT);
    }
}
