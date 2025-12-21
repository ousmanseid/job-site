package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "jobs")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private WorkMode workMode;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String experienceLevel;

    @Column(length = 100)
    private String educationLevel;

    @Column(columnDefinition = "TEXT")
    private String skillsRequired;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    @Column(length = 50)
    private String salaryCurrency;

    @Column(length = 50)
    private String salaryPeriod;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSalaryNegotiable = false;

    @Column(nullable = false)
    private Integer openings;

    private LocalDate applicationDeadline;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer applicationCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    private LocalDateTime featuredUntil;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<Application> applications;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime publishedAt;

    private LocalDateTime closedAt;

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        TEMPORARY,
        INTERNSHIP,
        FREELANCE
    }

    public enum WorkMode {
        ONSITE,
        REMOTE,
        HYBRID
    }

    public enum JobStatus {
        DRAFT,
        PENDING_APPROVAL,
        OPEN,
        CLOSED,
        FILLED,
        CANCELLED
    }
}
