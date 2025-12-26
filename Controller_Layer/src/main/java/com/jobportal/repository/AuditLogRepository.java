package com.jobportal.repository;

import com.jobportal.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByUsername(String username, Pageable pageable);
    
    Page<AuditLog> findByAction(String action, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.entityType = :entityType AND a.entityId = :entityId")
    Page<AuditLog> findByEntity(@Param("entityType") String entityType, 
                                @Param("entityId") Long entityId, 
                                Pageable pageable);
}
