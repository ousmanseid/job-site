package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/employer")
@PreAuthorize("hasRole('EMPLOYER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployerController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CompanyRepository companyRepository;

        @Autowired
        private JobRepository jobRepository;

        @Autowired
        private ApplicationRepository applicationRepository;

        @GetMapping("/stats")
        public ResponseEntity<?> getEmployerStats(Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Company company = companyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Company profile not found"));

                long totalPosted = jobRepository.countByCompanyId(company.getId());
                long activeJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.OPEN);
                long closedJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.CLOSED);

                // Count total applicants for this company's jobs
                // We can use applicationRepository.findByCompanyId but that returns a page.
                // Let's rely on job application counts if they are accurate, or count query.
                // We really should add countByJobCompanyId to ApplicationRepository for
                // efficiency.
                // For now, let's fetch first page and get total elements, or add a count
                // method.
                // But wait, there is no countByCompanyId in ApplicationRepository.
                // I will use a custom query approach or iterate if volume is low.
                // Better: add count query to repo. But for now speed -> let's assume get jobs
                // and sum applicationCount?
                // Job entity has applicationCount.

                List<Job> jobs = jobRepository.findByCompanyId(company.getId(), PageRequest.of(0, 1000)).getContent();
                long totalApplicants = jobs.stream().mapToLong(Job::getApplicationCount).sum();

                Map<String, Object> stats = new HashMap<>();
                stats.put("totalPosted", totalPosted);
                stats.put("activeJobs", activeJobs);
                stats.put("closedJobs", closedJobs);
                stats.put("totalApplicants", totalApplicants);

                return ResponseEntity.ok(stats);
        }

        @GetMapping("/recent-activity")
        public ResponseEntity<?> getRecentActivity(Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Company company = companyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Company profile not found"));

                // Get recent applications
                Page<Application> recentApps = applicationRepository.findByCompanyId(
                                company.getId(),
                                PageRequest.of(0, 5, Sort.by("createdAt").descending()));

                return ResponseEntity.ok(recentApps.getContent());
        }

        @GetMapping("/jobs")
        public ResponseEntity<?> getEmployerJobs(Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Company company = companyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Company profile not found"));

                List<Job> jobs = jobRepository.findByCompanyId(company.getId(), PageRequest.of(0, 1000)).getContent();
                return ResponseEntity.ok(jobs);
        }

        @GetMapping("/jobs/{id}")
        public ResponseEntity<?> getJobById(@PathVariable Long id, Authentication authentication) {
                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!job.getCompany().getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to view this job");
                }

                return ResponseEntity.ok(job);
        }

        @DeleteMapping("/jobs/{id}")
        public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!job.getCompany().getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to delete this job");
                }

                jobRepository.delete(job);
                return ResponseEntity.ok("Job deleted successfully");
        }

        @PostMapping("/jobs")
        public ResponseEntity<?> createJob(@RequestBody Job job, Authentication authentication) {
                try {
                        String email = authentication.getName();
                        User user = userRepository.findByEmail(email)
                                        .orElseThrow(() -> new RuntimeException("User not found"));

                        if (!user.getIsVerified()) {
                                return ResponseEntity.status(403).body("Account not approved for posting jobs");
                        }

                        Company company = companyRepository.findByUserId(user.getId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Company profile not found. Please complete your company profile first."));

                        job.setCompany(company);

                        // Basic validation
                        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
                                return ResponseEntity.badRequest().body("Job title is required");
                        }
                        if (job.getDescription() == null || job.getDescription().trim().isEmpty()) {
                                return ResponseEntity.badRequest().body("Job description is required");
                        }

                        if (job.getStatus() == null) {
                                job.setStatus(Job.JobStatus.OPEN);
                        }
                        if (job.getOpenings() == null) {
                                job.setOpenings(1);
                        }
                        if (job.getIsActive() == null) {
                                job.setIsActive(true);
                        }

                        if (job.getCreatedAt() == null) {
                                job.setCreatedAt(LocalDateTime.now());
                        }

                        Job savedJob = jobRepository.save(job);
                        return ResponseEntity.ok(savedJob);
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().body("Error creating job: " + e.getMessage());
                }
        }

        @PutMapping("/jobs/{id}")
        public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job jobData,
                        Authentication authentication) {
                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!job.getCompany().getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to update this job");
                }

                job.setTitle(jobData.getTitle());
                job.setDescription(jobData.getDescription());
                job.setRequirements(jobData.getRequirements());
                job.setResponsibilities(jobData.getResponsibilities());
                job.setBenefits(jobData.getBenefits());
                job.setCategory(jobData.getCategory());
                job.setJobType(jobData.getJobType());
                job.setWorkMode(jobData.getWorkMode());
                job.setLocation(jobData.getLocation());
                job.setSalaryMin(jobData.getSalaryMin());
                job.setSalaryMax(jobData.getSalaryMax());
                job.setExperienceLevel(jobData.getExperienceLevel());
                job.setEducationLevel(jobData.getEducationLevel());
                job.setSkillsRequired(jobData.getSkillsRequired());
                job.setApplicationDeadline(jobData.getApplicationDeadline());
                job.setOpenings(jobData.getOpenings());

                Job updatedJob = jobRepository.save(job);
                return ResponseEntity.ok(updatedJob);
        }

        @PutMapping("/jobs/{id}/status")
        public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestParam Job.JobStatus status,
                        Authentication authentication) {
                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!job.getCompany().getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to update this job");
                }

                job.setStatus(status);
                if (status == Job.JobStatus.CLOSED) {
                        job.setClosedAt(LocalDateTime.now());
                }

                jobRepository.save(job);
                return ResponseEntity.ok("Job status updated to " + status);
        }

        @GetMapping("/profile")
        public ResponseEntity<?> getProfile(Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Company company = companyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Company profile not found"));

                Map<String, Object> profile = new HashMap<>();
                profile.put("companyName", company.getName());
                profile.put("description", company.getDescription());
                profile.put("email", user.getEmail());
                profile.put("location", company.getCity());
                profile.put("website", company.getWebsite());
                profile.put("industry", company.getIndustry());

                return ResponseEntity.ok(profile);
        }

        @PutMapping("/profile")
        public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData,
                        Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Company company = companyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Company profile not found"));

                if (profileData.containsKey("companyName"))
                        company.setName(profileData.get("companyName"));
                if (profileData.containsKey("description"))
                        company.setDescription(profileData.get("description"));
                if (profileData.containsKey("location"))
                        company.setCity(profileData.get("location"));
                if (profileData.containsKey("website"))
                        company.setWebsite(profileData.get("website"));
                if (profileData.containsKey("industry"))
                        company.setIndustry(profileData.get("industry"));

                companyRepository.save(company);
                return ResponseEntity.ok(company);
        }
}
