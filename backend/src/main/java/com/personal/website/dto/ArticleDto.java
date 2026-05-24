package com.personal.website.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

public class ArticleDto {

    @Data
    public static class CreateRequest {
        @NotBlank @Size(max = 200)
        private String title;

        @NotBlank @Size(max = 500)
        private String summary;

        @NotBlank
        private String content;

        private String coverImage;
        private String tags;
        private boolean pinned;
        private String status;
    }

    @Data
    public static class UpdateRequest {
        @Size(max = 200)
        private String title;

        @Size(max = 500)
        private String summary;

        private String content;
        private String coverImage;
        private String tags;
        private Boolean pinned;
        private String status;
    }

    @Data
    public static class ListResponse {
        private Long id;
        private String title;
        private String summary;
        private String coverImage;
        private String tags;
        private boolean pinned;
        private long viewCount;
        private String status;
        private AuthorInfo author;
        private long likeCount;
        private long commentCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class DetailResponse {
        private Long id;
        private String title;
        private String summary;
        private String content;
        private String coverImage;
        private String tags;
        private boolean pinned;
        private long viewCount;
        private String status;
        private AuthorInfo author;
        private long likeCount;
        private long commentCount;
        private boolean likedByCurrentUser;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String avatar;

        public AuthorInfo(Long id, String username, String avatar) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
        }
    }
}
