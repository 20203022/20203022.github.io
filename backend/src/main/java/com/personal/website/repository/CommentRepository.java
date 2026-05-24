package com.personal.website.repository;

import com.personal.website.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByTargetTypeAndTargetIdAndParentIsNullOrderByCreatedAtDesc(
            Comment.TargetType targetType, Long targetId, Pageable pageable);

    long countByTargetTypeAndTargetId(Comment.TargetType targetType, Long targetId);
}
