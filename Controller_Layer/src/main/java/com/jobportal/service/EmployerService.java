package com.jobportal.service;

import com.jobportal.model.Application;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployerService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getEmployerStats(User user) {
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        long totalPosted = jobRepository.countByCompanyId(company.getId());
        long activeJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.OPEN);
        long closedJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.CLOSED);

        List<Job> jobs = jobRepository.findByCompanyId(company.getId(), PageRequest.of(0, 1000)).getContent();
        long totalApplicants = jobs.stream().mapToLong(Job::getApplicationCount).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosted", totalPosted);
        stats.put("activeJobs", activeJobs);
        stats.put("closedJobs", closedJobs);
        stats.put("totalApplicants", totalApplicants);

        return stats;
    }

    public List<Application> getRecentActivity(User user) {
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        Page<Application> recentApps = applicationRepository.findByCompanyId(
                company.getId(),
                PageRequest.of(0, 5, Sort.by("createdAt").descending()));

        return recentApps.getContent();
    }

    public List<Job> getEmployerJobs(User user) {
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        return jobRepository.findByCompanyId(company.getId(), PageRequest.of(0, 1000)).getContent();
    }

    public Job getJobById(Long id, User user) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return job;
    }

    public void deleteJob(Long id, User user) {
        Job job = getJobById(id, user);
        jobRepository.delete(job);
    }

    public Job createJob(Job job, User user) {
        if (!user.getIsVerified()) {
            throw new RuntimeException("Account not approved for posting jobs");
        }

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        job.setCompany(company);

        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Job title is required");
        }
        if (job.getDescription() == null || job.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Job description is required");
        }

        if (job.getStatus() == null)
            job.setStatus(Job.JobStatus.OPEN);
        if (job.getOpenings() == null)
            job.setOpenings(1);
        if (job.getIsActive() == null)
            job.setIsActive(true);
        if (job.getCreatedAt() == null)
            job.setCreatedAt(LocalDateTime.now());

        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job jobData, User user) {
        Job job = getJobById(id, user);

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

        return jobRepository.save(job);
    }

    public void updateJobStatus(Long id, Job.JobStatus status, User user) {
        Job job = getJobById(id, user);
        job.setStatus(status);
        if (status == Job.JobStatus.CLOSED) {
            job.setClosedAt(LocalDateTime.now());
        }
        jobRepository.save(job);
    }

    public Map<String, Object> getProfile(User user) {
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("companyName", company.getName());
        profile.put("description", company.getDescription());
        profile.put("email", user.getEmail());
        profile.put("location", company.getCity());
        profile.put("website", company.getWebsite());
        profile.put("industry", company.getIndustry());

        return profile;
    }

    public Company updateProfile(Map<String, String> profileData, User user) {
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

        return companyRepository.save(company);
    }
}
