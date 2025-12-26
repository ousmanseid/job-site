package com.jobportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 4, max = 100)
    private String password;

    @com.fasterxml.jackson.annotation.JsonProperty("firstName")
    @NotBlank
    private String firstName;

    @com.fasterxml.jackson.annotation.JsonProperty("lastName")
    @NotBlank
    private String lastName;

    @com.fasterxml.jackson.annotation.JsonProperty("role")
    @NotBlank
    private String role; // JOBSEEKER or EMPLOYER

    private String companyName;
    private String companyDetails;

    private String phone;
    private String location;
}