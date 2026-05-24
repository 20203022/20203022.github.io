package com.personal.website.controller;

import com.personal.website.service.SiteConfigService;
import com.personal.website.service.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/site")
@RequiredArgsConstructor
public class SiteController {

    private final SiteConfigService siteConfigService;
    private final VisitorService visitorService;

    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        return ResponseEntity.ok(siteConfigService.getAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(visitorService.getStats());
    }

    @PostMapping("/visit")
    public ResponseEntity<?> recordVisit(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        visitorService.recordVisit(ip);
        return ResponseEntity.ok().build();
    }
}
