package com.personal.website.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "visitor_count")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VisitorCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visit_date", nullable = false, unique = true)
    private LocalDate visitDate;

    @Column(name = "page_views", nullable = false)
    private long pageViews;

    @Column(name = "unique_visitors", nullable = false)
    private long uniqueVisitors;
}
