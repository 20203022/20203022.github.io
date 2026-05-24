package com.personal.website.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class CommentDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        @Size(max = 2000)
        private String content;

        @NotBlank
        private String targetType;

        @NotBlank
        private Long targetId;

        private Long parentId;
    }

    @Data
    public static class Response {
        private Long id;
        private String content;
        private UserInfo user;
        private String targetType;
        private Long targetId;
        private Long parentId;
        private List<Response> replies;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String avatar;

        public UserInfo(Long id, String username, String avatar) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
        }
    }
}
