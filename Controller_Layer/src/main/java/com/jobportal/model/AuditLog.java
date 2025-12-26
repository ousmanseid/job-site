package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 100)
    private String username;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(length = 100)
    private String entityType;
    
    private Long entityId;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    @Column(length = 50)
    private String ipAddress;
    
    @Column(length = 255)
    private String userAgent;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
