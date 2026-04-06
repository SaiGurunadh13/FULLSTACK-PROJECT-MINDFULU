package com.example.usermanagement.service;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.exception.BadRequestException;
import com.example.usermanagement.exception.ResourceNotFoundException;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final String DEFAULT_ROLE = "STUDENT";

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public User createUser(User user) {
        validateUserPayload(user);

        String normalizedName = user.getName().trim();
        String normalizedEmail = normalizeEmail(user.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email already in use");
        }

        user.setId(null);
        user.setName(normalizedName);
        user.setEmail(normalizedEmail);
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole(DEFAULT_ROLE);
        }
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = getUserById(id);
        validateUserPayload(user);

        String normalizedName = user.getName().trim();
        String normalizedEmail = normalizeEmail(user.getEmail());

        if (userRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
            throw new BadRequestException("Email already in use by another user");
        }

        existingUser.setName(normalizedName);
        existingUser.setEmail(normalizedEmail);
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        User existingUser = getUserById(id);
        userRepository.delete(existingUser);
    }

    private void validateUserPayload(User user) {
        if (user == null) {
            throw new BadRequestException("Request body is required");
        }
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new BadRequestException("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (!EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            throw new BadRequestException("Invalid email format");
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
