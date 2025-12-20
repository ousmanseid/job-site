package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    Page<Application> findByApplicantId(Long applicantId, Pageable pageable);
    
    Page<Application> findByJobId(Long jobId, Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId")
    Page<Application> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE a.applicant.id = :applicantId AND a.status = :status")
    Page<Application> findByApplicantIdAndStatus(@Param("applicantId") Long applicantId,
                                                 @Param("status") Application.ApplicationStatus status,
                                                 Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE a.job.id = :jobId AND a.status = :status")
    Page<Application> findByJobIdAndStatus(@Param("jobId") Long jobId,
                                           @Param("status") Application.ApplicationStatus status,
                                           Pageable pageable);
    
    Optional<Application> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    
    Boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.applicant.id = :applicantId")
    Long countByApplicantId(@Param("applicantId") Long applicantId);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.id = :jobId")
    Long countByJobId(@Param("jobId") Long jobId);
    
    @Query("SELECT a.status, COUNT(a) FROM Application a WHERE a.applicant.id = :applicantId GROUP BY a.status")
    List<Object[]> getApplicationStatsByApplicantId(@Param("applicantId") Long applicantId);
    
    @Query("SELECT a FROM Application a WHERE a.isShortlisted = true AND a.job.company.id = :companyId")
    Page<Application> findShortlistedByCompany(@Param("companyId") Long companyId, Pageable pageable);
}
