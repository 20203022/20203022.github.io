package com.personal.website.controller;

import com.personal.website.security.UserPrincipal;
import com.personal.website.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(@RequestBody Map<String, Object> body,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        String targetType = (String) body.get("targetType");
        Long targetId = ((Number) body.get("targetId")).longValue();
        return ResponseEntity.ok(likeService.toggle(targetType, targetId, principal.getUserId()));
    }
}
