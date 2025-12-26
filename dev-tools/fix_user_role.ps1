#!/usr/bin/env pwsh
# Script to fix user role assignment for h@gmail.com

$baseUrl = "http://localhost:8085/api"

Write-Host "=== Checking user details before fix ===" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/users/details?email=h@gmail.com" -Method Get
    Write-Host "User Details:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error getting user details: $_" -ForegroundColor Red
}

Write-Host "`n=== Assigning ROLE_JOBSEEKER to user ===" -ForegroundColor Yellow
try {
    $body = @{
        email = "h@gmail.com"
        roleName = "ROLE_JOBSEEKER"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/admin/users/assign-role" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Role Assignment Result:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error assigning role: $_" -ForegroundColor Red
}

Write-Host "`n=== Checking user details after fix ===" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/users/details?email=h@gmail.com" -Method Get
    Write-Host "User Details:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error getting user details: $_" -ForegroundColor Red
}

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "The user should now have the ROLE_JOBSEEKER role assigned."
Write-Host "Try logging in again with h@gmail.com"
