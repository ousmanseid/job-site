package com.jobportal.service;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getPendingEmployers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles() != null && user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_EMPLOYER))
                .filter(user -> user.getIsVerified() == null || !user.getIsVerified())
                .collect(Collectors.toList());
    }

    public void approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        userRepository.save(user);
    }

    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    public List<Job> getPendingJobs() {
        return jobRepository.findByStatus(Job.JobStatus.PENDING_APPROVAL);
    }

    public void approveJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.OPEN);
        job.setPublishedAt(LocalDateTime.now());
        jobRepository.save(job);
    }

    public void rejectJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.CANCELLED);
        jobRepository.save(job);
    }

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.countByStatus(Job.JobStatus.OPEN));
        stats.put("closedJobs", jobRepository.countByStatus(Job.JobStatus.CLOSED));
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalApplicants", userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_JOBSEEKER))
                .count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pendingUsers", (long) getPendingEmployers().size());
        stats.put("pendingJobs", jobRepository.countByStatus(Job.JobStatus.PENDING_APPROVAL));
        return stats;
    }

    public List<Application> getRecentApplications() {
        return applicationRepository.findAll(
                PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .getContent();
    }

    public List<CVTemplate> getAllTemplates() {
        return cvTemplateRepository.findAll();
    }

    public CVTemplate saveTemplate(CVTemplate template) {
        return cvTemplateRepository.save(template);
    }

    public CVTemplate updateTemplate(Long id, CVTemplate templateData) {
        CVTemplate template = cvTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        template.setName(templateData.getName());
        template.setStatus(templateData.getStatus());
        template.setColor(templateData.getColor());
        template.setLayouts(templateData.getLayouts());
        template.setDescription(templateData.getDescription());
        return cvTemplateRepository.save(template);
    }

    public void deleteTemplate(Long id) {
        cvTemplateRepository.deleteById(id);
    }

    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    @Transactional
    public void updateSettings(List<SystemSetting> settings) {
        for (SystemSetting setting : settings) {
            SystemSetting existing = systemSettingRepository.findByKey(setting.getKey())
                    .orElse(setting);
            existing.setValue(setting.getValue());
            systemSettingRepository.save(existing);
        }
    }

    @Transactional
    public String initializeAdmin(String email, String password, String firstName, String lastName) {
        // Check if admin role exists, if not create it
        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(Role.RoleName.ROLE_ADMIN)
                            .description("Administrator role")
                            .build();
                    return roleRepository.save(newRole);
                });

        // Check if user already exists
        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (existingUser != null) {
            // Update existing user to admin
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            existingUser.setRoles(roles);
            existingUser.setIsActive(true);
            existingUser.setIsVerified(true);
            existingUser.setIsEmailVerified(true);

            // Update password if provided
            if (password != null && !password.isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(password));
            }

            userRepository.save(existingUser);
            return "User updated to admin successfully!";
        } else {
            // Create new admin user
            User adminUser = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName != null ? firstName : "Admin")
                    .lastName(lastName != null ? lastName : "User")
                    .isActive(true)
                    .isVerified(true)
                    .isEmailVerified(true)
                    .build();

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
            return "Admin user created successfully!";
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public void assignRoleToUser(String email, String roleNameStr) {
        User user = findByEmail(email);

        Role.RoleName roleName;
        try {
            roleName = Role.RoleName.valueOf(roleNameStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleNameStr);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = user.getRoles();
        roles.add(role);
        user.setRoles(roles);
        userRepository.save(user);
    }
}
