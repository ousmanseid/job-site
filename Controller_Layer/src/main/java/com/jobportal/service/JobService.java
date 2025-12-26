package com.jobportal.service;

import com.jobportal.model.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Page<Job> findAllActiveJobs(Pageable pageable) {
        return jobRepository.findActiveJobs(pageable);
    }

    public Job findById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setViewCount(job.getViewCount() + 1);
        return jobRepository.save(job);
    }

    public Page<Job> searchJobs(String keyword, Pageable pageable) {
        return jobRepository.searchJobs(keyword, pageable);
    }

    public Page<Job> findByCompanyId(Long companyId, Pageable pageable) {
        return jobRepository.findByCompanyId(companyId, pageable);
    }

    public Page<Job> advancedSearch(String keyword, String location, Job.JobType jobType,
            Job.WorkMode workMode, String category, Pageable pageable) {
        return jobRepository.advancedSearch(keyword, location, jobType, workMode, category, pageable);
    }

    public Job createJob(Job job) {
        job.setStatus(Job.JobStatus.PENDING_APPROVAL);
        return jobRepository.save(job);
    }

    public List<Job> findByStatus(Job.JobStatus status) {
        return jobRepository.findByStatus(status);
    }

    public Job updateJobStatus(Long id, Job.JobStatus status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(status);
        if (status == Job.JobStatus.OPEN) {
            job.setPublishedAt(java.time.LocalDateTime.now());
            job.setIsActive(true);
        }
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setLocation(jobDetails.getLocation());
        job.setJobType(jobDetails.getJobType());
        job.setSalaryMin(jobDetails.getSalaryMin());
        job.setSalaryMax(jobDetails.getSalaryMax());

        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
    }
}
