package com.jobportal.service;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class JobSeekerService {

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
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getJobSeekerStats(User user) {
        long totalApplied = applicationRepository.countByApplicantId(user.getId());
        long savedJobs = savedJobRepository.countByUser(user);
        long jobAlerts = notificationRepository.countUnreadByUserId(user.getId());
        long totalJobs = jobRepository.countByStatus(Job.JobStatus.OPEN);
        long totalCompanies = companyRepository.count();
        long remoteJobs = jobRepository.countByWorkModeAndStatus(Job.WorkMode.REMOTE, Job.JobStatus.OPEN);

        List<Object[]> categoryCountsRaw = jobRepository.getJobCountsByCategory();
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

        return stats;
    }

    public List<SavedJob> getSavedJobs(User user) {
        return savedJobRepository.findByUser(user);
    }

    public void saveJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (savedJobRepository.existsByUserAndJob(user, job)) {
            throw new RuntimeException("Job already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .user(user)
                .job(job)
                .createdAt(LocalDateTime.now())
                .build();

        savedJobRepository.save(savedJob);
    }

    public void unsaveJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Optional<SavedJob> savedJob = savedJobRepository.findByUserAndJob(user, job);
        if (savedJob.isPresent()) {
            savedJobRepository.delete(savedJob.get());
        } else {
            throw new RuntimeException("Job not found in saved list");
        }
    }

    public List<Job> getRecommendedJobs() {
        Page<Job> jobs = jobRepository.findActiveJobs(PageRequest.of(0, 5, Sort.by("createdAt").descending()));
        return jobs.getContent();
    }

    public User updateProfile(Map<String, String> profileData, User user) {
        if (profileData.containsKey("firstName"))
            user.setFirstName(profileData.get("firstName"));
        if (profileData.containsKey("lastName"))
            user.setLastName(profileData.get("lastName"));
        if (profileData.containsKey("phone"))
            user.setPhone(profileData.get("phone"));
        if (profileData.containsKey("location")) {
            user.setCity(profileData.get("location"));
            user.setAddress(profileData.get("location"));
        }
        if (profileData.containsKey("bio"))
            user.setBio(profileData.get("bio"));
        if (profileData.containsKey("linkedinUrl"))
            user.setLinkedinUrl(profileData.get("linkedinUrl"));
        if (profileData.containsKey("githubUrl"))
            user.setGithubUrl(profileData.get("githubUrl"));
        if (profileData.containsKey("portfolioUrl"))
            user.setPortfolioUrl(profileData.get("portfolioUrl"));

        return userRepository.save(user);
    }

    @Transactional
    public String uploadProfilePicture(MultipartFile file, User user, String profileDir) throws IOException {
        Path root = Paths.get(profileDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), root.resolve(filename));

        String url = "/api/uploads/profiles/" + filename;
        user.setProfilePicture(url);
        userRepository.save(user);
        return url;
    }

    public JobAlert getJobAlerts(User user) {
        return jobAlertRepository.findByUserId(user.getId())
                .orElseGet(() -> JobAlert.builder().user(user).isEnabled(false).build());
    }

    public JobAlert updateJobAlerts(Map<String, Object> alertData, User user) {
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

        return jobAlertRepository.save(alert);
    }

    public Map<String, Object> getCVData(User user) {
        Map<String, Object> cvData = new HashMap<>();
        cvData.put("experience", user.getBio());
        cvData.put("skills", "Java, Spring Boot, React");
        return cvData;
    }
}
