package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.JobAlertRepository;
import com.jobportal.model.JobAlert;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/jobseeker")
@PreAuthorize("hasRole('JOBSEEKER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobSeekerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JobAlertRepository jobAlertRepository;

    @Autowired
    private com.jobportal.repository.CompanyRepository companyRepository;

    @Value("${app.profile.dir}")
    private String profileDir;

    @GetMapping("/stats")
    public ResponseEntity<?> getJobSeekerStats(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalApplied = applicationRepository.countByApplicantId(user.getId());
        long savedJobs = savedJobRepository.countByUser(user);
        long jobAlerts = notificationRepository.countUnreadByUserId(user.getId());
        long totalJobs = jobRepository.countByStatus(Job.JobStatus.OPEN);
        long totalCompanies = companyRepository.count();
        long remoteJobs = jobRepository.countByWorkModeAndStatus(Job.WorkMode.REMOTE, Job.JobStatus.OPEN);

        // Category counts
        java.util.List<Object[]> categoryCountsRaw = jobRepository.getJobCountsByCategory();
        Map<String, Long> categoryCounts = new HashMap<>();
        for (Object[] row : categoryCountsRaw) {
            String catName = (row[0] != null) ? (String) row[0] : "Other";
            categoryCounts.put(catName, (Long) row[1]);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplied", totalApplied);
        stats.put("savedJobs", savedJobs);
        stats.put("jobAlerts", jobAlerts);
        stats.put("totalJobs", totalJobs);
        stats.put("totalCompanies", totalCompanies);
        stats.put("remoteJobs", remoteJobs);
        stats.put("categoryCounts", categoryCounts);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<?> getSavedJobs(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(savedJobRepository.findByUser(user));
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (savedJobRepository.existsByUserAndJob(user, job)) {
            return ResponseEntity.badRequest().body("Job already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .user(user)
                .job(job)
                .createdAt(LocalDateTime.now())
                .build();

        savedJobRepository.save(savedJob);

        return ResponseEntity.ok("Job saved successfully");
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Optional<SavedJob> savedJob = savedJobRepository.findByUserAndJob(user, job);
        if (savedJob.isPresent()) {
            savedJobRepository.delete(savedJob.get());
            return ResponseEntity.ok("Job removed from saved list");
        } else {
            return ResponseEntity.badRequest().body("Job not found in saved list");
        }
    }

    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommendedJobs(Authentication authentication) {
        // Simple strategy: Return latest open jobs
        Page<Job> jobs = jobRepository.findActiveJobs(PageRequest.of(0, 5, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/profile/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileData.containsKey("firstName"))
            user.setFirstName(profileData.get("firstName"));
        if (profileData.containsKey("lastName"))
            user.setLastName(profileData.get("lastName"));
        if (profileData.containsKey("phone"))
            user.setPhone(profileData.get("phone"));
        if (profileData.containsKey("location")) {
            user.setCity(profileData.get("location"));
            user.setAddress(profileData.get("location")); // Keep both for now if UI only sends one
        }
        if (profileData.containsKey("bio"))
            user.setBio(profileData.get("bio"));
        if (profileData.containsKey("linkedinUrl"))
            user.setLinkedinUrl(profileData.get("linkedinUrl"));
        if (profileData.containsKey("githubUrl"))
            user.setGithubUrl(profileData.get("githubUrl"));
        if (profileData.containsKey("portfolioUrl"))
            user.setPortfolioUrl(profileData.get("portfolioUrl"));

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Path root = Paths.get(profileDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(filename));

            // In a real app, you'd serve this through a ResourceHandler
            // For now, we'll store the filename or a relative path
            user.setProfilePicture("/api/uploads/profiles/" + filename);
            userRepository.save(user);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getJobAlerts(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobAlert alert = jobAlertRepository.findByUserId(user.getId())
                .orElseGet(() -> JobAlert.builder().user(user).isEnabled(false).build());
        return ResponseEntity.ok(alert);
    }

    @PostMapping("/alerts")
    public ResponseEntity<?> updateJobAlerts(@RequestBody Map<String, Object> alertData,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobAlert alert = jobAlertRepository.findByUserId(user.getId())
                .orElse(JobAlert.builder().user(user).build());

        if (alertData.containsKey("keywords"))
            alert.setKeywords((String) alertData.get("keywords"));
        if (alertData.containsKey("location"))
            alert.setLocation((String) alertData.get("location"));
        if (alertData.containsKey("jobType"))
            alert.setJobType((String) alertData.get("jobType"));
        if (alertData.containsKey("isEnabled"))
            alert.setIsEnabled((Boolean) alertData.get("isEnabled"));
        if (alertData.containsKey("emailNotification"))
            alert.setEmailNotification((Boolean) alertData.get("emailNotification"));
        if (alertData.containsKey("pushNotification"))
            alert.setPushNotification((Boolean) alertData.get("pushNotification"));

        jobAlertRepository.save(alert);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/cv")
    public ResponseEntity<?> getCV(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> cvData = new HashMap<>();
        cvData.put("experience", user.getBio()); // Using Bio as experience for now
        cvData.put("skills", "Java, Spring Boot, React"); // Mock for now but stored in DB later
        return ResponseEntity.ok(cvData);
    }
}
