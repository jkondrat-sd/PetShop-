import { createServer, Model, Response } from "miragejs";

// Fake JWT token generator
const generateToken = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    sub: "admin", 
    exp: Date.now() + 86400000,
    iat: Date.now()
  }));
  const signature = btoa("fake-signature-" + Math.random().toString(36));
  return `${header}.${payload}.${signature}`;
};

// Mock data for pets
const petsData = [
  {
    name: "Chó Corgi Pembroke",
    type: "DOG",
    breedId: 1,
    breedName: "Corgi Pembroke",
    age: 3,
    gender: "MALE",
    price: 15000000,
    status: "AVAILABLE",
    description: "Chó Corgi Pembroke thuần chủng, lông vàng trắng, chân ngắn đáng yêu",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/corgi1.jpg",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/pets/corgi2.jpg"]
  },
  {
    name: "Mèo Anh Lông Ngắn",
    type: "CAT",
    breedId: 2,
    breedName: "British Shorthair",
    age: 2,
    gender: "FEMALE",
    price: 12000000,
    status: "AVAILABLE",
    description: "Mèo Anh lông ngắn màu xám xanh, mặt tròn đáng yêu",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/british1.jpg",
    images: []
  },
  {
    name: "Chó Poodle Toy",
    type: "DOG",
    breedId: 3,
    breedName: "Poodle Toy",
    age: 1,
    gender: "MALE",
    price: 8000000,
    status: "AVAILABLE",
    description: "Chó Poodle Toy size mini, lông xoăn màu kem",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/poodle1.jpg",
    images: []
  },
  {
    name: "Mèo Ba Tư",
    type: "CAT",
    breedId: 4,
    breedName: "Persian",
    age: 4,
    gender: "FEMALE",
    price: 18000000,
    status: "AVAILABLE",
    description: "Mèo Ba Tư lông dài trắng muốt, mắt xanh",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/persian1.jpg",
    images: []
  },
  {
    name: "Chó Husky Siberian",
    type: "DOG",
    breedId: 5,
    breedName: "Husky Siberian",
    age: 2,
    gender: "MALE",
    price: 20000000,
    status: "AVAILABLE",
    description: "Chó Husky Siberian thuần chủng, mắt xanh, lông đen trắng",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/husky1.jpg",
    images: []
  },
  {
    name: "Mèo Munchkin",
    type: "CAT",
    breedId: 6,
    breedName: "Munchkin",
    age: 1,
    gender: "FEMALE",
    price: 25000000,
    status: "AVAILABLE",
    description: "Mèo Munchkin chân ngắn, lông vàng cam",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/munchkin1.jpg",
    images: []
  },
  {
    name: "Chó Golden Retriever",
    type: "DOG",
    breedId: 7,
    breedName: "Golden Retriever",
    age: 1,
    gender: "MALE",
    price: 12000000,
    status: "AVAILABLE",
    description: "Chó Golden Retriever thuần chủng, lông vàng óng",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/golden1.jpg",
    images: []
  },
  {
    name: "Mèo Scottish Fold",
    type: "CAT",
    breedId: 8,
    breedName: "Scottish Fold",
    age: 2,
    gender: "MALE",
    price: 22000000,
    status: "AVAILABLE",
    description: "Mèo Scottish Fold tai cụp, lông xám",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/scottish1.jpg",
    images: []
  },
  {
    name: "Chó Shiba Inu",
    type: "DOG",
    breedId: 9,
    breedName: "Shiba Inu",
    age: 3,
    gender: "FEMALE",
    price: 30000000,
    status: "AVAILABLE",
    description: "Chó Shiba Inu Nhật Bản thuần chủng, lông vàng cam",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/shiba1.jpg",
    images: []
  },
  {
    name: "Mèo Maine Coon",
    type: "CAT",
    breedId: 10,
    breedName: "Maine Coon",
    age: 2,
    gender: "MALE",
    price: 35000000,
    status: "AVAILABLE",
    description: "Mèo Maine Coon khổng lồ, lông dài nâu tabby",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/maine1.jpg",
    images: []
  },
  {
    name: "Chó Beagle",
    type: "DOG",
    breedId: 11,
    breedName: "Beagle",
    age: 2,
    gender: "MALE",
    price: 9000000,
    status: "AVAILABLE",
    description: "Chó Beagle tai dài, ba màu đáng yêu",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/beagle1.jpg",
    images: []
  },
  {
    name: "Mèo Ragdoll",
    type: "CAT",
    breedId: 12,
    breedName: "Ragdoll",
    age: 1,
    gender: "FEMALE",
    price: 28000000,
    status: "AVAILABLE",
    description: "Mèo Ragdoll mắt xanh, lông trắng kem",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/ragdoll1.jpg",
    images: []
  },
  {
    name: "Chó Pomeranian",
    type: "DOG",
    breedId: 13,
    breedName: "Pomeranian",
    age: 1,
    gender: "FEMALE",
    price: 10000000,
    status: "AVAILABLE",
    description: "Chó Pomeranian Phốc Sóc lông xù cam",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/pom1.jpg",
    images: []
  },
  {
    name: "Mèo Bengal",
    type: "CAT",
    breedId: 14,
    breedName: "Bengal",
    age: 2,
    gender: "MALE",
    price: 40000000,
    status: "AVAILABLE",
    description: "Mèo Bengal họa tiết da báo tuyệt đẹp",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/bengal1.jpg",
    images: []
  },
  {
    name: "Chó Labrador Retriever",
    type: "DOG",
    breedId: 15,
    breedName: "Labrador Retriever",
    age: 1,
    gender: "MALE",
    price: 11000000,
    status: "AVAILABLE",
    description: "Chó Labrador màu vàng, thân thiện",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/lab1.jpg",
    images: []
  },
  {
    name: "Mèo Sphynx",
    type: "CAT",
    breedId: 16,
    breedName: "Sphynx",
    age: 2,
    gender: "FEMALE",
    price: 45000000,
    status: "AVAILABLE",
    description: "Mèo Sphynx không lông, da hồng",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/sphynx1.jpg",
    images: []
  },
  {
    name: "Chó Bulldog Pháp",
    type: "DOG",
    breedId: 17,
    breedName: "French Bulldog",
    age: 2,
    gender: "MALE",
    price: 35000000,
    status: "AVAILABLE",
    description: "Chó Bulldog Pháp tai dơi, màu fawn",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/frenchie1.jpg",
    images: []
  },
  {
    name: "Mèo Siamese",
    type: "CAT",
    breedId: 18,
    breedName: "Siamese",
    age: 1,
    gender: "FEMALE",
    price: 8000000,
    status: "AVAILABLE",
    description: "Mèo Xiêm điểm seal, mắt xanh biếc",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/siamese1.jpg",
    images: []
  },
  {
    name: "Chó Chihuahua",
    type: "DOG",
    breedId: 19,
    breedName: "Chihuahua",
    age: 2,
    gender: "FEMALE",
    price: 6000000,
    status: "AVAILABLE",
    description: "Chó Chihuahua size teacup, lông ngắn màu kem",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/chihuahua1.jpg",
    images: []
  },
  {
    name: "Mèo Russian Blue",
    type: "CAT",
    breedId: 20,
    breedName: "Russian Blue",
    age: 3,
    gender: "MALE",
    price: 15000000,
    status: "AVAILABLE",
    description: "Mèo Nga xanh lông ngắn mượt mà",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/pets/russian1.jpg",
    images: []
  }
];

// Mock data for accessories
const accessoriesData = [
  {
    name: "Thức ăn hạt Royal Canin cho Chó",
    categoryId: 1,
    categoryName: "Thức ăn",
    price: 450000,
    quantity: 100,
    status: "active",
    description: "Thức ăn hạt cao cấp Royal Canin cho chó trưởng thành 3kg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/food1.jpg"
  },
  {
    name: "Thức ăn hạt Whiskas cho Mèo",
    categoryId: 1,
    categoryName: "Thức ăn",
    price: 320000,
    quantity: 150,
    status: "active",
    description: "Thức ăn hạt Whiskas dành cho mèo trưởng thành 2kg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/food2.jpg"
  },
  {
    name: "Vòng cổ da cao cấp",
    categoryId: 2,
    categoryName: "Phụ kiện",
    price: 180000,
    quantity: 50,
    status: "active",
    description: "Vòng cổ da thật cho chó cỡ vừa",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/collar1.jpg"
  },
  {
    name: "Bát ăn inox chống lật",
    categoryId: 2,
    categoryName: "Phụ kiện",
    price: 120000,
    quantity: 200,
    status: "active",
    description: "Bát ăn inox 304 chống lật cho chó mèo",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/bowl1.jpg"
  },
  {
    name: "Đồ chơi bóng cao su",
    categoryId: 3,
    categoryName: "Đồ chơi",
    price: 50000,
    quantity: 300,
    status: "active",
    description: "Bóng cao su thiên nhiên an toàn cho thú cưng",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/toy1.jpg"
  },
  {
    name: "Nhà ngủ ấm áp cho mèo",
    categoryId: 4,
    categoryName: "Nhà chuồng",
    price: 350000,
    quantity: 30,
    status: "active",
    description: "Nhà ngủ lông cừu ấm áp cho mèo",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/house1.jpg"
  },
  {
    name: "Dây dắt cố định 1.5m",
    categoryId: 2,
    categoryName: "Phụ kiện",
    price: 150000,
    quantity: 80,
    status: "active",
    description: "Dây dắt nylon bền chắc cho chó lớn",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/leash1.jpg"
  },
  {
    name: "Sữa tắm SOS",
    categoryId: 5,
    categoryName: "Vệ sinh",
    price: 180000,
    quantity: 100,
    status: "active",
    description: "Sữa tắm SOS khử mùi cho chó 500ml",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/shampoo1.jpg"
  },
  {
    name: "Lược chải lông 2 mặt",
    categoryId: 5,
    categoryName: "Vệ sinh",
    price: 75000,
    quantity: 150,
    status: "active",
    description: "Lược chải lông 2 mặt chống rối cho chó mèo",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/brush1.jpg"
  },
  {
    name: "Túi vận chuyển thú cưng",
    categoryId: 6,
    categoryName: "Vận chuyển",
    price: 550000,
    quantity: 25,
    status: "active",
    description: "Túi vận chuyển phi hành gia cho chó mèo dưới 5kg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/carrier1.jpg"
  },
  {
    name: "Cát vệ sinh Catsan",
    categoryId: 5,
    categoryName: "Vệ sinh",
    price: 250000,
    quantity: 80,
    status: "active",
    description: "Cát vệ sinh Catsan 8L khử mùi hiệu quả",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/litter1.jpg"
  },
  {
    name: "Móng cắt thú cưng",
    categoryId: 5,
    categoryName: "Vệ sinh",
    price: 65000,
    quantity: 100,
    status: "active",
    description: "Móng cắt inox cho chó mèo",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/accessories/clipper1.jpg"
  }
];

// Mock categories
const categoriesData = [
  { id: 1, name: "Thức ăn", description: "Thức ăn cho thú cưng", status: "active" },
  { id: 2, name: "Phụ kiện", description: "Phụ kiện cho thú cưng", status: "active" },
  { id: 3, name: "Đồ chơi", description: "Đồ chơi cho thú cưng", status: "active" },
  { id: 4, name: "Nhà chuồng", description: "Nhà và chuồng cho thú cưng", status: "active" },
  { id: 5, name: "Vệ sinh", description: "Đồ vệ sinh cho thú cưng", status: "active" },
  { id: 6, name: "Vận chuyển", description: "Đồ vận chuyển thú cưng", status: "active" }
];

// Mock breeds
const breedsData = [
  { id: 1, name: "Corgi Pembroke", type: "DOG" },
  { id: 2, name: "British Shorthair", type: "CAT" },
  { id: 3, name: "Poodle Toy", type: "DOG" },
  { id: 4, name: "Persian", type: "CAT" },
  { id: 5, name: "Husky Siberian", type: "DOG" },
  { id: 6, name: "Munchkin", type: "CAT" },
  { id: 7, name: "Golden Retriever", type: "DOG" },
  { id: 8, name: "Scottish Fold", type: "CAT" },
  { id: 9, name: "Shiba Inu", type: "DOG" },
  { id: 10, name: "Maine Coon", type: "CAT" },
  { id: 11, name: "Beagle", type: "DOG" },
  { id: 12, name: "Ragdoll", type: "CAT" },
  { id: 13, name: "Pomeranian", type: "DOG" },
  { id: 14, name: "Bengal", type: "CAT" },
  { id: 15, name: "Labrador Retriever", type: "DOG" },
  { id: 16, name: "Sphynx", type: "CAT" },
  { id: 17, name: "French Bulldog", type: "DOG" },
  { id: 18, name: "Siamese", type: "CAT" },
  { id: 19, name: "Chihuahua", type: "DOG" },
  { id: 20, name: "Russian Blue", type: "CAT" }
];

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      pet: Model,
      accessory: Model,
      category: Model,
      breed: Model,
      user: Model,
      cartItem: Model,
      order: Model,
      review: Model
    },

    seeds(server) {
      // Seed users
      server.create("user", {
        id: 1,
        username: "admin",
        password: "123456",
        email: "admin@petshop.com",
        fullName: "Administrator",
        roles: ["ADMIN"],
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/v1/avatars/admin.jpg",
        createdAt: new Date().toISOString()
      });

      server.create("user", {
        id: 2,
        username: "user",
        password: "123456",
        email: "user@example.com",
        fullName: "Demo User",
        roles: ["USER"],
        avatarUrl: "",
        createdAt: new Date().toISOString()
      });

      // Seed categories
      categoriesData.forEach(cat => {
        server.create("category", cat);
      });

      // Seed breeds
      breedsData.forEach(breed => {
        server.create("breed", breed);
      });

      // Seed pets
      petsData.forEach((pet, index) => {
        server.create("pet", {
          id: index + 1,
          ...pet,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      // Seed accessories
      accessoriesData.forEach((acc, index) => {
        server.create("accessory", {
          id: index + 1,
          ...acc,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 400; // Simulate network delay

      // ========== AUTH ROUTES ==========
      this.post("/auth/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ username, password });

        if (user) {
          return {
            success: true,
            message: "Đăng nhập thành công",
            data: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullName: user.fullName,
              roles: user.roles,
              avatarUrl: user.avatarUrl,
              token: generateToken()
            }
          };
        }

        return new Response(401, {}, {
          success: false,
          message: "Sai tên đăng nhập hoặc mật khẩu"
        });
      });

      this.post("/auth/register", (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        
        // Check if username exists
        if (schema.users.findBy({ username: userData.username })) {
          return new Response(400, {}, {
            success: false,
            message: "Tên đăng nhập đã tồn tại"
          });
        }

        // Check if email exists
        if (schema.users.findBy({ email: userData.email })) {
          return new Response(400, {}, {
            success: false,
            message: "Email đã được sử dụng"
          });
        }

        const newUser = schema.users.create({
          ...userData,
          roles: ["USER"],
          createdAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
          data: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
          }
        };
      });

      // ========== PETS ROUTES ==========
      this.get("/pets", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const type = request.queryParams.type;
        const breedId = request.queryParams.breedId;
        const query = request.queryParams.q || request.queryParams.query;

        let pets = schema.pets.all().models;

        // Filter by type
        if (type) {
          pets = pets.filter(p => p.type === type);
        }

        // Filter by breedId
        if (breedId) {
          pets = pets.filter(p => p.breedId === parseInt(breedId));
        }

        // Search by query
        if (query) {
          const lowerQuery = query.toLowerCase();
          pets = pets.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.breedName.toLowerCase().includes(lowerQuery)
          );
        }

        const totalElements = pets.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedPets = pets.slice(start, start + size);

        return {
          success: true,
          message: "Lấy danh sách thú cưng thành công",
          data: {
            content: paginatedPets,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      this.get("/pets/:id", (schema, request) => {
        const pet = schema.pets.find(request.params.id);

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy thú cưng"
          });
        }

        return {
          success: true,
          message: "Lấy thông tin thú cưng thành công",
          data: pet.attrs
        };
      });

      this.post("/pets", (schema, request) => {
        const petData = JSON.parse(request.requestBody);
        const newPet = schema.pets.create({
          ...petData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Thêm thú cưng thành công",
          data: newPet.attrs
        };
      });

      this.put("/pets/:id", (schema, request) => {
        const pet = schema.pets.find(request.params.id);
        const petData = JSON.parse(request.requestBody);

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy thú cưng"
          });
        }

        pet.update({
          ...petData,
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Cập nhật thú cưng thành công",
          data: pet.attrs
        };
      });

      this.delete("/pets/:id", (schema, request) => {
        const pet = schema.pets.find(request.params.id);

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy thú cưng"
          });
        }

        pet.destroy();

        return {
          success: true,
          message: "Xóa thú cưng thành công"
        };
      });

      // ========== ACCESSORIES ROUTES ==========
      this.get("/accessories", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 12;
        const categoryId = request.queryParams.categoryId;
        const status = request.queryParams.status || "active";
        const name = request.queryParams.name;

        let accessories = schema.accessories.all().models;

        // Filter by status
        if (status) {
          accessories = accessories.filter(a => a.status === status);
        }

        // Filter by categoryId
        if (categoryId) {
          accessories = accessories.filter(a => a.categoryId === parseInt(categoryId));
        }

        // Search by name
        if (name) {
          const lowerName = name.toLowerCase();
          accessories = accessories.filter(a => 
            a.name.toLowerCase().includes(lowerName)
          );
        }

        const totalElements = accessories.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedAccessories = accessories.slice(start, start + size);

        return {
          success: true,
          message: "Lấy danh sách phụ kiện thành công",
          data: {
            content: paginatedAccessories,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      this.get("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.find(request.params.id);

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy phụ kiện"
          });
        }

        return {
          success: true,
          message: "Lấy thông tin phụ kiện thành công",
          data: accessory.attrs
        };
      });

      this.post("/accessories", (schema, request) => {
        const accData = JSON.parse(request.requestBody);
        const newAcc = schema.accessories.create({
          ...accData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Thêm phụ kiện thành công",
          data: newAcc.attrs
        };
      });

      this.put("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.find(request.params.id);
        const accData = JSON.parse(request.requestBody);

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy phụ kiện"
          });
        }

        accessory.update({
          ...accData,
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Cập nhật phụ kiện thành công",
          data: accessory.attrs
        };
      });

      this.delete("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.find(request.params.id);

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy phụ kiện"
          });
        }

        accessory.destroy();

        return {
          success: true,
          message: "Xóa phụ kiện thành công"
        };
      });

      // ========== CATEGORIES ROUTES ==========
      this.get("/categories", (schema, request) => {
        const status = request.queryParams.status || "active";
        let categories = schema.categories.all().models;

        if (status) {
          categories = categories.filter(c => c.status === status);
        }

        return {
          success: true,
          message: "Lấy danh sách danh mục thành công",
          data: {
            content: categories,
            totalElements: categories.length
          }
        };
      });

      // ========== BREEDS ROUTES ==========
      this.get("/breeds", (schema, request) => {
        const type = request.queryParams.type;
        let breeds = schema.breeds.all().models;

        if (type) {
          breeds = breeds.filter(b => b.type === type);
        }

        return {
          success: true,
          message: "Lấy danh sách giống thành công",
          data: {
            content: breeds,
            totalElements: breeds.length
          }
        };
      });

      // ========== CART ROUTES ==========
      this.get("/cart", (schema) => {
        const cartItems = schema.cartItems.all().models;
        
        // Calculate totals
        let items = cartItems.map(item => {
          let product = null;
          let price = 0;
          let name = "";
          let thumbnail = "";

          if (item.itemType === "PET") {
            product = schema.pets.find(item.itemId);
          } else {
            product = schema.accessories.find(item.itemId);
          }

          if (product) {
            price = product.price;
            name = product.name;
            thumbnail = product.thumbnail;
          }

          return {
            ...item.attrs,
            name,
            price,
            thumbnail,
            subtotal: price * item.quantity
          };
        });

        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          success: true,
          message: "Lấy giỏ hàng thành công",
          data: {
            items,
            totalAmount,
            totalItems
          }
        };
      });

      this.post("/cart", (schema, request) => {
        const { items } = JSON.parse(request.requestBody);

        items.forEach(item => {
          // Find existing cart item
          const existingItem = schema.cartItems.findBy({
            itemType: item.itemType,
            itemId: item.itemId
          });

          if (item.quantity === 0 && existingItem) {
            // Remove item if quantity is 0
            existingItem.destroy();
          } else if (existingItem) {
            // Update existing item
            existingItem.update({ quantity: item.quantity });
          } else if (item.quantity > 0) {
            // Create new item
            schema.cartItems.create({
              itemType: item.itemType,
              itemId: item.itemId,
              quantity: item.quantity
            });
          }
        });

        // Return updated cart
        const cartItems = schema.cartItems.all().models;
        const cartData = cartItems.map(item => {
          let product = item.itemType === "PET" 
            ? schema.pets.find(item.itemId) 
            : schema.accessories.find(item.itemId);
          
          const price = product?.price || 0;
          
          return {
            ...item.attrs,
            name: product?.name || "",
            price,
            thumbnail: product?.thumbnail || "",
            subtotal: price * item.quantity
          };
        });

        const totalAmount = cartData.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

        return {
          success: true,
          message: "Cập nhật giỏ hàng thành công",
          data: {
            items: cartData,
            totalAmount,
            totalItems
          }
        };
      });

      this.delete("/cart", (schema) => {
        schema.cartItems.all().destroy();

        return {
          success: true,
          message: "Đã xóa giỏ hàng"
        };
      });

      // ========== SEARCH ROUTES ==========
      this.get("/search", (schema, request) => {
        const query = request.queryParams.query || request.queryParams.q || "";
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        if (!query) {
          return {
            success: true,
            data: {
              content: [],
              totalElements: 0,
              totalPages: 0
            }
          };
        }

        const lowerQuery = query.toLowerCase();

        // Search in pets
        const pets = schema.pets.all().models.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.breedName.toLowerCase().includes(lowerQuery)
        ).map(p => ({ ...p.attrs, productType: "PET" }));

        // Search in accessories
        const accessories = schema.accessories.all().models.filter(a =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.description.toLowerCase().includes(lowerQuery)
        ).map(a => ({ ...a.attrs, productType: "ACCESSORY" }));

        const allResults = [...pets, ...accessories];
        const totalElements = allResults.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedResults = allResults.slice(start, start + size);

        return {
          success: true,
          message: "Tìm kiếm thành công",
          data: {
            content: paginatedResults,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      this.get("/search/pets", (schema, request) => {
        const query = request.queryParams.query || request.queryParams.q || "";
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const lowerQuery = query.toLowerCase();
        const pets = schema.pets.all().models.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.breedName.toLowerCase().includes(lowerQuery)
        );

        const totalElements = pets.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedPets = pets.slice(start, start + size);

        return {
          success: true,
          data: {
            content: paginatedPets.map(p => p.attrs),
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      this.get("/search/accessories", (schema, request) => {
        const query = request.queryParams.query || request.queryParams.q || "";
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const lowerQuery = query.toLowerCase();
        const accessories = schema.accessories.all().models.filter(a =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.description.toLowerCase().includes(lowerQuery)
        );

        const totalElements = accessories.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedAccessories = accessories.slice(start, start + size);

        return {
          success: true,
          data: {
            content: paginatedAccessories.map(a => a.attrs),
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // ========== USER ROUTES ==========
      this.get("/users/profile", (schema) => {
        // For demo, return the first user (logged in user)
        const user = schema.users.first();
        
        if (!user) {
          return new Response(401, {}, {
            success: false,
            message: "Chưa đăng nhập"
          });
        }

        return {
          success: true,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles,
            avatarUrl: user.avatarUrl
          }
        };
      });

      this.put("/users/profile", (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        const user = schema.users.first();

        if (!user) {
          return new Response(401, {}, {
            success: false,
            message: "Chưa đăng nhập"
          });
        }

        user.update(userData);

        return {
          success: true,
          message: "Cập nhật thông tin thành công",
          data: user.attrs
        };
      });

      this.get("/users", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const users = schema.users.all().models;
        const totalElements = users.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedUsers = users.slice(start, start + size);

        return {
          success: true,
          data: {
            content: paginatedUsers.map(u => ({
              id: u.id,
              username: u.username,
              email: u.email,
              fullName: u.fullName,
              roles: u.roles,
              createdAt: u.createdAt
            })),
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // ========== ORDERS ROUTES ==========
      this.get("/orders", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const orders = schema.orders.all().models;
        const totalElements = orders.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const paginatedOrders = orders.slice(start, start + size);

        return {
          success: true,
          data: {
            content: paginatedOrders.map(o => o.attrs),
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      this.post("/orders", (schema, request) => {
        const orderData = JSON.parse(request.requestBody);
        
        // Get cart items
        const cartItems = schema.cartItems.all().models;
        
        if (cartItems.length === 0) {
          return new Response(400, {}, {
            success: false,
            message: "Giỏ hàng trống"
          });
        }

        // Calculate order total
        let orderItems = cartItems.map(item => {
          const product = item.itemType === "PET"
            ? schema.pets.find(item.itemId)
            : schema.accessories.find(item.itemId);
          
          return {
            itemType: item.itemType,
            itemId: item.itemId,
            name: product?.name || "",
            price: product?.price || 0,
            quantity: item.quantity,
            subtotal: (product?.price || 0) * item.quantity
          };
        });

        const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

        const newOrder = schema.orders.create({
          ...orderData,
          items: orderItems,
          totalAmount,
          status: "PENDING",
          createdAt: new Date().toISOString()
        });

        // Clear cart after order
        schema.cartItems.all().destroy();

        return {
          success: true,
          message: "Đặt hàng thành công",
          data: newOrder.attrs
        };
      });

      this.get("/orders/:id", (schema, request) => {
        const order = schema.orders.find(request.params.id);

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy đơn hàng"
          });
        }

        return {
          success: true,
          data: order.attrs
        };
      });

      this.put("/orders/:id/status", (schema, request) => {
        const order = schema.orders.find(request.params.id);
        const { status } = JSON.parse(request.requestBody);

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Không tìm thấy đơn hàng"
          });
        }

        order.update({ status, updatedAt: new Date().toISOString() });

        return {
          success: true,
          message: "Cập nhật trạng thái đơn hàng thành công",
          data: order.attrs
        };
      });

      // ========== REVIEWS ROUTES ==========
      this.get("/reviews", (schema, request) => {
        const productId = request.queryParams.productId;
        const productType = request.queryParams.productType;

        let reviews = schema.reviews.all().models;

        if (productId && productType) {
          reviews = reviews.filter(r => 
            r.productId === parseInt(productId) && r.productType === productType
          );
        }

        return {
          success: true,
          data: reviews.map(r => r.attrs)
        };
      });

      this.post("/reviews", (schema, request) => {
        const reviewData = JSON.parse(request.requestBody);
        
        const newReview = schema.reviews.create({
          ...reviewData,
          createdAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Thêm đánh giá thành công",
          data: newReview.attrs
        };
      });

      // ========== REPORTS ROUTES (Admin) ==========
      this.get("/reports/dashboard", () => {
        return {
          success: true,
          data: {
            totalPets: 20,
            totalAccessories: 12,
            totalOrders: 156,
            totalRevenue: 125000000,
            totalUsers: 245,
            recentOrders: 12,
            monthlyRevenue: [
              { month: "Jan", revenue: 8500000 },
              { month: "Feb", revenue: 12000000 },
              { month: "Mar", revenue: 9800000 },
              { month: "Apr", revenue: 15200000 },
              { month: "May", revenue: 11500000 },
              { month: "Jun", revenue: 18000000 }
            ],
            topProducts: [
              { name: "Chó Corgi Pembroke", sales: 15, revenue: 225000000 },
              { name: "Mèo Maine Coon", sales: 8, revenue: 280000000 },
              { name: "Thức ăn Royal Canin", sales: 120, revenue: 54000000 }
            ]
          }
        };
      });

      // Passthrough for external requests (Cloudinary, etc.)
      this.passthrough("https://res.cloudinary.com/**");
      this.passthrough("https://api.cloudinary.com/**");
    }
  });

  return server;
}
