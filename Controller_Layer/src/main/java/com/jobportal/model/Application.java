package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id")
    private CV cv;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(columnDefinition = "TEXT")
    private String employerNotes;

    private Integer rating;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isShortlisted = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRejected = false;

    private LocalDateTime reviewedAt;

    private LocalDateTime interviewScheduledAt;

    @Column(columnDefinition = "TEXT")
    private String interviewNotes;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        SUBMITTED,
        REVIEWED,
        SHORTLISTED,
        INTERVIEW_SCHEDULED,
        INTERVIEWED,
        OFFERED,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }
}
