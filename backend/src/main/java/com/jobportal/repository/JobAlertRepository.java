package com.jobportal.repository;

import com.jobportal.model.JobAlert;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobAlertRepository extends JpaRepository<JobAlert, Long> {
    Optional<JobAlert> findByUser(User user);

    Optional<JobAlert> findByUserId(Long userId);
}
