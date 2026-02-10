/**
 * ============================================
 * MOCK DATA - PET SHOP
 * ============================================
 * 
 * File này chứa tất cả dữ liệu mock cho ứng dụng.
 * Dữ liệu được import từ các file JSON đã export từ MySQL.
 * 
 * CẤU TRÚC FILE:
 * - pets.json: Danh sách thú cưng
 * - accessories.json: Danh sách phụ kiện
 * - categories, breeds, users: Định nghĩa trực tiếp
 * 
 * ============================================
 * HƯỚNG DẪN EXPORT DATA TỪ MYSQL
 * ============================================
 * 
 * Chạy backend local, sau đó dùng curl/Postman để lấy data:
 * 
 * 1. PETS:
 *    curl http://localhost:8080/api/pets?size=100 > pets.json
 * 
 * 2. ACCESSORIES:
 *    curl http://localhost:8080/api/accessories?size=100 > accessories.json
 * 
 * 3. CATEGORIES:
 *    curl http://localhost:8080/api/categories?size=100 > categories.json
 * 
 * 4. BREEDS:
 *    curl http://localhost:8080/api/breeds?size=100 > breeds.json
 * 
 * Hoặc dùng MySQL Workbench export trực tiếp với các query dưới đây.
 * 
 * ============================================
 * SQL QUERIES ĐỂ EXPORT DATA
 * ============================================
 * 
 * -- PETS
 * SELECT 
 *   pet_id as petId,
 *   pet_name as petName,
 *   type,
 *   breed,
 *   breed_id as breedId,
 *   gender,
 *   unit_price as unitPrice,
 *   age,
 *   status,
 *   thumbnail,
 *   created_at as createdAt,
 *   updated_at as updatedAt
 * FROM pets
 * WHERE status = 'available';
 * 
 * -- ACCESSORIES
 * SELECT 
 *   accessory_id as accessoryId,
 *   accessory_name as accessoryName,
 *   description,
 *   category,
 *   category_id as categoryId,
 *   unit_price as unitPrice,
 *   stock_quantity as stockQuantity,
 *   status,
 *   thumbnail,
 *   created_at as createdAt,
 *   updated_at as updatedAt
 * FROM accessories
 * WHERE status = 'active';
 * 
 * -- CATEGORIES
 * SELECT 
 *   category_id as categoryId,
 *   category_name as categoryName,
 *   description,
 *   status,
 *   created_at as createdAt,
 *   updated_at as updatedAt
 * FROM categories;
 * 
 * -- BREEDS
 * SELECT 
 *   breed_id as id,
 *   breed_name as breedName,
 *   pet_type as petType,
 *   description,
 *   status
 * FROM breeds;
 * 
 * ============================================
 */

// Import data từ JSON files (đã export từ MySQL API)
import petsJsonData from "./pets.json";
import accessoriesJsonData from "./accessories.json";

// Extract data content từ API response format
export const petsData = petsJsonData?.data?.content || [];
export const accessoriesData = accessoriesJsonData?.data?.content || [];

/**
 * CATEGORIES DATA
 * Export từ: GET /api/categories
 * 
 * Để cập nhật: Chạy curl http://localhost:8080/api/categories?size=100
 * và thay thế array bên dưới
 */
export const categoriesData = [
  {
    categoryId: 1,
    categoryName: "Thức ăn",
    description: "Thức ăn cho thú cưng",
    status: "active"
  },
  {
    categoryId: 2,
    categoryName: "Phụ kiện",
    description: "Phụ kiện thú cưng",
    status: "active"
  },
  {
    categoryId: 3,
    categoryName: "Đồ chơi",
    description: "Đồ chơi cho thú cưng",
    status: "active"
  },
  {
    categoryId: 4,
    categoryName: "Chăm sóc sức khỏe",
    description: "Sản phẩm chăm sóc sức khỏe",
    status: "active"
  },
  {
    categoryId: 5,
    categoryName: "Vệ sinh",
    description: "Sản phẩm vệ sinh",
    status: "active"
  },
  {
    categoryId: 15,
    categoryName: "Dog Poop Bags",
    description: "Túi dọn phân",
    status: "active"
  },
  {
    categoryId: 16,
    categoryName: "Dog Collars",
    description: "Vòng cổ cho chó",
    status: "active"
  }
];

/**
 * BREEDS DATA
 * Export từ: GET /api/breeds
 * 
 * Để cập nhật: Chạy curl http://localhost:8080/api/breeds?size=100
 * và thay thế array bên dưới
 */
export const breedsData = [
  // DOG BREEDS
  { id: 1, breedName: "Golden Retriever", petType: "DOG", description: "Chó Golden Retriever thân thiện", status: "active" },
  { id: 2, breedName: "Labrador Retriever", petType: "DOG", description: "Chó Labrador thông minh", status: "active" },
  { id: 3, breedName: "Poodle", petType: "DOG", description: "Chó Poodle lông xoăn", status: "active" },
  { id: 4, breedName: "German Shepherd", petType: "DOG", description: "Chó Becgie Đức", status: "active" },
  { id: 7, breedName: "Bulldog", petType: "DOG", description: "Chó Bulldog", status: "active" },
  { id: 8, breedName: "Husky", petType: "DOG", description: "Chó Husky Siberian", status: "active" },
  { id: 9, breedName: "Corgi", petType: "DOG", description: "Chó Corgi chân ngắn", status: "active" },
  { id: 10, breedName: "Shiba Inu", petType: "DOG", description: "Chó Shiba Inu Nhật Bản", status: "active" },
  
  // CAT BREEDS
  { id: 5, breedName: "Siamese", petType: "CAT", description: "Mèo Xiêm", status: "active" },
  { id: 6, breedName: "Maine Coon", petType: "CAT", description: "Mèo Maine Coon lông dài", status: "active" },
  { id: 11, breedName: "Persian", petType: "CAT", description: "Mèo Ba Tư lông dài", status: "active" },
  { id: 12, breedName: "British Shorthair", petType: "CAT", description: "Mèo Anh lông ngắn", status: "active" },
  { id: 13, breedName: "Scottish Fold", petType: "CAT", description: "Mèo tai cụp Scotland", status: "active" },
  { id: 14, breedName: "Bengal", petType: "CAT", description: "Mèo Bengal", status: "active" },
  { id: 15, breedName: "Ragdoll", petType: "CAT", description: "Mèo Ragdoll hiền lành", status: "active" },
  { id: 16, breedName: "Sphynx", petType: "CAT", description: "Mèo không lông Sphynx", status: "active" }
];

/**
 * USERS DATA (Mock accounts để test)
 * 
 * Admin account: admin / admin123
 * User account: user / user123
 */
export const usersData = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@petshop.com",
    firstName: "Admin",
    lastName: "User",
    phone: "0123456789",
    address: "123 Admin Street, HCM",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    role: "ADMIN",
    roles: ["ADMIN"],
    enabled: true
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    email: "user@petshop.com",
    firstName: "Normal",
    lastName: "User",
    phone: "0987654321",
    address: "456 User Street, HCM",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    role: "USER",
    roles: ["USER"],
    enabled: true
  }
];

/**
 * DASHBOARD/REPORTS DATA (Admin)
 * Mock data cho báo cáo thống kê
 */
export const salesOverviewData = {
  totalRevenue: 125000000,
  totalOrders: 156,
  newCustomers: 42
};

export const salesChartData = [
  { date: "2026-02-05", revenue: 15000000 },
  { date: "2026-02-06", revenue: 18000000 },
  { date: "2026-02-07", revenue: 12000000 },
  { date: "2026-02-08", revenue: 22000000 },
  { date: "2026-02-09", revenue: 25000000 },
  { date: "2026-02-10", revenue: 20000000 },
  { date: "2026-02-11", revenue: 13000000 }
];

export const topProductsData = [
  { id: 1, name: "Golden Retriever", type: "Pet", sold: 15, revenue: 45000000 },
  { id: 2, name: "Cat Food Premium", type: "Accessory", sold: 120, revenue: 24000000 },
  { id: 3, name: "Dog Collar Leather", type: "Accessory", sold: 85, revenue: 12750000 },
  { id: 4, name: "Siamese Cat", type: "Pet", sold: 8, revenue: 24000000 },
  { id: 5, name: "Pet Bed Deluxe", type: "Accessory", sold: 45, revenue: 9000000 }
];

export const inventoryPieData = [
  { type: "Dog", value: 45 },
  { type: "Cat", value: 38 },
  { type: "Accessory", value: 250 }
];

export const lowStockProductsData = [
  { id: 19, name: "CAT SCRATCHER DJ TURN TABLE", type: "Accessory", stock: 5, status: "Low" },
  { id: 25, name: "Dog Collar - Aqua Blue", type: "Accessory", stock: 3, status: "Low" },
  { id: 22, name: "Training Balls", type: "Accessory", stock: 8, status: "Low" }
];

/**
 * ORDERS DATA (Sample orders để test)
 */
export const ordersData = [];

/**
 * REVIEWS DATA (Sample reviews để test)
 */
export const reviewsData = [];
