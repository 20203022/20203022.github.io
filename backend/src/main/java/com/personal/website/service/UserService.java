package com.personal.website.service;

import com.personal.website.model.User;
import com.personal.website.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public Page<User> list(int page, int size) {
        return userRepo.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public void toggleEnabled(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepo.save(user);
    }

    @Transactional
    public void updateRole(Long userId, String role) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepo.save(user);
    }

    @Transactional
    public void delete(Long userId) {
        userRepo.deleteById(userId);
    }

    public User getById(Long userId) {
        return userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
