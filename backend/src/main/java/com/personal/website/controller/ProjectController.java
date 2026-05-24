package com.personal.website.controller;

import com.personal.website.dto.ProjectDto;
import com.personal.website.security.UserPrincipal;
import com.personal.website.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<?> getPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(projectService.getPublishedList(page, size, tag));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.search(keyword, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getUserId() : null;
        return ResponseEntity.ok(projectService.getById(id, userId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProjectDto.CreateRequest req,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(projectService.create(req, principal.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @Valid @RequestBody ProjectDto.UpdateRequest req,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        try {
            return ResponseEntity.ok(projectService.update(id, req, principal.getUserId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        try {
            projectService.delete(id, principal.getUserId());
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
