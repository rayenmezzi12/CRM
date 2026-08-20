package com.entreprise.crm.service;

import com.entreprise.crm.dto.CreateUserDTO;
import com.entreprise.crm.dto.UserDTO;
import com.entreprise.crm.entity.AuditLog;
import com.entreprise.crm.entity.Role;
import com.entreprise.crm.entity.User;
import com.entreprise.crm.repository.AuditLogRepository;
import com.entreprise.crm.repository.RoleRepository;
import com.entreprise.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional
    public UserDTO createUser(CreateUserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true);
        user.setMustChangePassword(true);

        Role role = roleRepository.findByName(dto.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + dto.getRole()));
        user.setRole(role);

        User saved = userRepository.save(user);

        logAction("USER_CREATE", "Created user: " + saved.getUsername() + " with role " + role.getName());
        return mapToDTO(saved);
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.setRole(role);
        User updated = userRepository.save(user);

        logAction("USER_ROLE_UPDATE", "Updated user " + user.getUsername() + " role to " + roleName);
        return mapToDTO(updated);
    }

    @Transactional
    public UserDTO toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.getEnabled());
        User updated = userRepository.save(user);

        logAction("USER_TOGGLE_STATUS", "User " + user.getUsername() + " enabled set to " + user.getEnabled());
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
        logAction("USER_DELETE", "Deleted user ID: " + userId + " (username: " + user.getUsername() + ")");
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : "ROLE_EMPLOYEE",
                user.getEnabled(),
                user.getMustChangePassword()
        );
    }

    private void logAction(String action, String details) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "superadmin";
        auditLogRepository.save(new AuditLog(currentUsername, action, details));
    }
}
