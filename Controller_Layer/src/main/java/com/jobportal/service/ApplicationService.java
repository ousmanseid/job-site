package com.jobportal.service;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

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

    @Transactional
    public void applyForJob(Long jobId, String email, String coverLetter, Long cvId) {
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new RuntimeException("You have already applied for this job");
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
    }

    public List<Application> findByApplicantEmail(String email) {
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByApplicant(applicant);
    }

    public List<Application> findByJobId(Long jobId, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User user = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleName.ROLE_ADMIN);

        if (!isAdmin) {
            if (job.getCompany() == null || !job.getCompany().getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Access denied");
            }
        }

        return applicationRepository.findByJob(job);
    }

    public List<Application> findByCompanyId(Long companyId) {
        return applicationRepository.findByCompanyId(companyId, PageRequest.of(0, 1000)).getContent();
    }

    @Transactional
    public void updateApplicationStatus(Long id, Application.ApplicationStatus status, String notes) {
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
    }

    public void withdrawApplication(Long id, String email) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!application.getApplicant().getId().equals(applicant.getId())) {
            throw new RuntimeException("Not authorized to withdraw this application");
        }

        applicationRepository.delete(application);
    }

    public CV getApplicationCV(Long id, String userEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleName.ROLE_ADMIN);

        if (!isAdmin) {
            if (application.getJob().getCompany() == null ||
                    !application.getJob().getCompany().getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Access denied");
            }
        }

        return application.getCv();
    }
}
