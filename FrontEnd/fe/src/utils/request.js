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

// Response interceptor for handling common responses
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Xử lý lỗi 401 hoặc 403
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('Authentication error:', error.response.status);
        
        // Xóa token và userData
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('userData');
        
        // Dispatch action để cập nhật Redux state (cần import store)
        // store.dispatch(checkLogin(false, null));
        
        // Hiển thị thông báo
        message.error('Your session has expired. Please log in again.');
        
        // Redirect đến trang login sau 1 giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

// Thêm interceptor để tự động gắn token vào mỗi request
request.interceptors.request.use(
  (config) => {
    // Tìm token từ cookie hoặc localStorage
    const token = getCookie("token") || localStorage.getItem('token');
    
    if (token) {
      // Đảm bảo token được định dạng đúng
      // console.log("Using token:", token.substring());
      config.headers.Authorization = `Bearer ${token}`;
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
