package com.example.usermanagement.dto;

public class AuthResponse {

    private String token;
    private AuthUser user;

    public AuthResponse(String token, AuthUser user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public AuthUser getUser() {
        return user;
    }

    public static class AuthUser {
        private String email;
        private String role;
        private String name;

        public AuthUser(String email, String role, String name) {
            this.email = email;
            this.role = role;
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public String getName() {
            return name;
        }
    }
}
