package com.java.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class BaseRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public Object getRawValue(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            log.debug("Raw value type for key {}: {}", key, (value != null) ? value.getClass().getName() : "null");
            return value;
        } catch (Exception e) {
            log.error("Error getting raw value from Redis for key: {}", key, e);
            return null;
        }
    }

    public void set(String key, Object value) {
        try {
            // Thử chuyển đổi object thành JSON để kiểm tra
            String jsonValue = objectMapper.writeValueAsString(value);
            log.debug("Setting key {} with JSON value: {}", key, jsonValue);
            
            redisTemplate.opsForValue().set(key, value);
            log.info("Successfully set Redis key: {}", key);
        } catch (JsonProcessingException e) {
            log.error("Error serializing object to JSON for key: {}", key, e);
        } catch (Exception e) {
            log.error("Error setting Redis key: {}", key, e);
        }
    }

    public boolean set(String key, Object value, long timeout, TimeUnit unit) {
        try {
            // Thử chuyển đổi object thành JSON để kiểm tra
            String jsonValue = objectMapper.writeValueAsString(value);
            log.debug("Setting key {} with timeout {}. JSON value: {}", key, timeout, jsonValue);
            
            redisTemplate.opsForValue().set(key, value, timeout, unit);
            
            // Verify đã lưu thành công
            boolean keyExists = Boolean.TRUE.equals(redisTemplate.hasKey(key));
            log.info("Set Redis key with timeout: {}, success: {}", key, keyExists);
            return keyExists;
        } catch (JsonProcessingException e) {
            log.error("Error serializing object to JSON for key: {}", key, e);
            return false;
        } catch (Exception e) {
            log.error("Error setting Redis key with timeout: {}", key, e);
            return false;
        }
    }

    public <T> T get(String key, Class<T> clazz) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                log.debug("No value found in Redis for key: {}", key);
                return null;
            }

            log.debug("Retrieved value from Redis for key: {}, valueType: {}", key, value.getClass().getName());
            
            // Thử chuyển đổi thành JSON trước khi convert về đối tượng
            String jsonValue = objectMapper.writeValueAsString(value);
            log.debug("Retrieved JSON value: {}", jsonValue);

            // Xử lý trường hợp đặc biệt cho CartResponse
            if (clazz.getSimpleName().equals("CartResponse")) {
                try {
                    // Nếu value đã là clazz type rồi, chỉ cần cast
                    if (clazz.isInstance(value)) {
                        log.debug("Value is already of type: {}, direct casting", clazz.getName());
                        return clazz.cast(value);
                    } 
                    // Nếu không, thử chuyển đổi từ JSON string
                    else {
                        log.debug("Converting from JSON to: {}", clazz.getName());
                        return objectMapper.readValue(jsonValue, clazz);
                    }
                } catch (Exception e) {
                    log.error("Special handling for {} failed, trying standard conversion", clazz.getName(), e);
                }
            }
            
            // Standard conversion
            T result = objectMapper.convertValue(value, clazz);
            log.debug("Successfully converted Redis value to type: {}", clazz.getName());
            return result;
        } catch (Exception e) {
            log.error("Error getting value from Redis for key: {} and class: {}", key, clazz.getName(), e);
            return null;
        }
    }

    public void deleteKey(String key) {
        try {
            Boolean deleted = redisTemplate.delete(key);
            log.info("Deleted Redis key: {}, success: {}", key, deleted);
        } catch (Exception e) {
            log.error("Error deleting Redis key: {}", key, e);
        }
    }

  public void deleteKeys(String pattern) {
    try {
      redisTemplate.delete(redisTemplate.keys(pattern));
    } catch (Exception e) {
      log.error("Error deleting Redis keys with pattern: {}", pattern, e);
    }
  }

  public boolean hasKey(String key) {
    try {
      return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    } catch (Exception e) {
      log.error("Error checking Redis key: {}", key, e);
      return false;
    }
  }

  public Long increment(String key) {
    try {
      return redisTemplate.opsForValue().increment(key);
    } catch (Exception e) {
      log.error("Error incrementing Redis key: {}", key, e);
      return null;
    }
  }

  public Long decrement(String key) {
    try {
      return redisTemplate.opsForValue().decrement(key);
    } catch (Exception e) {
      log.error("Error decrementing Redis key: {}", key, e);
      return null;
    }
  }

  public <T> void setObjectForMinutes(String key, T value, int minutes) {
    set(key, value, minutes, TimeUnit.MINUTES);
  }

  public <T> T get(String key, TypeReference<T> typeReference) {
    try {
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            log.debug("No value found in Redis for key: {}", key);
            return null;
        }

        log.debug("Retrieved value from Redis for key: {}, valueType: {}", key, value.getClass().getName());
        
        // Chuyển đổi thành JSON trước
        String jsonValue = objectMapper.writeValueAsString(value);
        log.debug("Retrieved JSON value: {}", jsonValue);
        
        // Chuyển từ JSON sang đối tượng cần thiết
        return objectMapper.readValue(jsonValue, typeReference);
    } catch (Exception e) {
        log.error("Error getting value from Redis for key: {} and typeReference: {}", key, typeReference, e);
        return null;
    }
}

}

