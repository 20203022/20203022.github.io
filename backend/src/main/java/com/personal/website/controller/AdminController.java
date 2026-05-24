package com.personal.website.controller;

import com.personal.website.service.ArticleService;
import com.personal.website.service.CommentService;
import com.personal.website.service.ProjectService;
import com.personal.website.service.SiteConfigService;
import com.personal.website.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ArticleService articleService;
    private final ProjectService projectService;
    private final CommentService commentService;
    private final SiteConfigService siteConfigService;

    // User management
    @GetMapping("/users")
    public ResponseEntity<?> listUsers(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.list(page, size));
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<?> toggleUser(@PathVariable Long id) {
        userService.toggleEnabled(id);
        return ResponseEntity.ok(Map.of("message", "User status toggled"));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        userService.updateRole(id, body.get("role"));
        return ResponseEntity.ok(Map.of("message", "Role updated"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // Content management (all articles/projects including drafts)
    @GetMapping("/articles")
    public ResponseEntity<?> listArticles(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(articleService.getAll(page, size));
    }

    @GetMapping("/projects")
    public ResponseEntity<?> listProjects(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getAll(page, size));
    }

    // Comment management
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.adminDelete(id);
        return ResponseEntity.ok(Map.of("message", "Comment deleted"));
    }

    // Site config
    @PutMapping("/config")
    public ResponseEntity<?> updateConfig(@RequestBody Map<String, String> configs) {
        siteConfigService.update(configs);
        return ResponseEntity.ok(Map.of("message", "Config updated"));
    }
}
