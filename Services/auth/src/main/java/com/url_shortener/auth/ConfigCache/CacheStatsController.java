package com.url_shortener.auth.ConfigCache;

// TO monitor cache statistics and performance metrics, you can use the Caffeine library's built-in features.

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.stats.CacheStats;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cache")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CacheStatsController {

    private final CacheManager cacheManager;

    @GetMapping("/stats")
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();

        for (String cacheName : cacheManager.getCacheNames()) {
            CaffeineCache caffeineCache = (CaffeineCache) cacheManager.getCache(cacheName);
            if (caffeineCache != null) {
                Cache<Object, Object> nativeCache = caffeineCache.getNativeCache();
                CacheStats cacheStats = nativeCache.stats();

                Map<String, Object> cacheDetails = new HashMap<>();
                cacheDetails.put("hitCount", cacheStats.hitCount());
                cacheDetails.put("missCount", cacheStats.missCount());
                cacheDetails.put("hitRate", cacheStats.hitRate());
                cacheDetails.put("estimatedSize", nativeCache.estimatedSize());

                stats.put(cacheName, cacheDetails);

                stats.put(cacheName, cacheStats);
            }
        }

        return stats;
    }

    @GetMapping("/clear")
    public Map<String, String> clearAllCaches() {
        for (String cacheName : cacheManager.getCacheNames()) {
            cacheManager.getCache(cacheName).clear();
        }

        return Map.of("status", "All caches cleared successfully");
    }
}
