package com.jobportal.repository;

import com.jobportal.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    Page<Job> findByCompanyId(Long companyId, Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.isActive = :isActive AND j.status = :status")
    Page<Job> findByIsActiveAndStatus(@Param("isActive") Boolean isActive, 
                                      @Param("status") Job.JobStatus status, 
                                      Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.isActive = true AND j.status = 'OPEN'")
    Page<Job> findActiveJobs(Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.isFeatured = true AND j.isActive = true AND j.status = 'OPEN'")
    List<Job> findFeaturedJobs();
    
    @Query("SELECT j FROM Job j WHERE j.isActive = true AND j.status = 'OPEN' AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchJobs(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.isActive = true AND j.status = 'OPEN' AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
           "LOWER(j.city) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode) AND " +
           "(:category IS NULL OR LOWER(j.category) = LOWER(:category))")
    Page<Job> advancedSearch(@Param("location") String location,
                            @Param("jobType") Job.JobType jobType,
                            @Param("workMode") Job.WorkMode workMode,
                            @Param("category") String category,
                            Pageable pageable);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.company.id = :companyId")
    Long countByCompanyId(@Param("companyId") Long companyId);
    
    @Query("SELECT j.category, COUNT(j) FROM Job j WHERE j.isActive = true GROUP BY j.category")
    List<Object[]> getJobCountsByCategory();
}
