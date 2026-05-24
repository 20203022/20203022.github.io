package com.personal.website.service;

import com.personal.website.dto.ProjectDto;
import com.personal.website.model.Project;
import com.personal.website.model.User;
import com.personal.website.repository.ProjectRepository;
import com.personal.website.repository.LikeRepository;
import com.personal.website.repository.CommentRepository;
import com.personal.website.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final LikeRepository likeRepo;
    private final CommentRepository commentRepo;

    @Transactional
    public ProjectDto.DetailResponse create(ProjectDto.CreateRequest req, Long userId) {
        User author = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Project project = Project.builder()
                .title(req.getTitle())
                .summary(req.getSummary())
                .content(req.getContent())
                .coverImage(req.getCoverImage())
                .tags(req.getTags())
                .demoUrl(req.getDemoUrl())
                .githubUrl(req.getGithubUrl())
                .status("DRAFT".equals(req.getStatus()) ? Project.PublishStatus.DRAFT : Project.PublishStatus.PUBLISHED)
                .author(author)
                .build();
        project = projectRepo.save(project);
        return toDetail(project, userId);
    }

    @Transactional
    public ProjectDto.DetailResponse update(Long id, ProjectDto.UpdateRequest req, Long userId) {
        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        if (req.getTitle() != null) project.setTitle(req.getTitle());
        if (req.getSummary() != null) project.setSummary(req.getSummary());
        if (req.getContent() != null) project.setContent(req.getContent());
        if (req.getCoverImage() != null) project.setCoverImage(req.getCoverImage());
        if (req.getTags() != null) project.setTags(req.getTags());
        if (req.getDemoUrl() != null) project.setDemoUrl(req.getDemoUrl());
        if (req.getGithubUrl() != null) project.setGithubUrl(req.getGithubUrl());
        if (req.getStatus() != null) {
            project.setStatus("DRAFT".equals(req.getStatus()) ? Project.PublishStatus.DRAFT : Project.PublishStatus.PUBLISHED);
        }
        project = projectRepo.save(project);
        return toDetail(project, userId);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        projectRepo.delete(project);
    }

    public ProjectDto.DetailResponse getById(Long id, Long currentUserId) {
        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        return toDetail(project, currentUserId);
    }

    public Page<ProjectDto.ListResponse> getPublishedList(int page, int size, String tag) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Project> projects;
        if (tag != null && !tag.isEmpty()) {
            projects = projectRepo.findByStatusAndTagsContainingOrderByCreatedAtDesc(Project.PublishStatus.PUBLISHED, tag, pr);
        } else {
            projects = projectRepo.findByStatusOrderByCreatedAtDesc(Project.PublishStatus.PUBLISHED, pr);
        }
        return projects.map(p -> toList(p));
    }

    public Page<ProjectDto.ListResponse> search(String keyword, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return projectRepo.searchPublished(keyword, pr).map(p -> toList(p));
    }

    public Page<ProjectDto.ListResponse> getByAuthor(Long authorId, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return projectRepo.findByAuthorIdOrderByCreatedAtDesc(authorId, pr).map(p -> toList(p));
    }

    public Page<ProjectDto.ListResponse> getAll(int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return projectRepo.findAll(pr).map(p -> toList(p));
    }

    private ProjectDto.ListResponse toList(Project p) {
        ProjectDto.ListResponse r = new ProjectDto.ListResponse();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setSummary(p.getSummary());
        r.setCoverImage(p.getCoverImage());
        r.setTags(p.getTags());
        r.setDemoUrl(p.getDemoUrl());
        r.setGithubUrl(p.getGithubUrl());
        r.setStatus(p.getStatus().name());
        r.setAuthor(new com.personal.website.dto.ArticleDto.AuthorInfo(p.getAuthor().getId(), p.getAuthor().getUsername(), p.getAuthor().getAvatar()));
        r.setLikeCount(likeRepo.countByTargetTypeAndTargetId(com.personal.website.model.Like.TargetType.PROJECT, p.getId()));
        r.setCommentCount(commentRepo.countByTargetTypeAndTargetId(com.personal.website.model.Comment.TargetType.PROJECT, p.getId()));
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }

    private ProjectDto.DetailResponse toDetail(Project p, Long currentUserId) {
        ProjectDto.DetailResponse r = new ProjectDto.DetailResponse();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setSummary(p.getSummary());
        r.setContent(p.getContent());
        r.setCoverImage(p.getCoverImage());
        r.setTags(p.getTags());
        r.setDemoUrl(p.getDemoUrl());
        r.setGithubUrl(p.getGithubUrl());
        r.setStatus(p.getStatus().name());
        r.setAuthor(new com.personal.website.dto.ArticleDto.AuthorInfo(p.getAuthor().getId(), p.getAuthor().getUsername(), p.getAuthor().getAvatar()));
        r.setLikeCount(likeRepo.countByTargetTypeAndTargetId(com.personal.website.model.Like.TargetType.PROJECT, p.getId()));
        r.setCommentCount(commentRepo.countByTargetTypeAndTargetId(com.personal.website.model.Comment.TargetType.PROJECT, p.getId()));
        if (currentUserId != null) {
            r.setLikedByCurrentUser(likeRepo.existsByUserIdAndTargetTypeAndTargetId(currentUserId, com.personal.website.model.Like.TargetType.PROJECT, p.getId()));
        }
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }
}
