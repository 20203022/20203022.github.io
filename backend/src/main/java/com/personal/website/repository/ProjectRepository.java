package com.personal.website.repository;

import com.personal.website.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByStatusOrderByCreatedAtDesc(Project.PublishStatus status, Pageable pageable);

    Page<Project> findByStatusAndTagsContainingOrderByCreatedAtDesc(Project.PublishStatus status, String tag, Pageable pageable);

    Page<Project> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.status = 'PUBLISHED' AND (LOWER(p.title) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(p.summary) LIKE LOWER(CONCAT('%',:keyword,'%'))) ORDER BY p.createdAt DESC")
    Page<Project> searchPublished(String keyword, Pageable pageable);

    long countByStatus(Project.PublishStatus status);
}
