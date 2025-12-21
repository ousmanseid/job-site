package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.CVRepository;
import com.jobportal.model.CV;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId,
            @RequestBody(required = false) Map<String, Object> request,
            Authentication authentication) {
        String coverLetter = request != null && request.containsKey("coverLetter") ? (String) request.get("coverLetter")
                : "";
        Long cvId = null;
        if (request != null && request.containsKey("cvId")) {
            Object cvIdObj = request.get("cvId");
            if (cvIdObj instanceof Number)
                cvId = ((Number) cvIdObj).longValue();
            else if (cvIdObj instanceof String)
                cvId = Long.parseLong((String) cvIdObj);
        }

        String email = authentication.getName();
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            return ResponseEntity.badRequest().body("You have already applied for this job");
        }

        CV cvToUse = null;
        if (cvId != null) {
            cvToUse = cvRepository.findById(cvId).orElse(null);
        }

        if (cvToUse == null) {
            cvToUse = cvRepository.findDefaultCVByUserId(applicant.getId()).orElse(null);
        }

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .cv(cvToUse)
                .coverLetter(coverLetter)
                .status(Application.ApplicationStatus.SUBMITTED)
                .createdAt(LocalDateTime.now())
                .build();

        applicationRepository.save(application);

        // Update application count in Job
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);

        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        String email = authentication.getName();
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationRepository.findByApplicant(applicant));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId,
            Authentication authentication) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify if the job belongs to the employer
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRoles().stream().anyMatch(r -> r.getName() == com.jobportal.model.Role.RoleName.ROLE_ADMIN)) {
            if (job.getCompany() == null || !job.getCompany().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(applicationRepository.findByJob(job));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Application>> getCompanyApplications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCompany() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                applicationRepository.findByCompanyId(user.getCompany().getId(), PageRequest.of(0, 1000)).getContent());
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id,
            @RequestParam Application.ApplicationStatus status, @RequestParam(required = false) String notes) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        if (notes != null)
            application.setEmployerNotes(notes);
        application.setReviewedAt(LocalDateTime.now());

        if (status == Application.ApplicationStatus.SHORTLISTED) {
            application.setIsShortlisted(true);
        } else if (status == Application.ApplicationStatus.REJECTED) {
            application.setIsRejected(true);
        }

        applicationRepository.save(application);

        // Send notification to applicant
        try {
            String companyName = application.getJob().getCompany() != null ? application.getJob().getCompany().getName()
                    : "Company";
            String title = "Application Update: " + application.getJob().getTitle();
            String message = String.format("Great news! Your application for '%s' at %s has been %s.",
                    application.getJob().getTitle(), companyName, status.toString().toLowerCase());

            if (status == Application.ApplicationStatus.REJECTED) {
                message = String.format("We regret to inform you that your application for '%s' at %s was declined.",
                        application.getJob().getTitle(), companyName);
            }

            Notification notification = Notification.builder()
                    .user(application.getApplicant())
                    .title(title)
                    .message(message)
                    .type(Notification.NotificationType.APPLICATION_STATUS)
                    .relatedUrl("/dashboard/jobseeker/applied")
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.err.println("Failed to send status notification: " + e.getMessage());
        }

        return ResponseEntity.ok("Application status updated to " + status);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id, Authentication authentication) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String email = authentication.getName();
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!application.getApplicant().getId().equals(applicant.getId())) {
            return ResponseEntity.status(403).body("Not authorized to withdraw this application");
        }

        applicationRepository.delete(application);
        return ResponseEntity.ok("Application withdrawn successfully");
    }

    @GetMapping("/{id}/cv")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> getApplicationCV(@PathVariable Long id, Authentication authentication) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify employer has access to this application
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRoles().stream().anyMatch(r -> r.getName() == com.jobportal.model.Role.RoleName.ROLE_ADMIN)) {
            if (application.getJob().getCompany() == null ||
                    !application.getJob().getCompany().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
        }

        if (application.getCv() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(application.getCv());
    }
}
