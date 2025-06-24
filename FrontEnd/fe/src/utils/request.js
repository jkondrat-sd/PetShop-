import axios from "axios";
import { message } from "antd";

import { getCookie } from "~/helpers/cookie";

const request = axios.create({
  baseURL: "http://localhost:8089/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // timeout: 10000, // 10 seconds timeout
});

// Đảm bảo request.interceptors.request.use đang xử lý token đúng cách
request.interceptors.request.use(
  (config) => {
    // Không gắn token cho các API public
    if (
      config.url.includes('/auth/register') ||
      config.url.includes('/auth/login')
    ) {
      return config;
    }
    const token = getCookie('token');
    if (token) {
      console.log('Using token: Valid token present');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No authentication token found');
      // Nếu là API cần authentication, có thể redirect đến trang login
      if (config.url.includes('/cart') || config.url.includes('/orders')) {
        // Có thể xử lý chuyển hướng hoặc thông báo ở đây
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cập nhật interceptor response để xử lý chi tiết lỗi từ server
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Lấy thông tin chi tiết về lỗi
      const statusCode = error.response.status;
      const responseData = error.response.data;
      
      console.error('API Error:', {
        status: statusCode,
        url: error.config.url,
        method: error.config.method,
        data: responseData
      });
      
      // Xử lý các loại lỗi cụ thể
      if (statusCode === 401) {
        console.log('Authentication error - redirecting to login');
        // Có thể redirect đến trang đăng nhập hoặc refresh token ở đây
      } else if (statusCode === 500) {
        console.error('Server error:', responseData);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request configuration error:', error.message);
    }
    
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
