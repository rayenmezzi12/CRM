package com.entreprise.crm.dto;

public class AuthResponse {

    private String accessToken;
    private String username;
    private String role;
    private boolean mustChangePassword;

    public AuthResponse(String accessToken, String username, String role, boolean mustChangePassword) {
        this.accessToken = accessToken;
        this.username = username;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    public void setMustChangePassword(boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }
}
