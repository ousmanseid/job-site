package com.jobportal.controller;

import com.jobportal.dto.*;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private com.jobportal.repository.CompanyRepository companyRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = "ROLE_JOBSEEKER";
        if (!user.getRoles().isEmpty()) {
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
            boolean isEmployer = user.getRoles().stream()
                    .anyMatch(r -> r.getName().name().equals("ROLE_EMPLOYER"));

            if (isAdmin) {
                role = "ROLE_ADMIN";
            } else if (isEmployer) {
                role = "ROLE_EMPLOYER";
            } else {
                role = user.getRoles().iterator().next().getName().name();
            }
        }

        JwtAuthResponse response = JwtAuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(role)
                .isVerified(user.getIsVerified())
                .phone(user.getPhone())
                .city(user.getCity())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .phone(signUpRequest.getPhone())
                .city(signUpRequest.getLocation())
                .address(signUpRequest.getLocation())
                .isActive(true)
                .isVerified(false) // Default to false, require admin approval for employers? Should check.
                .isEmailVerified(false)
                .build();

        Set<Role> roles = new HashSet<>();
        String strRole = signUpRequest.getRole();

        Role.RoleName roleName;
        if ("EMPLOYER".equals(strRole)) {
            roleName = Role.RoleName.ROLE_EMPLOYER;
            // Employers usually need verification
            user.setIsVerified(false);
        } else {
            roleName = Role.RoleName.ROLE_JOBSEEKER;
            // Job seekers verified by default? Or email verification?
            user.setIsVerified(true);
        }

        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role not found."));
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        if ("EMPLOYER".equals(strRole)) {
            String companyName = signUpRequest.getCompanyName();
            if (companyName == null || companyName.trim().isEmpty()) {
                companyName = signUpRequest.getFirstName() + "'s Company";
            }
            com.jobportal.model.Company company = com.jobportal.model.Company.builder()
                    .name(companyName)
                    .description(signUpRequest.getCompanyDetails())
                    .user(savedUser)
                    .city(signUpRequest.getLocation())
                    .isVerified(false)
                    .verificationStatus(com.jobportal.model.Company.VerificationStatus.PENDING)
                    .build();
            companyRepository.save(company);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
