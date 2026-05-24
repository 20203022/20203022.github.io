package com.personal.website.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(length = 300)
    private String tags;

    @Column(name = "is_pinned", nullable = false)
    private boolean pinned;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PublishStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = PublishStatus.PUBLISHED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PublishStatus {
        PUBLISHED, DRAFT
    }
}
