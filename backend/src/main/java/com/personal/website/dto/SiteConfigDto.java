package com.personal.website.dto;

import lombok.Data;
import java.util.Map;

public class SiteConfigDto {

    @Data
    public static class UpdateRequest {
        private Map<String, String> configs;
    }

    @Data
    public static class Response {
        private Map<String, String> configs;
    }
}
