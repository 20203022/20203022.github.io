package com.personal.website.service;

import com.personal.website.dto.ArticleDto;
import com.personal.website.model.Article;
import com.personal.website.model.User;
import com.personal.website.repository.ArticleRepository;
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
public class ArticleService {

    private final ArticleRepository articleRepo;
    private final UserRepository userRepo;
    private final LikeRepository likeRepo;
    private final CommentRepository commentRepo;

    @Transactional
    public ArticleDto.DetailResponse create(ArticleDto.CreateRequest req, Long userId) {
        User author = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Article article = Article.builder()
                .title(req.getTitle())
                .summary(req.getSummary())
                .content(req.getContent())
                .coverImage(req.getCoverImage())
                .tags(req.getTags())
                .pinned(req.isPinned())
                .status("DRAFT".equals(req.getStatus()) ? Article.PublishStatus.DRAFT : Article.PublishStatus.PUBLISHED)
                .author(author)
                .build();
        article = articleRepo.save(article);
        return toDetail(article, userId);
    }

    @Transactional
    public ArticleDto.DetailResponse update(Long id, ArticleDto.UpdateRequest req, Long userId) {
        Article article = articleRepo.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
        if (!article.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        if (req.getTitle() != null) article.setTitle(req.getTitle());
        if (req.getSummary() != null) article.setSummary(req.getSummary());
        if (req.getContent() != null) article.setContent(req.getContent());
        if (req.getCoverImage() != null) article.setCoverImage(req.getCoverImage());
        if (req.getTags() != null) article.setTags(req.getTags());
        if (req.getPinned() != null) article.setPinned(req.getPinned());
        if (req.getStatus() != null) {
            article.setStatus("DRAFT".equals(req.getStatus()) ? Article.PublishStatus.DRAFT : Article.PublishStatus.PUBLISHED);
        }
        article = articleRepo.save(article);
        return toDetail(article, userId);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Article article = articleRepo.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
        if (!article.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        articleRepo.delete(article);
    }

    @Transactional
    public ArticleDto.DetailResponse getById(Long id, Long currentUserId) {
        Article article = articleRepo.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
        article.setViewCount(article.getViewCount() + 1);
        articleRepo.save(article);
        return toDetail(article, currentUserId);
    }

    public Page<ArticleDto.ListResponse> getPublishedList(int page, int size, String tag) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Article> articles;
        if (tag != null && !tag.isEmpty()) {
            articles = articleRepo.findByStatusAndTagsContainingOrderByCreatedAtDesc(Article.PublishStatus.PUBLISHED, tag, pr);
        } else {
            articles = articleRepo.findByStatusOrderByCreatedAtDesc(Article.PublishStatus.PUBLISHED, pr);
        }
        return articles.map(a -> toList(a));
    }

    public Page<ArticleDto.ListResponse> search(String keyword, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return articleRepo.searchPublished(keyword, pr).map(a -> toList(a));
    }

    public Page<ArticleDto.ListResponse> getByAuthor(Long authorId, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return articleRepo.findByAuthorIdOrderByCreatedAtDesc(authorId, pr).map(a -> toList(a));
    }

    public Page<ArticleDto.ListResponse> getAll(int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return articleRepo.findAll(pr).map(a -> toList(a));
    }

    private ArticleDto.ListResponse toList(Article a) {
        ArticleDto.ListResponse r = new ArticleDto.ListResponse();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setSummary(a.getSummary());
        r.setCoverImage(a.getCoverImage());
        r.setTags(a.getTags());
        r.setPinned(a.isPinned());
        r.setViewCount(a.getViewCount());
        r.setStatus(a.getStatus().name());
        r.setAuthor(new ArticleDto.AuthorInfo(a.getAuthor().getId(), a.getAuthor().getUsername(), a.getAuthor().getAvatar()));
        r.setLikeCount(likeRepo.countByTargetTypeAndTargetId(com.personal.website.model.Like.TargetType.ARTICLE, a.getId()));
        r.setCommentCount(commentRepo.countByTargetTypeAndTargetId(com.personal.website.model.Comment.TargetType.ARTICLE, a.getId()));
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }

    private ArticleDto.DetailResponse toDetail(Article a, Long currentUserId) {
        ArticleDto.DetailResponse r = new ArticleDto.DetailResponse();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setSummary(a.getSummary());
        r.setContent(a.getContent());
        r.setCoverImage(a.getCoverImage());
        r.setTags(a.getTags());
        r.setPinned(a.isPinned());
        r.setViewCount(a.getViewCount());
        r.setStatus(a.getStatus().name());
        r.setAuthor(new ArticleDto.AuthorInfo(a.getAuthor().getId(), a.getAuthor().getUsername(), a.getAuthor().getAvatar()));
        r.setLikeCount(likeRepo.countByTargetTypeAndTargetId(com.personal.website.model.Like.TargetType.ARTICLE, a.getId()));
        r.setCommentCount(commentRepo.countByTargetTypeAndTargetId(com.personal.website.model.Comment.TargetType.ARTICLE, a.getId()));
        if (currentUserId != null) {
            r.setLikedByCurrentUser(likeRepo.existsByUserIdAndTargetTypeAndTargetId(currentUserId, com.personal.website.model.Like.TargetType.ARTICLE, a.getId()));
        }
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }
}
