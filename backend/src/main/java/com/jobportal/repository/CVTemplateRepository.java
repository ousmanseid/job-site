package com.jobportal.repository;

import com.jobportal.model.CVTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CVTemplateRepository extends JpaRepository<CVTemplate, Long> {
}
