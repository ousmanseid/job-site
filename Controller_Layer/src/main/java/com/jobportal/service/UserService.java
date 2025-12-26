package com.jobportal.service;

import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User userDetails, String currentUserEmail) {
        User user = findById(id);

        if (!user.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Access denied: You can only update your own profile");
        }

        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            user.setEmail(userDetails.getEmail());
        }

        if (userDetails.getFirstName() != null)
            user.setFirstName(userDetails.getFirstName());
        if (userDetails.getLastName() != null)
            user.setLastName(userDetails.getLastName());
        if (userDetails.getPhone() != null)
            user.setPhone(userDetails.getPhone());
        if (userDetails.getAddress() != null)
            user.setAddress(userDetails.getAddress());
        if (userDetails.getCity() != null)
            user.setCity(userDetails.getCity());
        if (userDetails.getState() != null)
            user.setState(userDetails.getState());
        if (userDetails.getCountry() != null)
            user.setCountry(userDetails.getCountry());
        if (userDetails.getBio() != null)
            user.setBio(userDetails.getBio());

        return userRepository.save(user);
    }

    public User uploadProfilePicture(String email, MultipartFile file, String profileDir) throws Exception {
        User user = findByEmail(email);

        Path root = Paths.get(profileDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), root.resolve(filename));

        user.setProfilePicture("/api/uploads/profiles/" + filename);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
