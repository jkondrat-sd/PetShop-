// package com.java.backend.configuration;

// import com.cloudinary.Cloudinary;
// import jakarta.servlet.MultipartConfigElement;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.web.servlet.MultipartConfigFactory;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.util.unit.DataSize;

// import java.util.HashMap;

// @Configuration
// public class ConfigCloudinary {
//     @Value("${spring.image.cloud-name}")
//     private String cloudName;

//     @Value("${spring.image.api-key}")
//     private String apiKey;

//     @Value("${spring.image.api-secret}")
//     private String apiSecret;
//     @Bean
//     public Cloudinary cloudinary() {
//         HashMap<String,String> config = new HashMap<>();
//         config.put("cloud_name", cloudName);
//         config.put("api_key", apiKey);
//         config.put("api_secret", apiSecret);
//         return new Cloudinary(config);
//     }

//     @Bean
//     public MultipartConfigElement multipartConfigElement() {
//         MultipartConfigFactory factory = new MultipartConfigFactory();
//         factory.setMaxFileSize(DataSize.ofMegabytes(100));
//         factory.setMaxRequestSize(DataSize.ofMegabytes(100));
//         return factory.createMultipartConfig();
//     }
// }
