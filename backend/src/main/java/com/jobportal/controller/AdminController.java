package com.jobportal.controller;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.model.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private com.jobportal.repository.CompanyRepository companyRepository;

    @Autowired
    private com.jobportal.repository.CVTemplateRepository cvTemplateRepository;

    @Autowired
    private com.jobportal.repository.SystemSettingRepository systemSettingRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/employers/pending")
    public ResponseEntity<List<User>> getPendingEmployers() {
        List<User> pendingEmployers = userRepository.findAll().stream()
                .filter(user -> user.getRoles() != null && user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_EMPLOYER))
                .filter(user -> user.getIsVerified() == null || !user.getIsVerified())
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingEmployers);
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully");
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
        return ResponseEntity.ok("User activated successfully");
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<?> getPendingJobs() {
        return ResponseEntity.ok(jobRepository.findByStatus(Job.JobStatus.PENDING_APPROVAL));
    }

    @PostMapping("/jobs/{id}/approve")
    public ResponseEntity<?> approveJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.OPEN);
        job.setPublishedAt(java.time.LocalDateTime.now());
        jobRepository.save(job);
        return ResponseEntity.ok("Job approved successfully");
    }

    @PostMapping("/jobs/{id}/reject")
    public ResponseEntity<?> rejectJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.CANCELLED);
        jobRepository.save(job);
        return ResponseEntity.ok("Job rejected successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @Autowired
    private com.jobportal.repository.ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(Job.JobStatus.OPEN);
        long closedJobs = jobRepository.countByStatus(Job.JobStatus.CLOSED);
        long totalCompanies = companyRepository.count();
        long totalApplicants = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_JOBSEEKER))
                .count();
        long totalApplications = applicationRepository.count();

        // Pending Users (Employers awaiting verification)
        long pendingUsers = userRepository.findAll().stream()
                .filter(user -> user.getRoles() != null && user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_EMPLOYER))
                .filter(user -> user.getIsVerified() == null || !user.getIsVerified())
                .count();

        // Pending Jobs (Awaiting approval)
        long pendingJobs = jobRepository.countByStatus(Job.JobStatus.PENDING_APPROVAL);

        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalJobs", totalJobs);
        stats.put("activeJobs", activeJobs);
        stats.put("closedJobs", closedJobs);
        stats.put("totalCompanies", totalCompanies);
        stats.put("totalApplicants", totalApplicants);
        stats.put("totalApplications", totalApplications);
        stats.put("pendingUsers", pendingUsers);
        stats.put("pendingJobs", pendingJobs);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-applications")
    public ResponseEntity<?> getRecentApplications() {
        return ResponseEntity.ok(applicationRepository.findAll(
                org.springframework.data.domain.PageRequest.of(0, 5,
                        org.springframework.data.domain.Sort.by("createdAt").descending()))
                .getContent());
    }

    // CV Templates
    @GetMapping("/cv-templates")
    public ResponseEntity<?> getAllTemplates() {
        return ResponseEntity.ok(cvTemplateRepository.findAll());
    }

    @PostMapping("/cv-templates")
    public ResponseEntity<?> createTemplate(@RequestBody com.jobportal.model.CVTemplate template) {
        return ResponseEntity.ok(cvTemplateRepository.save(template));
    }

    @PutMapping("/cv-templates/{id}")
    public ResponseEntity<?> updateTemplate(@PathVariable Long id,
            @RequestBody com.jobportal.model.CVTemplate templateData) {
        com.jobportal.model.CVTemplate template = cvTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        template.setName(templateData.getName());
        template.setStatus(templateData.getStatus());
        template.setColor(templateData.getColor());
        template.setLayouts(templateData.getLayouts());
        template.setDescription(templateData.getDescription());
        return ResponseEntity.ok(cvTemplateRepository.save(template));
    }

    @DeleteMapping("/cv-templates/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        cvTemplateRepository.deleteById(id);
        return ResponseEntity.ok("Template deleted");
    }

    // System Settings
    @GetMapping("/settings")
    public ResponseEntity<?> getAllSettings() {
        return ResponseEntity.ok(systemSettingRepository.findAll());
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody List<com.jobportal.model.SystemSetting> settings) {
        for (com.jobportal.model.SystemSetting setting : settings) {
            com.jobportal.model.SystemSetting existing = systemSettingRepository.findByKey(setting.getKey())
                    .orElse(setting);
            existing.setValue(setting.getValue());
            systemSettingRepository.save(existing);
        }
        return ResponseEntity.ok("Settings updated");
    }
}
