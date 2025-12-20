package com.jobportal.repository;

import com.jobportal.model.CV;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CVRepository extends JpaRepository<CV, Long> {
    
    List<CV> findByUserId(Long userId);
    
    Page<CV> findByUserId(Long userId, Pageable pageable);
    
    Optional<CV> findByUserIdAndIsDefault(Long userId, Boolean isDefault);
    
    @Query("SELECT c FROM CV c WHERE c.user.id = :userId AND c.isDefault = true")
    Optional<CV> findDefaultCVByUserId(@Param("userId") Long userId);
    
    @Query("SELECT c FROM CV c WHERE c.isPublic = true")
    Page<CV> findPublicCVs(Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM CV c WHERE c.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
