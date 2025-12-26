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
        private com.jobportal.repository.CVTemplateRepository cvTemplateRepository;

        @Autowired
        private com.jobportal.repository.SystemSettingRepository systemSettingRepository;

        @Autowired
        private com.jobportal.repository.CompanyRepository companyRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                // Initialize Roles
                if (roleRepository.count() == 0) {
                        roleRepository
                                        .save(Role.builder().name(Role.RoleName.ROLE_ADMIN)
                                                        .description("System Administrator").build());
                        roleRepository.save(Role.builder().name(Role.RoleName.ROLE_EMPLOYER)
                                        .description("Employer User").build());
                        roleRepository
                                        .save(Role.builder().name(Role.RoleName.ROLE_JOBSEEKER)
                                                        .description("Job Seeker User").build());
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

                        // Create Demo Company
                        companyRepository.save(com.jobportal.model.Company.builder()
                                        .user(employer)
                                        .name("TechCorp International")
                                        .industry("Technology")
                                        .companySize("1000-5000")
                                        .city("Nairobi")
                                        .country("Kenya")
                                        .isVerified(true)
                                        .verificationStatus(com.jobportal.model.Company.VerificationStatus.APPROVED)
                                        .build());
                        System.out.println("Demo company initialized for TechCorp.");
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

                // Initialize CV Templates
                if (cvTemplateRepository.count() == 0) {
                        cvTemplateRepository.save(com.jobportal.model.CVTemplate.builder()
                                        .name("Professional Modern")
                                        .status("Active")
                                        .color("#2c3e50")
                                        .layouts("2-Column")
                                        .description("Personal Info, Education, Skills, Work Exp, Certifications.")
                                        .build());
                        cvTemplateRepository.save(com.jobportal.model.CVTemplate.builder()
                                        .name("Clean Minimalist")
                                        .status("Active")
                                        .color("#1abc9c")
                                        .layouts("1-Column")
                                        .description("Personal Info, Summary, Experience, Education.")
                                        .build());
                        System.out.println("Default CV templates initialized.");
                }

                // Initialize System Settings
                if (systemSettingRepository.count() == 0) {
                        systemSettingRepository.save(com.jobportal.model.SystemSetting.builder().key("website_name")
                                        .value("Smart Job Portal").category("General").build());
                        systemSettingRepository.save(com.jobportal.model.SystemSetting.builder().key("support_email")
                                        .value("support@smartjobportal.com").category("General").build());
                        systemSettingRepository.save(com.jobportal.model.SystemSetting.builder().key("language")
                                        .value("English").category("General").build());
                        systemSettingRepository.save(com.jobportal.model.SystemSetting.builder().key("timezone")
                                        .value("(GMT+03:00) Nairobi").category("General").build());
                        System.out.println("Default system settings initialized.");
                }
        }
}
