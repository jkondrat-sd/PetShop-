// package com.java.backend.configuration;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.elasticsearch.client.ClientConfiguration;
// import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
// import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
// import java.time.Duration;

// @Configuration
// @EnableElasticsearchRepositories(basePackages = "com.java.backend.repository")
// public class ElasticsearchConfig extends ElasticsearchConfiguration {
//     @Value("${spring.data.elasticsearch.uris}")
//     private String uri;

//     @Override
//     public ClientConfiguration clientConfiguration() {
//         return ClientConfiguration.builder()
//                 .connectedTo(uri)
//                 .withConnectTimeout(Duration.ofSeconds(30))
//                 .withSocketTimeout(Duration.ofSeconds(30))
//                 .build();
//     }
// }