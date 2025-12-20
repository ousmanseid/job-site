package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "cvs")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CV {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    @Column(columnDefinition = "TEXT")
    private String education;
    
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    @Column(columnDefinition = "TEXT")
    private String certifications;
    
    @Column(columnDefinition = "TEXT")
    private String languages;
    
    @Column(columnDefinition = "TEXT")
    private String projects;
    
    @Column(columnDefinition = "TEXT")
    private String awards;
    
    @Column(columnDefinition = "TEXT")
    private String references;
    
    @Column(length = 50)
    private String templateName;
    
    @Column(length = 255)
    private String filePath;
    
    @Column(length = 255)
    private String fileName;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPublic = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer downloadCount = 0;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
