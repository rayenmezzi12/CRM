package com.entreprise.crm.config;

import com.entreprise.crm.entity.Role;
import com.entreprise.crm.entity.User;
import com.entreprise.crm.repository.RoleRepository;
import com.entreprise.crm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("superadmin@domain.com")) {
            Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            User superAdmin = new User();
            superAdmin.setUsername("superadmin");
            superAdmin.setEmail("superadmin@domain.com");
            superAdmin.setPassword(passwordEncoder.encode("superadmin123"));
            superAdmin.setRole(superAdminRole);
            superAdmin.setEnabled(true);
            superAdmin.setMustChangePassword(true);

            userRepository.save(superAdmin);
            System.out.println("Super Admin created: superadmin@domain.com / superadmin123");
        }
    }
}
