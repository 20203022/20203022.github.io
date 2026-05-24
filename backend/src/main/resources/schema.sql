-- MySQL initialization script for personal website
-- Run this on your server before starting the Spring Boot app with prod profile

CREATE DATABASE IF NOT EXISTS personal_website
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE personal_website;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    bio VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    cover_image VARCHAR(500),
    tags VARCHAR(300),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    view_count BIGINT NOT NULL DEFAULT 0,
    author_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_articles_status (status),
    INDEX idx_articles_author (author_id),
    INDEX idx_articles_created (created_at),
    INDEX idx_articles_tags (tags)
) ENGINE=InnoDB;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    cover_image VARCHAR(500),
    tags VARCHAR(300),
    demo_url VARCHAR(500),
    github_url VARCHAR(500),
    author_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_projects_status (status),
    INDEX idx_projects_author (author_id),
    INDEX idx_projects_created (created_at)
) ENGINE=InnoDB;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    parent_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_comments_target (target_type, target_id),
    INDEX idx_comments_user (user_id)
) ENGINE=InnoDB;

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_likes (user_id, target_type, target_id),
    INDEX idx_likes_target (target_type, target_id)
) ENGINE=InnoDB;

-- Site config table
CREATE TABLE IF NOT EXISTS site_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    description VARCHAR(200)
) ENGINE=InnoDB;

-- Visitor count table
CREATE TABLE IF NOT EXISTS visitor_count (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_date DATE NOT NULL UNIQUE,
    page_views BIGINT NOT NULL DEFAULT 0,
    unique_visitors BIGINT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Insert default site config
INSERT INTO site_config (config_key, config_value, description) VALUES
    ('site_name', 'My Personal Website', 'Site name'),
    ('site_description', 'Full-stack developer passionate about building great products', 'Site description'),
    ('hero_title', 'Hi, I am a Developer', 'Hero section title'),
    ('hero_subtitle', 'I build things for the web', 'Hero section subtitle'),
    ('about_text', 'A passionate developer who loves creating elegant solutions.', 'About section text'),
    ('footer_text', ' 2025 My Personal Website. All rights reserved.', 'Footer text');

-- Insert default admin user (password: admin123, BCrypt encoded)
-- Change this password after first login!
INSERT INTO users (username, email, password, role, enabled) VALUES
    ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', TRUE);
