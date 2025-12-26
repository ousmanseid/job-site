package com.jobportal.controller;

import com.jobportal.dto.ContactRequest;
import com.jobportal.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> handleContactRequest(@RequestBody ContactRequest request) {
        try {
            String adminEmail = "ousmanseid847@gmail.com";
            String subject = "New Contact Request - Smart Job Portal";
            String body = "You have received a new contact/information request from:\n\n" +
                    "Email: " + request.getEmail() + "\n\n" +
                    "This request was submitted via the 'Contact Us' section on the Home Page.";

            emailService.sendEmail(adminEmail, subject, body);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Request submitted successfully. We will contact you soon.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to send request. However, it has been logged.");
            // Returning 200 even on error to not discourage user, but log the error
            return ResponseEntity.ok(response);
        }
    }
}
