package com.personal.website.controller;

import com.personal.website.dto.ArticleDto;
import com.personal.website.security.UserPrincipal;
import com.personal.website.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<?> getPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(articleService.getPublishedList(page, size, tag));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(articleService.search(keyword, page, size));
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMine(@AuthenticationPrincipal UserPrincipal principal,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(articleService.getByAuthor(principal.getUserId(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getUserId() : null;
        return ResponseEntity.ok(articleService.getById(id, userId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ArticleDto.CreateRequest req,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(articleService.create(req, principal.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @Valid @RequestBody ArticleDto.UpdateRequest req,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        try {
            return ResponseEntity.ok(articleService.update(id, req, principal.getUserId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        try {
            articleService.delete(id, principal.getUserId());
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
