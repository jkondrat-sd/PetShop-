package com.java.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

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
            log.error("Error setting value in Redis: {}", e.getMessage());
        }
    }
    
    public void setObjectForMinutes(String key, Object value, long minutes) {
        try {
            redisTemplate.opsForValue().set(key, value, minutes, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Error setting value with timeout in Redis: {}", e.getMessage());
        }
    }
    
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Error getting value from Redis: {}", e.getMessage());
            return null;
        }
    }
    
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            log.error("Error deleting key from Redis: {}", e.getMessage());
        }
    }
    
    public void deleteByPattern(String pattern) {
        try {
            redisTemplate.delete(redisTemplate.keys(pattern + "*"));
        } catch (Exception e) {
            log.error("Error deleting keys with pattern from Redis: {}", e.getMessage());
        }
    }
}