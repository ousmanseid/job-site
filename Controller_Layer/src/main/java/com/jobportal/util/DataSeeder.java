package com.jobportal.util;

import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.BlogRepository;
import com.jobportal.model.Blog;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private CompanyRepository companyRepository;

        @Autowired
        private JobRepository jobRepository;

        @Autowired
        private BlogRepository blogRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                seedRoles();
                seedUsers();
                seedCompanies();
                seedJobs();
                seedBlogs();
        }

        private void seedRoles() {
                if (roleRepository.count() == 0) {
                        roleRepository.save(Role.builder().name(Role.RoleName.ROLE_ADMIN).description("Administrator")
                                        .build());
                        roleRepository.save(Role.builder().name(Role.RoleName.ROLE_EMPLOYER).description("Employer")
                                        .build());
                        roleRepository.save(Role.builder().name(Role.RoleName.ROLE_JOBSEEKER).description("Job Seeker")
                                        .build());
                }
        }

        private void seedUsers() {
                // Admin
                if (!userRepository.existsByEmail("admin@jobportal.com")) {
                        User admin = User.builder()
                                        .email("admin@jobportal.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .firstName("Admin")
                                        .lastName("User")
                                        .isActive(true)
                                        .isVerified(true)
                                        .roles(new HashSet<>(Collections.singletonList(
                                                        roleRepository.findByName(Role.RoleName.ROLE_ADMIN).get())))
                                        .build();
                        userRepository.save(admin);
                } else {
                        // Force reset admin password
                        User admin = userRepository.findByEmail("admin@jobportal.com").get();
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        userRepository.save(admin);
                }

                // Employer 1
                if (!userRepository.existsByEmail("hr@techcorp.com")) {
                        User employer = User.builder()
                                        .email("hr@techcorp.com")
                                        .password(passwordEncoder.encode("password"))
                                        .firstName("John")
                                        .lastName("Doe")
                                        .isActive(true)
                                        .isVerified(true)
                                        .roles(new HashSet<>(Collections.singletonList(
                                                        roleRepository.findByName(Role.RoleName.ROLE_EMPLOYER).get())))
                                        .build();
                        userRepository.save(employer);
                }
        }

        private void seedCompanies() {
                if (companyRepository.count() == 0) {
                        User employer = userRepository.findByEmail("hr@techcorp.com").orElse(null);
                        if (employer != null) {
                                Company company = Company.builder()
                                                .name("TechCorp Solutions")
                                                .description("Leading provider of software solutions.")
                                                .industry("Information Technology")
                                                .city("San Francisco")
                                                .state("CA")
                                                .country("USA")
                                                .website("https://techcorp.com")
                                                .companySize("500-1000")
                                                .isVerified(true)
                                                .logo("https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=200&h=200&q=80")
                                                .user(employer)
                                                .build();
                                companyRepository.save(company);
                        }
                }
        }

        private void seedJobs() {
                if (jobRepository.count() == 0) {
                        Company company = companyRepository.findAll().stream().findFirst().orElse(null);
                        if (company != null) {
                                Job job = Job.builder()
                                                .title("Senior Frontend Developer")
                                                .description("Experienced Frontend Developer wanted.")
                                                .requirements("React, Redux, 5+ years")
                                                .company(company)
                                                .location("Remote")
                                                .jobType(Job.JobType.FULL_TIME)
                                                .workMode(Job.WorkMode.REMOTE)
                                                .salaryMin(new BigDecimal("120000"))
                                                .salaryMax(new BigDecimal("150000"))
                                                .category("Software Development")
                                                .isActive(true)
                                                .status(Job.JobStatus.OPEN)
                                                .createdAt(LocalDateTime.now())
                                                .openings(1)
                                                .build();
                                jobRepository.save(job);
                        }
                }
        }

        private void seedBlogs() {
                if (blogRepository.count() == 0) {
                        blogRepository.save(Blog.builder()
                                        .title("How to Ace Your Next Job Interview")
                                        .author("Career Expert")
                                        .category("Interview Tips")
                                        .summary("Learn the top strategies to impress your interviewers and land your dream job.")
                                        .content("<p>Interviews can be stressful, but with the right preparation, you can shine...</p>")
                                        .imageUrl("https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80")
                                        .build());

                        blogRepository.save(Blog.builder()
                                        .title("The Future of Remote Work in 2025")
                                        .author("Industry Analyst")
                                        .category("Industry Trends")
                                        .summary("Remote work is evolving. Discover what to expect in the coming years.")
                                        .content("<p>As we move into 2025, remote work continues to redefine the workplace...</p>")
                                        .imageUrl("https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=800&q=80")
                                        .build());

                        blogRepository.save(Blog.builder()
                                        .title("Crafting a Standout Resume")
                                        .author("HR Specialist")
                                        .category("Resume Tips")
                                        .summary("Tips and tricks to make your resume get noticed by recruiters.")
                                        .content("<p>Your resume is your first impression. Make it count with these tips...</p>")
                                        .imageUrl("https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80")
                                        .build());
                }
        }
}
