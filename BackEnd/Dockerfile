FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline

# Sao chép mã nguồn và build
COPY . .

RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng
FROM openjdk:17-slim

WORKDIR /app

# Sao chép file JAR từ build
COPY --from=builder /build/target/BackEnd-0.0.1-SNAPSHOT.jar api-service.jar
# Expose cổng 8088
EXPOSE 8088

# Chạy ứng dụng
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar api-service.jar"]