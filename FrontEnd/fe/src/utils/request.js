import axios from "axios";
import { message } from "antd";

import { getCookie } from "~/helpers/cookie";

const request = axios.create({
  baseURL: "http://localhost:8088",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // timeout: 10000, // 10 seconds timeout
});

// Response interceptor for handling common responses
request.interceptors.response.use(
  (response) => response.data,
  // (error) => {
  //   if (error.response) {
  //     const { status } = error.response;

  //     switch (status) {
  //       case 401:
  //         message.error("Phiên đăng nhập đã hết hạn", 3);
  //         break;
  //       case 403:
  //         message.error("Bạn không có quyền truy cập", 3);
  //         break;
  //       case 404:
  //         message.error("Không tìm thấy tài nguyên", 3);
  //         break;
  //       case 500:
  //         message.error("Lỗi hệ thống, vui lòng thử lại sau", 3);
  //         break;
  //       default:
  //         message.error(error.response.data.message || "Có lỗi xảy ra", 3);
  //         break;
  //     }
  //   }
  //   return Promise.reject(error);
  // }
);

// Thêm interceptor để tự động gắn token vào mỗi request
request.interceptors.request.use(
  (config) => {
    // Tìm token từ cookie hoặc localStorage
    const token = getCookie("token") || localStorage.getItem('token');
    
    if (token) {
      // Đảm bảo token được định dạng đúng
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers["Authorization"] = formattedToken;
    } else {
      console.warn("No authentication token available");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = async (path, params = {}) => {
  try {
    const response = await request.get(path, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (path, data = {}, config = {}) => {
  try {
    return await request.post(path, data, config);
  } catch (error) {
    throw error;
  }
};

export const put = async (path, data = {}, config = {}) => {
  try {
    return await request.put(path, data, config);
  } catch (error) {
    throw error;
  }
};

export const patch = async (path, data = {}, config = {}) => {
  try {
    return await request.patch(path, data, config);
  } catch (error) {
    throw error;
  }
};

export const del = async (path, config = {}) => {
  try {
    return await request.delete(path, config);
  } catch (error) {
    throw error;
  }
};

export default request;
