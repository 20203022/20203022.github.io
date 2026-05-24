package com.personal.website.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@Getter
@AllArgsConstructor
public class UserPrincipal implements Principal {
    private Long userId;
    private String username;

    @Override
    public String getName() {
        return username;
    }
}
