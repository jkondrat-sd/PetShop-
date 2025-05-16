// package com.java.backend.configuration;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.databind.SerializationFeature;
// import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
// import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
// import org.springframework.data.redis.serializer.StringRedisSerializer;

// @Configuration
// @Slf4j
// public class RedisConfig {
//     @Value("${spring.data.redis.host}")
//     private String host;
//     @Value("${spring.data.redis.port}")
//     private String port;

//     @Bean
//     JedisConnectionFactory jedisConnectionFactory(){
//         log.info("Connecting redis: {}:{}", host, port);
//         RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
//         redisStandaloneConfiguration.setHostName(host);
//         redisStandaloneConfiguration.setPort(Integer.parseInt(port));
//         return new JedisConnectionFactory(redisStandaloneConfiguration);
//     }
//     @Bean
//     public ObjectMapper redisObjectMapper() {
//         ObjectMapper objectMapper = new ObjectMapper();
//         objectMapper.registerModule(new JavaTimeModule());
//         objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//         return objectMapper;
//     }
//     @Bean
//     public RedisTemplate<String, Object> redisTemplate() {
//         RedisTemplate<String, Object> template = new RedisTemplate<>();
//         template.setConnectionFactory(jedisConnectionFactory());
//         template.setKeySerializer(new StringRedisSerializer());
//         template.setHashKeySerializer(new StringRedisSerializer());
//         template.setValueSerializer(new GenericJackson2JsonRedisSerializer(redisObjectMapper()));
//         template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer(redisObjectMapper()));
//         log.info("Redis connected !");
//         return template;
//     }

// }
