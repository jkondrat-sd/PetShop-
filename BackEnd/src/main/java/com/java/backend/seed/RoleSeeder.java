package com.java.backend.seed;

import com.java.backend.entity.RoleEntity;
import com.java.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(1) // Must run before AdminSeeder
public class RoleSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        // Create ROLE_ADMIN if it doesn't exist
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            RoleEntity adminRole = new RoleEntity();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
            System.out.println("ROLE_ADMIN created");
        }
        
        // Create ROLE_USER if it doesn't exist
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            RoleEntity userRole = new RoleEntity();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
            System.out.println("ROLE_USER created");
        }
    }
}