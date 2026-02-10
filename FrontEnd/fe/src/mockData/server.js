/**
 * ============================================
 * MIRAGEJS MOCK SERVER - PET SHOP
 * ============================================
 * 
 * Mock tất cả các API endpoints của backend
 * Endpoints mapping với BackEnd Spring Boot controllers
 * 
 * CONTROLLERS ĐƯỢC MOCK:
 * - AuthController: /api/auth/*
 * - PetController: /api/pets/*
 * - AccessoryController: /api/accessories/*
 * - CategoryController: /api/categories/*
 * - BreedController: /api/breeds/*
 * - CartController: /api/cart/*
 * - OrderController: /api/orders/*
 * - SearchController: /api/search
 * - ReviewController: /api/reviews/*
 * - ReportController: /api/reports/*
 * - UserController: /api/users/*
 */

import { createServer, Model, Response } from "miragejs";
import {
  petsData,
  accessoriesData,
  categoriesData,
  breedsData,
  usersData,
  salesOverviewData,
  salesChartData,
  topProductsData,
  inventoryPieData,
  lowStockProductsData,
  ordersData,
  reviewsData
} from "./data";

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
      usersData.forEach(user => server.create("user", user));

      // Seed categories
      categoriesData.forEach(cat => server.create("category", cat));

      // Seed breeds
      breedsData.forEach(breed => server.create("breed", breed));

      // Seed pets
      petsData.forEach(pet => server.create("pet", pet));

      // Seed accessories
      accessoriesData.forEach(acc => server.create("accessory", acc));

      // Seed orders
      ordersData.forEach(order => server.create("order", order));

      // Seed reviews
      reviewsData.forEach(review => server.create("review", review));
    },

    routes() {
      this.namespace = "api";
      this.timing = 300; // Simulate network delay

      // ============================================
      // AUTH CONTROLLER - /api/auth/*
      // ============================================
      
      // POST /api/auth/login
      this.post("/auth/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ username, password });

        if (user) {
          return {
            success: true,
            message: "Login successfully",
            data: {
              token: generateToken(),
              id: user.id,
              username: user.username,
              email: user.email,
              roles: user.roles
            }
          };
        }

        return new Response(401, {}, {
          success: false,
          message: "Invalid username or password"
        });
      });

      // POST /api/auth/register
      this.post("/auth/register", (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        
        if (schema.users.findBy({ username: userData.username })) {
          return new Response(400, {}, {
            success: false,
            message: "Username already exists"
          });
        }

        if (schema.users.findBy({ email: userData.email })) {
          return new Response(400, {}, {
            success: false,
            message: "Email already exists"
          });
        }

        const newUser = schema.users.create({
          ...userData,
          role: "USER",
          roles: ["USER"],
          enabled: true
        });

        return {
          success: true,
          message: "Registration successful",
          data: {
            token: generateToken(),
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            roles: ["USER"]
          }
        };
      });

      // ============================================
      // PET CONTROLLER - /api/pets/*
      // ============================================

      // GET /api/pets - Get all pets with pagination
      this.get("/pets", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const type = request.queryParams.type;
        const breedId = request.queryParams.breedId;

        let pets = schema.pets.all().models;

        // Filter by type (DOG/CAT)
        if (type) {
          pets = pets.filter(p => p.type === type);
        }

        // Filter by breedId
        if (breedId) {
          pets = pets.filter(p => p.breedId === parseInt(breedId));
        }

        const totalElements = pets.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = pets.slice(start, start + size).map(p => p.attrs);

        return {
          success: true,
          message: "Pets retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/pets/:id
      this.get("/pets/:id", (schema, request) => {
        const pet = schema.pets.findBy({ petId: parseInt(request.params.id) });

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Pet not found"
          });
        }

        return {
          success: true,
          message: "Pet retrieved successfully",
          data: pet.attrs
        };
      });

      // POST /api/pets (Admin only)
      this.post("/pets", (schema, request) => {
        const petData = JSON.parse(request.requestBody);
        const newPet = schema.pets.create({
          ...petData,
          petId: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Pet created successfully",
          data: newPet.attrs
        };
      });

      // PUT /api/pets/:id (Admin only)
      this.put("/pets/:id", (schema, request) => {
        const pet = schema.pets.findBy({ petId: parseInt(request.params.id) });
        const petData = JSON.parse(request.requestBody);

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Pet not found"
          });
        }

        pet.update({
          ...petData,
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Pet updated successfully",
          data: pet.attrs
        };
      });

      // DELETE /api/pets/:id (Admin only)
      this.delete("/pets/:id", (schema, request) => {
        const pet = schema.pets.findBy({ petId: parseInt(request.params.id) });

        if (!pet) {
          return new Response(404, {}, {
            success: false,
            message: "Pet not found"
          });
        }

        pet.destroy();

        return {
          success: true,
          message: "Pet deleted successfully",
          data: null
        };
      });

      // ============================================
      // ACCESSORY CONTROLLER - /api/accessories/*
      // ============================================

      // GET /api/accessories
      this.get("/accessories", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const status = request.queryParams.status || "active";
        const categoryId = request.queryParams.categoryId;
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

        // Filter by name
        if (name) {
          const lowerName = name.toLowerCase();
          accessories = accessories.filter(a => 
            a.accessoryName && a.accessoryName.toLowerCase().includes(lowerName)
          );
        }

        const totalElements = accessories.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = accessories.slice(start, start + size).map(a => a.attrs);

        return {
          success: true,
          message: "Accessories retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/accessories/:id
      this.get("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.findBy({ accessoryId: parseInt(request.params.id) });

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Accessory not found"
          });
        }

        return {
          success: true,
          message: "Accessory retrieved successfully",
          data: accessory.attrs
        };
      });

      // POST /api/accessories (Admin only)
      this.post("/accessories", (schema, request) => {
        const accData = JSON.parse(request.requestBody);
        const newAcc = schema.accessories.create({
          ...accData,
          accessoryId: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Accessory created successfully",
          data: newAcc.attrs
        };
      });

      // PUT /api/accessories/:id (Admin only)
      this.put("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.findBy({ accessoryId: parseInt(request.params.id) });
        const accData = JSON.parse(request.requestBody);

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Accessory not found"
          });
        }

        accessory.update({
          ...accData,
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Accessory updated successfully",
          data: accessory.attrs
        };
      });

      // DELETE /api/accessories/:id (Admin only)
      this.delete("/accessories/:id", (schema, request) => {
        const accessory = schema.accessories.findBy({ accessoryId: parseInt(request.params.id) });

        if (!accessory) {
          return new Response(404, {}, {
            success: false,
            message: "Accessory not found"
          });
        }

        accessory.destroy();

        return {
          success: true,
          message: "Accessory deleted successfully",
          data: null
        };
      });

      // ============================================
      // CATEGORY CONTROLLER - /api/categories/*
      // ============================================

      // GET /api/categories
      this.get("/categories", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const status = request.queryParams.status || "active";

        let categories = schema.categories.all().models;

        if (status) {
          categories = categories.filter(c => c.status === status);
        }

        const totalElements = categories.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = categories.slice(start, start + size).map(c => c.attrs);

        return {
          success: true,
          message: "Categories retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/categories/:id
      this.get("/categories/:id", (schema, request) => {
        const category = schema.categories.findBy({ categoryId: parseInt(request.params.id) });

        if (!category) {
          return new Response(404, {}, {
            success: false,
            message: "Category not found"
          });
        }

        return {
          success: true,
          message: "Category retrieved successfully",
          data: category.attrs
        };
      });

      // POST /api/categories (Admin only)
      this.post("/categories", (schema, request) => {
        const catData = JSON.parse(request.requestBody);
        const newCat = schema.categories.create({
          ...catData,
          categoryId: Date.now(),
          status: "active"
        });

        return {
          success: true,
          message: "Category created successfully",
          data: newCat.attrs
        };
      });

      // PUT /api/categories/:id (Admin only)
      this.put("/categories/:id", (schema, request) => {
        const category = schema.categories.findBy({ categoryId: parseInt(request.params.id) });
        const catData = JSON.parse(request.requestBody);

        if (!category) {
          return new Response(404, {}, {
            success: false,
            message: "Category not found"
          });
        }

        category.update(catData);

        return {
          success: true,
          message: "Category updated successfully",
          data: category.attrs
        };
      });

      // DELETE /api/categories/:id (Admin only)
      this.delete("/categories/:id", (schema, request) => {
        const category = schema.categories.findBy({ categoryId: parseInt(request.params.id) });

        if (!category) {
          return new Response(404, {}, {
            success: false,
            message: "Category not found"
          });
        }

        category.destroy();

        return {
          success: true,
          message: "Category deleted successfully",
          data: null
        };
      });

      // ============================================
      // BREED CONTROLLER - /api/breeds/*
      // ============================================

      // GET /api/breeds
      this.get("/breeds", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 100;

        const breeds = schema.breeds.all().models;
        const totalElements = breeds.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = breeds.slice(start, start + size).map(b => b.attrs);

        return {
          success: true,
          message: "Breeds retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/breeds/type/:petType
      this.get("/breeds/type/:petType", (schema, request) => {
        const petType = request.params.petType.toUpperCase();
        const breeds = schema.breeds.all().models.filter(b => b.petType === petType);

        return {
          success: true,
          message: "Breeds retrieved successfully",
          data: breeds.map(b => b.attrs)
        };
      });

      // GET /api/breeds/:id
      this.get("/breeds/:id", (schema, request) => {
        const breed = schema.breeds.find(request.params.id);

        if (!breed) {
          return new Response(404, {}, {
            success: false,
            message: "Breed not found"
          });
        }

        return {
          success: true,
          message: "Breed retrieved successfully",
          data: breed.attrs
        };
      });

      // POST /api/breeds (Admin only)
      this.post("/breeds", (schema, request) => {
        const breedData = JSON.parse(request.requestBody);
        const newBreed = schema.breeds.create({
          ...breedData,
          status: "active"
        });

        return {
          success: true,
          message: "Breed created successfully",
          data: newBreed.attrs
        };
      });

      // ============================================
      // CART CONTROLLER - /api/cart/*
      // ============================================

      // GET /api/cart
      this.get("/cart", (schema) => {
        const cartItems = schema.cartItems.all().models;
        
        let items = cartItems.map(item => {
          let product = null;
          
          if (item.itemType === "PET") {
            product = schema.pets.findBy({ petId: item.itemId });
          } else {
            product = schema.accessories.findBy({ accessoryId: item.itemId });
          }

          const price = product?.unitPrice || 0;
          const name = item.itemType === "PET" ? product?.petName : product?.accessoryName;

          return {
            itemType: item.itemType,
            itemId: item.itemId,
            name: name || "",
            thumbnail: product?.thumbnail || "",
            price,
            quantity: item.quantity,
            subtotal: price * item.quantity
          };
        });

        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          success: true,
          message: "Cart retrieved successfully",
          data: {
            items,
            totalAmount,
            totalItems
          }
        };
      });

      // POST /api/cart
      this.post("/cart", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const items = requestData.items || [requestData];

        items.forEach(item => {
          const existingItem = schema.cartItems.findBy({
            itemType: item.itemType,
            itemId: item.itemId
          });

          if (item.quantity === 0 && existingItem) {
            existingItem.destroy();
          } else if (existingItem) {
            existingItem.update({ quantity: item.quantity });
          } else if (item.quantity > 0) {
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
            ? schema.pets.findBy({ petId: item.itemId })
            : schema.accessories.findBy({ accessoryId: item.itemId });
          
          const price = product?.unitPrice || 0;
          const name = item.itemType === "PET" ? product?.petName : product?.accessoryName;
          
          return {
            itemType: item.itemType,
            itemId: item.itemId,
            name: name || "",
            thumbnail: product?.thumbnail || "",
            price,
            quantity: item.quantity,
            subtotal: price * item.quantity
          };
        });

        const totalAmount = cartData.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

        return {
          success: true,
          message: "Cart processed successfully",
          data: {
            items: cartData,
            totalAmount,
            totalItems
          }
        };
      });

      // DELETE /api/cart
      this.delete("/cart", (schema) => {
        schema.cartItems.all().destroy();

        return {
          success: true,
          message: "Cart cleared successfully",
          data: null
        };
      });

      // ============================================
      // ORDER CONTROLLER - /api/orders/*
      // ============================================

      // POST /api/orders
      this.post("/orders", (schema, request) => {
        const orderData = JSON.parse(request.requestBody);
        const cartItems = schema.cartItems.all().models;
        
        if (cartItems.length === 0) {
          return new Response(400, {}, {
            success: false,
            message: "Cart is empty"
          });
        }

        let orderDetails = cartItems.map(item => {
          const product = item.itemType === "PET"
            ? schema.pets.findBy({ petId: item.itemId })
            : schema.accessories.findBy({ accessoryId: item.itemId });
          
          const name = item.itemType === "PET" ? product?.petName : product?.accessoryName;
          
          return {
            id: Date.now() + Math.random(),
            itemType: item.itemType.toLowerCase(),
            itemId: item.itemId,
            name: name || "",
            thumbnail: product?.thumbnail || "",
            unitPrice: product?.unitPrice || 0,
            quantity: item.quantity,
            discount: 0,
            subtotal: (product?.unitPrice || 0) * item.quantity
          };
        });

        const totalAmount = orderDetails.reduce((sum, item) => sum + item.subtotal, 0);

        const newOrder = schema.orders.create({
          id: Date.now(),
          userId: 1,
          userName: "User",
          orderDate: new Date().toISOString(),
          shippedDate: null,
          totalAmount,
          freight: orderData.freight || 0,
          shipName: orderData.shipName,
          shipAddress: orderData.shipAddress,
          status: "PENDING",
          orderDetails
        });

        // Clear cart
        schema.cartItems.all().destroy();

        return {
          success: true,
          message: "Order created successfully",
          data: newOrder.attrs
        };
      });

      // GET /api/orders (User's orders)
      this.get("/orders", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const orders = schema.orders.all().models;
        const totalElements = orders.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = orders.slice(start, start + size).map(o => o.attrs);

        return {
          success: true,
          message: "Orders retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/orders/:id
      this.get("/orders/:id", (schema, request) => {
        const order = schema.orders.find(request.params.id);

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Order not found"
          });
        }

        return {
          success: true,
          message: "Order retrieved successfully",
          data: order.attrs
        };
      });

      // DELETE /api/orders/:id (Cancel order)
      this.delete("/orders/:id", (schema, request) => {
        const order = schema.orders.find(request.params.id);

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Order not found"
          });
        }

        order.update({ status: "CANCELLED" });

        return {
          success: true,
          message: "Order cancelled successfully",
          data: null
        };
      });

      // POST /api/orders/:id/payment
      this.post("/orders/:id/payment", (schema, request) => {
        const order = schema.orders.find(request.params.id);

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Order not found"
          });
        }

        order.update({ status: "PAID" });

        return {
          success: true,
          message: "Thanh toán thành công",
          data: {
            orderId: order.id,
            status: "SUCCESS",
            transactionId: "TXN" + Date.now()
          }
        };
      });

      // GET /api/orders/admin/all (Admin only)
      this.get("/orders/admin/all", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const status = request.queryParams.status;

        let orders = schema.orders.all().models;

        if (status) {
          orders = orders.filter(o => o.status === status);
        }

        const totalElements = orders.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = orders.slice(start, start + size).map(o => o.attrs);

        return {
          success: true,
          message: "Orders retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // PUT /api/orders/admin/:id/status (Admin only)
      this.put("/orders/admin/:id/status", (schema, request) => {
        const order = schema.orders.find(request.params.id);
        const status = request.queryParams.status;

        if (!order) {
          return new Response(404, {}, {
            success: false,
            message: "Order not found"
          });
        }

        order.update({ status });

        return {
          success: true,
          message: "Order status updated successfully",
          data: order.attrs
        };
      });

      // ============================================
      // SEARCH CONTROLLER - /api/search
      // ============================================

      // GET /api/search
      this.get("/search", (schema, request) => {
        const query = request.queryParams.query || "";

        if (!query) {
          return {
            success: true,
            message: "Search results",
            data: []
          };
        }

        const lowerQuery = query.toLowerCase();

        // Search pets
        const pets = schema.pets.all().models.filter(p =>
          (p.petName && p.petName.toLowerCase().includes(lowerQuery)) ||
          (p.breed && p.breed.toLowerCase().includes(lowerQuery))
        ).map(p => ({ ...p.attrs, productType: "PET" }));

        // Search accessories
        const accessories = schema.accessories.all().models.filter(a =>
          (a.accessoryName && a.accessoryName.toLowerCase().includes(lowerQuery)) ||
          (a.description && a.description.toLowerCase().includes(lowerQuery))
        ).map(a => ({ ...a.attrs, productType: "ACCESSORY" }));

        return {
          success: true,
          message: "Search results",
          data: [...pets, ...accessories]
        };
      });

      // GET /api/search/pets
      this.get("/search/pets", (schema, request) => {
        const query = request.queryParams.query || request.queryParams.q || "";
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        let pets = schema.pets.all().models;
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          pets = pets.filter(p =>
            (p.petName && p.petName.toLowerCase().includes(lowerQuery)) ||
            (p.breed && p.breed.toLowerCase().includes(lowerQuery))
          );
        }

        const totalElements = pets.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = pets.slice(start, start + size).map(p => p.attrs);

        return {
          success: true,
          message: "Search results",
          data: { content, page, size, totalElements, totalPages }
        };
      });

      // GET /api/search/accessories
      this.get("/search/accessories", (schema, request) => {
        const query = request.queryParams.query || request.queryParams.q || "";
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        let accessories = schema.accessories.all().models;
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          accessories = accessories.filter(a =>
            (a.accessoryName && a.accessoryName.toLowerCase().includes(lowerQuery)) ||
            (a.description && a.description.toLowerCase().includes(lowerQuery))
          );
        }

        const totalElements = accessories.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = accessories.slice(start, start + size).map(a => a.attrs);

        return {
          success: true,
          message: "Search results",
          data: { content, page, size, totalElements, totalPages }
        };
      });

      // ============================================
      // ROLE CONTROLLER - /api/roles/*
      // ============================================

      // GET /api/roles
      this.get("/roles", () => {
        return {
          success: true,
          message: "Roles retrieved successfully",
          data: [
            { name: "ADMIN", description: "Administrator" },
            { name: "USER", description: "Regular User" }
          ]
        };
      });

      // POST /api/roles
      this.post("/roles", (schema, request) => {
        const roleData = JSON.parse(request.requestBody);
        return {
          success: true,
          message: "Role created successfully",
          data: roleData
        };
      });

      // PUT /api/roles/:name
      this.put("/roles/:name", (schema, request) => {
        const roleData = JSON.parse(request.requestBody);
        return {
          success: true,
          message: "Role updated successfully",
          data: { name: request.params.name, ...roleData }
        };
      });

      // ============================================
      // USER CONTROLLER - /api/users/*
      // ============================================

      // GET /api/users/profile
      this.get("/users/profile", (schema) => {
        const user = schema.users.first();
        
        if (!user) {
          return new Response(401, {}, {
            success: false,
            message: "Unauthorized"
          });
        }

        return {
          success: true,
          message: "Profile retrieved successfully",
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address,
            avatarUrl: user.avatarUrl,
            role: user.role,
            enabled: user.enabled
          }
        };
      });

      // PUT /api/users/profile
      this.put("/users/profile", (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        const user = schema.users.first();

        if (!user) {
          return new Response(401, {}, {
            success: false,
            message: "Unauthorized"
          });
        }

        user.update(userData);

        return {
          success: true,
          message: "Profile updated successfully",
          data: user.attrs
        };
      });

      // POST /api/users/change-password
      this.post("/users/change-password", () => {
        return {
          success: true,
          message: "Password changed successfully",
          data: null
        };
      });

      // PUT /api/users/change-password (alternative)
      this.put("/users/change-password", () => {
        return {
          success: true,
          message: "Password changed successfully",
          data: null
        };
      });

      // PUT /api/users/:id (Admin update user)
      this.put("/users/:id", (schema, request) => {
        const user = schema.users.find(request.params.id);
        const userData = JSON.parse(request.requestBody);

        if (!user) {
          return new Response(404, {}, {
            success: false,
            message: "User not found"
          });
        }

        user.update(userData);

        return {
          success: true,
          message: "User updated successfully",
          data: user.attrs
        };
      });

      // POST /api/users/avatar
      this.post("/users/avatar", (schema) => {
        const user = schema.users.first();
        
        return {
          success: true,
          message: "Avatar updated successfully",
          data: {
            avatarUrl: user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
          }
        };
      });

      // GET /api/users/admin/all (Admin only)
      this.get("/users/admin/all", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const users = schema.users.all().models;
        const totalElements = users.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = users.slice(start, start + size).map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          enabled: u.enabled
        }));

        return {
          success: true,
          message: "Users retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // PUT /api/users/admin/:userId/block
      this.put("/users/admin/:userId/block", (schema, request) => {
        const user = schema.users.find(request.params.userId);

        if (!user) {
          return new Response(404, {}, {
            success: false,
            message: "User not found"
          });
        }

        user.update({ enabled: false });

        return {
          success: true,
          message: "User blocked successfully",
          data: user.attrs
        };
      });

      // PUT /api/users/admin/:userId/unblock
      this.put("/users/admin/:userId/unblock", (schema, request) => {
        const user = schema.users.find(request.params.userId);

        if (!user) {
          return new Response(404, {}, {
            success: false,
            message: "User not found"
          });
        }

        user.update({ enabled: true });

        return {
          success: true,
          message: "User unblocked successfully",
          data: user.attrs
        };
      });

      // GET /api/users/admin/:userId
      this.get("/users/admin/:userId", (schema, request) => {
        const user = schema.users.find(request.params.userId);

        if (!user) {
          return new Response(404, {}, {
            success: false,
            message: "User not found"
          });
        }

        return {
          success: true,
          message: "User retrieved successfully",
          data: user.attrs
        };
      });

      // ============================================
      // REVIEW CONTROLLER - /api/reviews/*
      // ============================================

      // GET /api/reviews - List all reviews
      this.get("/reviews", (schema, request) => {
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;
        const petId = request.queryParams.petId;
        const accessoryId = request.queryParams.accessoryId;

        let reviews = schema.reviews.all().models;

        if (petId) {
          reviews = reviews.filter(r => r.petId === parseInt(petId));
        }
        if (accessoryId) {
          reviews = reviews.filter(r => r.accessoryId === parseInt(accessoryId));
        }

        const totalElements = reviews.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = reviews.slice(start, start + size).map(r => r.attrs);

        return {
          success: true,
          message: "Reviews retrieved successfully",
          data: { content, page, size, totalElements, totalPages }
        };
      });

      // GET /api/reviews/:reviewId - Get single review
      this.get("/reviews/:reviewId", (schema, request) => {
        const reviewId = parseInt(request.params.reviewId);
        const review = schema.reviews.findBy({ reviewId });

        if (!review) {
          return new Response(404, {}, {
            success: false,
            message: "Review not found"
          });
        }

        return {
          success: true,
          message: "Review retrieved successfully",
          data: review.attrs
        };
      });

      // GET /api/pets/:petId/reviews - Get reviews for a pet
      this.get("/pets/:petId/reviews", (schema, request) => {
        const petId = parseInt(request.params.petId);
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const reviews = schema.reviews.all().models.filter(r => r.petId === petId);
        const totalElements = reviews.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = reviews.slice(start, start + size).map(r => r.attrs);

        return {
          success: true,
          message: "Reviews retrieved successfully",
          data: { content, page, size, totalElements, totalPages }
        };
      });

      // GET /api/accessories/:accessoryId/reviews - Get reviews for an accessory
      this.get("/accessories/:accessoryId/reviews", (schema, request) => {
        const accessoryId = parseInt(request.params.accessoryId);
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const reviews = schema.reviews.all().models.filter(r => r.accessoryId === accessoryId);
        const totalElements = reviews.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = reviews.slice(start, start + size).map(r => r.attrs);

        return {
          success: true,
          message: "Reviews retrieved successfully",
          data: { content, page, size, totalElements, totalPages }
        };
      });

      // GET /api/reviews/pet/:petId
      this.get("/reviews/pet/:petId", (schema, request) => {
        const petId = parseInt(request.params.petId);
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const reviews = schema.reviews.all().models.filter(r => r.petId === petId);
        const totalElements = reviews.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = reviews.slice(start, start + size).map(r => r.attrs);

        return {
          success: true,
          message: "Reviews retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // GET /api/reviews/accessory/:accessoryId
      this.get("/reviews/accessory/:accessoryId", (schema, request) => {
        const accessoryId = parseInt(request.params.accessoryId);
        const page = parseInt(request.queryParams.page) || 0;
        const size = parseInt(request.queryParams.size) || 10;

        const reviews = schema.reviews.all().models.filter(r => r.accessoryId === accessoryId);
        const totalElements = reviews.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = reviews.slice(start, start + size).map(r => r.attrs);

        return {
          success: true,
          message: "Reviews retrieved successfully",
          data: {
            content,
            page,
            size,
            totalElements,
            totalPages
          }
        };
      });

      // POST /api/reviews
      this.post("/reviews", (schema, request) => {
        const reviewData = JSON.parse(request.requestBody);
        
        const newReview = schema.reviews.create({
          ...reviewData,
          reviewId: Date.now(),
          userId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Review created successfully",
          data: newReview.attrs
        };
      });

      // PUT /api/reviews/:id
      this.put("/reviews/:id", (schema, request) => {
        const review = schema.reviews.find(request.params.id);
        const reviewData = JSON.parse(request.requestBody);

        if (!review) {
          return new Response(404, {}, {
            success: false,
            message: "Review not found"
          });
        }

        review.update({
          ...reviewData,
          updatedAt: new Date().toISOString()
        });

        return {
          success: true,
          message: "Review updated successfully",
          data: review.attrs
        };
      });

      // DELETE /api/reviews/:id
      this.delete("/reviews/:id", (schema, request) => {
        const review = schema.reviews.find(request.params.id);

        if (!review) {
          return new Response(404, {}, {
            success: false,
            message: "Review not found"
          });
        }

        review.destroy();

        return {
          success: true,
          message: "Review deleted successfully",
          data: null
        };
      });

      // ============================================
      // REPORT CONTROLLER - /api/reports/* (Admin)
      // ============================================

      // GET /api/reports/sales/overview
      this.get("/reports/sales/overview", () => {
        return {
          success: true,
          message: "Success",
          data: salesOverviewData
        };
      });

      // GET /api/reports/sales/chart
      this.get("/reports/sales/chart", () => {
        return {
          success: true,
          message: "Success",
          data: salesChartData
        };
      });

      // GET /api/reports/sales/top-products
      this.get("/reports/sales/top-products", () => {
        return {
          success: true,
          message: "Success",
          data: topProductsData
        };
      });

      // GET /api/reports/inventory/pie
      this.get("/reports/inventory/pie", () => {
        return {
          success: true,
          message: "Success",
          data: inventoryPieData
        };
      });

      // GET /api/reports/inventory/low-stock
      this.get("/reports/inventory/low-stock", () => {
        return {
          success: true,
          message: "Success",
          data: lowStockProductsData
        };
      });

      // ============================================
      // PASSTHROUGH (External requests)
      // ============================================
      this.passthrough("https://res.cloudinary.com/**");
      this.passthrough("https://api.cloudinary.com/**");
      this.passthrough("https://images.unsplash.com/**");
    }
  });

  return server;
}
