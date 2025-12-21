package com.jobportal.controller;

import com.jobportal.model.CV;
import com.jobportal.model.User;
import com.jobportal.repository.CVRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.jobportal.model.CVTemplate;
import com.jobportal.repository.CVTemplateRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cv")
@PreAuthorize("hasRole('JOBSEEKER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CVController {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    @Value("${app.cv.dir}")
    private String cvUploadDir;

    @GetMapping("/templates")
    public ResponseEntity<List<CVTemplate>> getActiveTemplates() {
        return ResponseEntity.ok(cvTemplateRepository.findAll().stream()
                .filter(t -> "Active".equalsIgnoreCase(t.getStatus()))
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<CV>> getMyCVs(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cvRepository.findByUserId(user.getId()));
    }

    @GetMapping("/default")
    public ResponseEntity<CV> getDefaultCV(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cvRepository.findByUserIdAndIsDefault(user.getId(), true)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> saveCV(@RequestBody CV cv, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cv.setUser(user);

        // If this is the first CV, make it default
        if (cvRepository.countByUserId(user.getId()) == 0) {
            cv.setIsDefault(true);
        } else if (cv.getIsDefault() != null && cv.getIsDefault()) {
            // If making this default, unset other defaults
            cvRepository.findByUserIdAndIsDefault(user.getId(), true).ifPresent(oldDefault -> {
                oldDefault.setIsDefault(false);
                cvRepository.save(oldDefault);
            });
        }

        CV savedCV = cvRepository.save(cv);
        return ResponseEntity.ok(savedCV);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCV(@PathVariable Long id, @RequestBody CV cvData, Authentication authentication) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!cv.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Only update fields that are provided (not null)
        if (cvData.getTitle() != null) {
            cv.setTitle(cvData.getTitle());
        }
        if (cvData.getSummary() != null) {
            cv.setSummary(cvData.getSummary());
        }
        if (cvData.getExperience() != null) {
            cv.setExperience(cvData.getExperience());
        }
        if (cvData.getEducation() != null) {
            cv.setEducation(cvData.getEducation());
        }
        if (cvData.getSkills() != null) {
            cv.setSkills(cvData.getSkills());
        }
        if (cvData.getTemplateName() != null) {
            cv.setTemplateName(cvData.getTemplateName());
        }

        // Handle setting as default
        if (cvData.getIsDefault() != null && cvData.getIsDefault() && !cv.getIsDefault()) {
            cvRepository.findByUserIdAndIsDefault(user.getId(), true).ifPresent(oldDefault -> {
                oldDefault.setIsDefault(false);
                cvRepository.save(oldDefault);
            });
            cv.setIsDefault(true);
        }

        return ResponseEntity.ok(cvRepository.save(cv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id, Authentication authentication) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!cv.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        cvRepository.delete(cv);
        return ResponseEntity.ok("CV deleted successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCV(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", defaultValue = "Uploaded CV") String title,
            Authentication authentication) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create directory if not exists
            Path uploadPath = Paths.get(cvUploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
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

            CV savedCV = cvRepository.save(cv);

            // If this is the first CV, make sure it's set as default
            if (cvRepository.countByUserId(user.getId()) == 1) {
                savedCV.setIsDefault(true);
                savedCV = cvRepository.save(savedCV);
            }

            return ResponseEntity.ok(savedCV);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName:.+}")
    @PreAuthorize("hasAnyRole('JOBSEEKER', 'EMPLOYER', 'ADMIN')")
    public ResponseEntity<org.springframework.core.io.Resource> downloadCV(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(cvUploadDir).resolve(fileName).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
