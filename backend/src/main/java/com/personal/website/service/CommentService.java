package com.personal.website.service;

import com.personal.website.dto.CommentDto;
import com.personal.website.model.Comment;
import com.personal.website.model.User;
import com.personal.website.repository.CommentRepository;
import com.personal.website.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepo;
    private final UserRepository userRepo;

    @Transactional
    public CommentDto.Response create(CommentDto.CreateRequest req, Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Comment.TargetType targetType = Comment.TargetType.valueOf(req.getTargetType().toUpperCase());
        Comment comment = Comment.builder()
                .content(req.getContent())
                .user(user)
                .targetType(targetType)
                .targetId(req.getTargetId())
                .build();

        if (req.getParentId() != null) {
            comment.setParent(commentRepo.findById(req.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found")));
        }

        comment = commentRepo.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Comment comment = commentRepo.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        commentRepo.delete(comment);
    }

    @Transactional
    public void adminDelete(Long id) {
        commentRepo.deleteById(id);
    }

    public Page<CommentDto.Response> getByTarget(String targetType, Long targetId, int page, int size) {
        Comment.TargetType tt = Comment.TargetType.valueOf(targetType.toUpperCase());
        PageRequest pr = PageRequest.of(page, size);
        Page<Comment> comments = commentRepo.findByTargetTypeAndTargetIdAndParentIsNullOrderByCreatedAtDesc(tt, targetId, pr);
        return comments.map(c -> toResponseTree(c));
    }

    private CommentDto.Response toResponse(Comment c) {
        CommentDto.Response r = new CommentDto.Response();
        r.setId(c.getId());
        r.setContent(c.getContent());
        r.setUser(new CommentDto.UserInfo(c.getUser().getId(), c.getUser().getUsername(), c.getUser().getAvatar()));
        r.setTargetType(c.getTargetType().name());
        r.setTargetId(c.getTargetId());
        r.setParentId(c.getParent() != null ? c.getParent().getId() : null);
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }

    private CommentDto.Response toResponseTree(Comment c) {
        CommentDto.Response r = toResponse(c);
        // Lazy-load replies - for simplicity, replies are loaded separately
        r.setReplies(new ArrayList<>());
        return r;
    }
}
