package com.jobportal.repository;

import com.jobportal.model.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByUserId(Long userId);
    
    Boolean existsByUserId(Long userId);
    
    @Query("SELECT c FROM Company c WHERE c.isVerified = :isVerified")
    Page<Company> findByIsVerified(@Param("isVerified") Boolean isVerified, Pageable pageable);
    
    @Query("SELECT c FROM Company c WHERE c.verificationStatus = :status")
    Page<Company> findByVerificationStatus(@Param("status") Company.VerificationStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Company c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.industry) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Company> searchCompanies(@Param("keyword") String keyword, Pageable pageable);
}
