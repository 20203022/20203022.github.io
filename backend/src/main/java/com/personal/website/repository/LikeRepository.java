package com.personal.website.repository;

import com.personal.website.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndTargetTypeAndTargetId(Long userId, Like.TargetType targetType, Long targetId);

    long countByTargetTypeAndTargetId(Like.TargetType targetType, Long targetId);

    boolean existsByUserIdAndTargetTypeAndTargetId(Long userId, Like.TargetType targetType, Long targetId);
}
