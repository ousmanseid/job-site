package com.jobportal.repository;

import com.jobportal.model.Job;
import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);

    Optional<SavedJob> findByUserAndJob(User user, Job job);

    long countByUser(User user);

    boolean existsByUserAndJob(User user, Job job);
}
