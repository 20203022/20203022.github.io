package com.personal.website.repository;

import com.personal.website.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    Page<Article> findByStatusOrderByCreatedAtDesc(Article.PublishStatus status, Pageable pageable);

    Page<Article> findByStatusAndTagsContainingOrderByCreatedAtDesc(Article.PublishStatus status, String tag, Pageable pageable);

    Page<Article> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' AND (LOWER(a.title) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(a.summary) LIKE LOWER(CONCAT('%',:keyword,'%'))) ORDER BY a.createdAt DESC")
    Page<Article> searchPublished(String keyword, Pageable pageable);

    List<Article> findByPinnedTrueAndStatusOrderByCreatedAtDesc(Article.PublishStatus status);

    long countByStatus(Article.PublishStatus status);
}
