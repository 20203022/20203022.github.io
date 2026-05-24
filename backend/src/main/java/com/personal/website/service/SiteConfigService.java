package com.personal.website.service;

import com.personal.website.model.SiteConfig;
import com.personal.website.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private final SiteConfigRepository configRepo;

    public Map<String, String> getAll() {
        List<SiteConfig> configs = configRepo.findAll();
        Map<String, String> result = new HashMap<>();
        for (SiteConfig c : configs) {
            result.put(c.getConfigKey(), c.getConfigValue());
        }
        return result;
    }

    public String get(String key) {
        return configRepo.findByConfigKey(key)
                .map(SiteConfig::getConfigValue)
                .orElse(null);
    }

    @Transactional
    public void update(Map<String, String> configs) {
        for (var entry : configs.entrySet()) {
            SiteConfig config = configRepo.findByConfigKey(entry.getKey())
                    .orElse(SiteConfig.builder().configKey(entry.getKey()).build());
            config.setConfigValue(entry.getValue());
            configRepo.save(config);
        }
    }
}
