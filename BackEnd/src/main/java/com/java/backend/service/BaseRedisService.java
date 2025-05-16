package com.java.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class BaseRedisService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
        } catch (Exception e) {
            log.error("Redis set error: {}", e.getMessage(), e);
        }
    }

    public void setObjectForMinutes(String key, Object value, long minutes) {
        try {
            redisTemplate.opsForValue().set(key, value, minutes, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis setObjectForMinutes error: {}", e.getMessage(), e);
        }
    }

    public void setObjectForHours(String key, Object value, long hours) {
        try {
            redisTemplate.opsForValue().set(key, value, hours, TimeUnit.HOURS);
        } catch (Exception e) {
            log.error("Redis setObjectForHours error: {}", e.getMessage(), e);
        }
    }

    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis get error: {}", e.getMessage(), e);
            return null;
        }
    }

    public boolean deleteKey(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.delete(key));
        } catch (Exception e) {
            log.error("Redis deleteKey error: {}", e.getMessage(), e);
            return false;
        }
    }

    public long deleteKeys(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                return redisTemplate.delete(keys);
            }
            return 0;
        } catch (Exception e) {
            log.error("Redis deleteKeys error: {}", e.getMessage(), e);
            return 0;
        }
    }
}