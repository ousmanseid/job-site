package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "companies")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 100)
    private String industry;
    
    @Column(length = 50)
    private String companySize;
    
    @Column(length = 255)
    private String website;
    
    @Column(length = 255)
    private String logo;
    
    @Column(length = 255)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 100)
    private String state;
    
    @Column(length = 20)
    private String zipCode;
    
    @Column(length = 100)
    private String country;
    
    @Column(length = 15)
    private String contactPhone;
    
    @Column(length = 100)
    private String contactEmail;
    
    @Column(columnDefinition = "TEXT")
    private String verificationDocuments;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;
    
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String verificationNotes;
    
    private LocalDateTime verifiedAt;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Job> jobs;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED,
        RESUBMIT_REQUIRED
    }
}
