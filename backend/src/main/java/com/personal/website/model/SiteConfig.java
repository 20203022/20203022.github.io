package com.personal.website.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_config")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SiteConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;

    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;

    @Column(length = 200)
    private String description;
}
