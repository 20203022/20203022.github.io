package com.personal.website.service;

import com.personal.website.model.VisitorCount;
import com.personal.website.repository.VisitorCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorCountRepository visitorRepo;

    @Transactional
    public void recordVisit(String ip) {
        LocalDate today = LocalDate.now();
        VisitorCount vc = visitorRepo.findByVisitDate(today)
                .orElse(VisitorCount.builder()
                        .visitDate(today)
                        .pageViews(0)
                        .uniqueVisitors(0)
                        .build());

        // Simple: increment page views every time, unique logic would need IP tracking
        vc.setPageViews(vc.getPageViews() + 1);
        // For now, unique visitors is simplified; full implementation would track IPs
        if (vc.getPageViews() == 1) {
            vc.setUniqueVisitors(1);
        }
        visitorRepo.save(vc);
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPageViews", visitorRepo.getTotalPageViews());
        stats.put("totalUniqueVisitors", visitorRepo.getTotalUniqueVisitors());
        return stats;
    }
}
