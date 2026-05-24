package com.personal.website.service;

import com.personal.website.model.Like;
import com.personal.website.model.User;
import com.personal.website.repository.LikeRepository;
import com.personal.website.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepo;
    private final UserRepository userRepo;

    @Transactional
    public Map<String, Object> toggle(String targetType, Long targetId, Long userId) {
        Like.TargetType tt = Like.TargetType.valueOf(targetType.toUpperCase());
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        var existing = likeRepo.findByUserIdAndTargetTypeAndTargetId(userId, tt, targetId);
        if (existing.isPresent()) {
            likeRepo.delete(existing.get());
        } else {
            Like like = Like.builder()
                    .user(user)
                    .targetType(tt)
                    .targetId(targetId)
                    .build();
            likeRepo.save(like);
        }

        long count = likeRepo.countByTargetTypeAndTargetId(tt, targetId);
        boolean liked = likeRepo.existsByUserIdAndTargetTypeAndTargetId(userId, tt, targetId);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", liked);
        result.put("likeCount", count);
        return result;
    }
}
