package com.jobportal.service;

import com.jobportal.model.CV;
import com.jobportal.model.CVTemplate;
import com.jobportal.model.User;
import com.jobportal.repository.CVRepository;
import com.jobportal.repository.CVTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CVService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    public List<CVTemplate> getActiveTemplates() {
        return cvTemplateRepository.findAll().stream()
                .filter(t -> "Active".equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());
    }

    public List<CV> findByUserId(Long userId) {
        return cvRepository.findByUserId(userId);
    }

    public Optional<CV> findDefaultByUserId(Long userId) {
        return cvRepository.findByUserIdAndIsDefault(userId, true);
    }

    @Transactional
    public CV saveCV(CV cv, User user) {
        cv.setUser(user);

        if (cvRepository.countByUserId(user.getId()) == 0) {
            cv.setIsDefault(true);
        } else if (cv.getIsDefault() != null && cv.getIsDefault()) {
            cvRepository.findByUserIdAndIsDefault(user.getId(), true).ifPresent(oldDefault -> {
                oldDefault.setIsDefault(false);
                cvRepository.save(oldDefault);
            });
        }

        return cvRepository.save(cv);
    }

    @Transactional
    public CV updateCV(Long id, CV cvData, Long userId) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        if (!cv.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (cvData.getTitle() != null)
            cv.setTitle(cvData.getTitle());
        if (cvData.getSummary() != null)
            cv.setSummary(cvData.getSummary());
        if (cvData.getExperience() != null)
            cv.setExperience(cvData.getExperience());
        if (cvData.getEducation() != null)
            cv.setEducation(cvData.getEducation());
        if (cvData.getSkills() != null)
            cv.setSkills(cvData.getSkills());
        if (cvData.getTemplateName() != null)
            cv.setTemplateName(cvData.getTemplateName());

        if (cvData.getIsDefault() != null && cvData.getIsDefault() && !cv.getIsDefault()) {
            cvRepository.findByUserIdAndIsDefault(userId, true).ifPresent(oldDefault -> {
                oldDefault.setIsDefault(false);
                cvRepository.save(oldDefault);
            });
            cv.setIsDefault(true);
        }

        return cvRepository.save(cv);
    }

    public void deleteCV(Long id, Long userId) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        if (!cv.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        cvRepository.delete(cv);
    }

    @Transactional
    public CV uploadCV(MultipartFile file, String title, User user, String cvUploadDir) throws IOException {
        Path uploadPath = Paths.get(cvUploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        CV cv = CV.builder()
                .user(user)
                .title(title)
                .fileName(file.getOriginalFilename())
                .filePath("/api/cv/download/" + fileName)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isDefault(cvRepository.countByUserId(user.getId()) == 0)
                .isPublic(false)
                .viewCount(0)
                .downloadCount(0)
                .build();

        return cvRepository.save(cv);
    }

    public Resource loadCVAsResource(String fileName, String cvUploadDir) throws IOException {
        Path filePath = Paths.get(cvUploadDir).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found " + fileName);
        }
    }
}
