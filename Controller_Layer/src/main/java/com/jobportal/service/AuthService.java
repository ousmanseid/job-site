package com.jobportal.service;

import com.jobportal.dto.JwtAuthResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.Company;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

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
    private CompanyRepository companyRepository;

    public JwtAuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleStr = "ROLE_JOBSEEKER";
        if (!user.getRoles().isEmpty()) {
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
            boolean isEmployer = user.getRoles().stream()
                    .anyMatch(r -> r.getName().name().equals("ROLE_EMPLOYER"));

            if (isAdmin) {
                roleStr = "ROLE_ADMIN";
            } else if (isEmployer) {
                roleStr = "ROLE_EMPLOYER";
            } else {
                roleStr = user.getRoles().iterator().next().getName().name();
            }
        }

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(roleStr)
                .isVerified(user.getIsVerified())
                .phone(user.getPhone())
                .city(user.getCity())
                .build();
    }

    @Transactional
    public void registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
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
                .isVerified(false)
                .isEmailVerified(false)
                .build();

        Set<Role> roles = new HashSet<>();
        String strRole = signUpRequest.getRole();

        Role.RoleName roleName;
        if ("EMPLOYER".equals(strRole)) {
            roleName = Role.RoleName.ROLE_EMPLOYER;
            user.setIsVerified(false);
        } else {
            roleName = Role.RoleName.ROLE_JOBSEEKER;
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
            Company company = Company.builder()
                    .name(companyName)
                    .description(signUpRequest.getCompanyDetails())
                    .user(savedUser)
                    .city(signUpRequest.getLocation())
                    .isVerified(false)
                    .verificationStatus(Company.VerificationStatus.PENDING)
                    .build();
            companyRepository.save(company);
        }
    }
}
