package com.java.backend.seed;

import com.java.backend.entity.RoleEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.repository.RoleRepository;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2) 
public class AdminSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Kiểm tra nếu chưa có user admin thì tạo mới
        if (userRepository.findByUsername("admin").isEmpty()) {
            RoleEntity adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found!"));
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setRole(adminRole);
            admin.setEnabled(true);
            userRepository.save(admin);
            // System.out.println("Admin user created: admin/admin123");
        }
    }
}