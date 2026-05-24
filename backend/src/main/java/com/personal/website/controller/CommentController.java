package com.personal.website.controller;

import com.personal.website.dto.CommentDto;
import com.personal.website.security.UserPrincipal;
import com.personal.website.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<?> getByTarget(
            @RequestParam String targetType,
            @RequestParam Long targetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getByTarget(targetType, targetId, page, size));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CommentDto.CreateRequest req,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(commentService.create(req, principal.getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        try {
            commentService.delete(id, principal.getUserId());
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
