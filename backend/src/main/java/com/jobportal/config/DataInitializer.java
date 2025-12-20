package com.jobportal.config;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        if (roleRepository.count() == 0) {
            roleRepository
                    .save(Role.builder().name(Role.RoleName.ROLE_ADMIN).description("System Administrator").build());
            roleRepository.save(Role.builder().name(Role.RoleName.ROLE_EMPLOYER).description("Employer User").build());
            roleRepository
                    .save(Role.builder().name(Role.RoleName.ROLE_JOBSEEKER).description("Job Seeker User").build());
            System.out.println("Default roles initialized.");
        }

        // Initialize Admin User
        if (userRepository.findByEmail("admin@sjp.com").isEmpty()) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User admin = User.builder()
                    .email("admin@sjp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("System")
                    .lastName("Admin")
                    .isActive(true)
                    .isVerified(true)
                    .isEmailVerified(true)
                    .roles(roles)
                    .build();

            userRepository.save(admin);
            System.out.println("Default admin user initialized (admin@sjp.com / admin123).");
        }

        // Initialize Employer Demo User
        if (userRepository.findByEmail("hr@techcorp.com").isEmpty()) {
            Role employerRole = roleRepository.findByName(Role.RoleName.ROLE_EMPLOYER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(employerRole);

            User employer = User.builder()
                    .email("hr@techcorp.com")
                    .password(passwordEncoder.encode("employer123"))
                    .firstName("TechCorp")
                    .lastName("HR")
                    .isActive(true)
                    .isVerified(true)
                    .isEmailVerified(true)
                    .roles(roles)
                    .build();

            userRepository.save(employer);
            System.out.println("Demo employer user initialized (hr@techcorp.com / employer123).");
        }

        // Initialize Job Seeker Demo User
        if (userRepository.findByEmail("john@example.com").isEmpty()) {
            Role seekerRole = roleRepository.findByName(Role.RoleName.ROLE_JOBSEEKER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(seekerRole);

            User seeker = User.builder()
                    .email("john@example.com")
                    .password(passwordEncoder.encode("seeker123"))
                    .firstName("John")
                    .lastName("Doe")
                    .isActive(true)
                    .isVerified(true)
                    .isEmailVerified(true)
                    .roles(roles)
                    .build();

            userRepository.save(seeker);
            System.out.println("Demo job seeker user initialized (john@example.com / seeker123).");
        }
    }
}
