# 🐾 LT_Web - Pet Shop E-commerce

Website thương mại điện tử bán thú cưng và phụ kiện, được xây dựng với **Spring Boot** (Backend) và **React** (Frontend).

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

---

## 📋 Tính Năng

### Khách Hàng
- 🛒 Xem danh sách thú cưng và phụ kiện
- 🔍 Tìm kiếm sản phẩm (Elasticsearch)
- 🛍️ Giỏ hàng và thanh toán
- 👤 Đăng ký, đăng nhập (JWT + Google OAuth2)
- 📦 Theo dõi đơn hàng
- ⭐ Đánh giá sản phẩm

### Quản Trị Viên
- 📊 Dashboard thống kê
- 🐕 Quản lý thú cưng, phụ kiện, danh mục
- 📋 Quản lý đơn hàng
- 👥 Quản lý người dùng và phân quyền
- 📈 Báo cáo doanh thu

---

## 🔧 Công Nghệ

| Backend | Frontend | Database & Infra |
|---------|----------|------------------|
| Java 17 | React 18 | MySQL 8.0 |
| Spring Boot 3.2.5 | Redux | Redis |
| Spring Security + JWT | Ant Design | Elasticsearch |
| Spring Data JPA | Axios | Kafka |
| Spring Kafka | SASS | Docker |
| Cloudinary | React Router | |

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Docker Desktop
- Java 17+ (nếu chạy local)
- Node.js 18+ (nếu chạy local)

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd LT_Web
```

### Bước 2: Cấu Hình Environment
Tạo file `.env` từ `.env.example` và điền các thông tin:
```bash
cp .env.example .env
```

Cập nhật các biến trong `.env`:
```env
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=pet_shop
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password

# JWT
APP_JWT_SECRET=your_jwt_secret
JWT_VALID_DURATION=3600000
JWT_REFRESHABLE_DURATION=86400000

# Email
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email
SPRING_MAIL_PASSWORD=your_app_password

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

### Bước 3: Chạy với Docker Compose
```bash
docker-compose up --build
```

Đợi cho tất cả services khởi động (MySQL, Redis, Kafka, Elasticsearch, Backend).

### Bước 4: Chạy Frontend
```bash
cd FrontEnd/fe
npm install
npm start
```

---

## 🌐 Truy Cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8089 |
| API Docs (Swagger) | http://localhost:8089/swagger-ui.html |
| Elasticsearch | http://localhost:9201 |

---

## 📁 Cấu Trúc Dự Án

```
LT_Web/
├── BackEnd/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/java/backend/
│   │       ├── controller/  # REST APIs
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── entity/      # JPA entities
│   │       ├── dto/         # Data transfer objects
│   │       ├── security/    # JWT & OAuth2
│   │       └── configuration/
│   ├── Dockerfile
│   └── pom.xml
├── FrontEnd/fe/             # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/
│   │   │   ├── client/      # Customer pages
│   │   │   └── admin/       # Admin dashboard
│   │   ├── redux/           # State management
│   │   ├── services/        # API calls
│   │   └── layouts/
│   └── package.json
├── docker-compose.yml       # Multi-container setup
└── .env                     # Environment variables
```

---

## 🔌 API Endpoints

| Module | Endpoint | Mô tả |
|--------|----------|-------|
| Auth | `POST /api/auth/login` | Đăng nhập |
| Auth | `POST /api/auth/register` | Đăng ký |
| Pets | `GET /api/pets` | Danh sách thú cưng |
| Accessories | `GET /api/accessories` | Danh sách phụ kiện |
| Cart | `GET/POST /api/cart` | Quản lý giỏ hàng |
| Orders | `GET/POST /api/orders` | Quản lý đơn hàng |
| Search | `GET /api/search` | Tìm kiếm sản phẩm |

📖 Xem đầy đủ tại: http://localhost:8089/swagger-ui.html

---

