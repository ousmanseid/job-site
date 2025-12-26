package com.jobportal.controller;

import com.jobportal.model.CV;
import com.jobportal.model.CVTemplate;
import com.jobportal.model.User;
import com.jobportal.service.CVService;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/cv")
@PreAuthorize("hasRole('JOBSEEKER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CVController {

    @Autowired
    private CVService cvService;

    @Autowired
    private UserService userService;

    @Value("${app.cv.dir}")
    private String cvUploadDir;

    @GetMapping("/templates")
    public ResponseEntity<List<CVTemplate>> getActiveTemplates() {
        return ResponseEntity.ok(cvService.getActiveTemplates());
    }

    @GetMapping
    public ResponseEntity<List<CV>> getMyCVs(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(cvService.findByUserId(user.getId()));
    }

    @GetMapping("/default")
    public ResponseEntity<CV> getDefaultCV(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return cvService.findDefaultByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> saveCV(@RequestBody CV cv, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        CV savedCV = cvService.saveCV(cv, user);
        return ResponseEntity.ok(savedCV);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCV(@PathVariable Long id, @RequestBody CV cvData, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(cvService.updateCV(id, cvData, user.getId()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            cvService.deleteCV(id, user.getId());
            return ResponseEntity.ok("CV deleted successfully");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCV(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", defaultValue = "Uploaded CV") String title,
            Authentication authentication) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            User user = userService.findByEmail(authentication.getName());
            CV savedCV = cvService.uploadCV(file, title, user, cvUploadDir);
            return ResponseEntity.ok(savedCV);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName:.+}")
    @PreAuthorize("hasAnyRole('JOBSEEKER', 'EMPLOYER', 'ADMIN')")
    public ResponseEntity<Resource> downloadCV(@PathVariable String fileName) {
        try {
            Resource resource = cvService.loadCVAsResource(fileName, cvUploadDir);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
