package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    @Column(length = 255)
    private String relatedUrl;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;
    
    private LocalDateTime readAt;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum NotificationType {
        JOB_APPLICATION,
        APPLICATION_STATUS,
        NEW_JOB_MATCH,
        INTERVIEW_SCHEDULED,
        MESSAGE,
        SYSTEM_ALERT,
        COMPANY_VERIFIED,
        PROFILE_VIEW
    }
}
