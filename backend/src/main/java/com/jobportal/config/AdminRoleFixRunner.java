package com.jobportal.config;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class AdminRoleFixRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminRoleFixRunner.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("=== Checking for Admin users with incorrect roles ===");

        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(Role.RoleName.ROLE_ADMIN)
                            .description("Administrator role")
                            .build();
                    return roleRepository.save(newRole);
                });

        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            boolean shouldBeAdmin = false;

            // Criteria 1: Email contains "admin" (case insensitive)
            if (user.getEmail() != null && user.getEmail().toLowerCase().contains("admin")) {
                shouldBeAdmin = true;
            }

            // Criteria 2: Name is "System Admin"
            if ("System".equalsIgnoreCase(user.getFirstName()) && "Admin".equalsIgnoreCase(user.getLastName())) {
                shouldBeAdmin = true;
            }

            if (shouldBeAdmin) {
                boolean hasAdminRole = user.getRoles() != null && user.getRoles().stream()
                        .anyMatch(r -> r.getName() == Role.RoleName.ROLE_ADMIN);

                if (!hasAdminRole) {
                    logger.info("User {} ({}) matches Admin criteria but lacks ROLE_ADMIN. Fixing...", user.getEmail(),
                            user.getId());

                    Set<Role> roles = user.getRoles();
                    if (roles == null)
                        roles = new HashSet<>();

                    // Clear existing roles and set Admin
                    roles.clear();
                    roles.add(adminRole);

                    user.setRoles(roles);
                    // Also ensure verified and active
                    user.setIsVerified(true);
                    user.setIsActive(true);
                    user.setIsEmailVerified(true);

                    userRepository.save(user);
                    logger.info("✓ Fixed Admin User: {}", user.getEmail());
                } else {
                    logger.info("User {} is already an Admin.", user.getEmail());
                }
            }
        }
    }
}
