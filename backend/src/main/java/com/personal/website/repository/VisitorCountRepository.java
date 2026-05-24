package com.personal.website.repository;

import com.personal.website.model.VisitorCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.Optional;

public interface VisitorCountRepository extends JpaRepository<VisitorCount, Long> {

    Optional<VisitorCount> findByVisitDate(LocalDate date);

    @Query("SELECT COALESCE(SUM(v.pageViews), 0) FROM VisitorCount v")
    long getTotalPageViews();

    @Query("SELECT COALESCE(SUM(v.uniqueVisitors), 0) FROM VisitorCount v")
    long getTotalUniqueVisitors();
}
