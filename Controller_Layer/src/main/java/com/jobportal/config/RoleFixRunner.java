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

import java.util.List;
import java.util.Set;

/**
 * This component runs on application startup to fix users who have no roles
 * assigned.
 * It will automatically assign ROLE_JOBSEEKER to any user without roles.
 */
@Component
public class RoleFixRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(RoleFixRunner.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("=== Checking for users without roles ===");

        List<User> allUsers = userRepository.findAll();
        Role jobSeekerRole = roleRepository.findByName(Role.RoleName.ROLE_JOBSEEKER)
                .orElseThrow(() -> new RuntimeException("ROLE_JOBSEEKER not found in database"));

        int fixedCount = 0;

        for (User user : allUsers) {
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                logger.warn("User {} ({}) has no roles assigned. Assigning ROLE_JOBSEEKER...",
                        user.getEmail(), user.getId());

                Set<Role> roles = user.getRoles();
                if (roles == null) {
                    roles = new java.util.HashSet<>();
                }
                roles.add(jobSeekerRole);
                user.setRoles(roles);
                userRepository.save(user);

                logger.info("✓ Successfully assigned ROLE_JOBSEEKER to user {}", user.getEmail());
                fixedCount++;
            }
        }

        if (fixedCount > 0) {
            logger.info("=== Fixed {} user(s) without roles ===", fixedCount);
        } else {
            logger.info("=== All users have roles assigned ===");
        }
    }
}
