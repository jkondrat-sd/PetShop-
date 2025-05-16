import { setCookie } from "~/helpers/cookie";
import * as request from "~/utils/request";

export const login = async (username, password) => {
  try {
    // Kiểm tra đường dẫn này có đúng với backend không
    const response = await request.post(`/auth/login`, {
      username: username,
      password: password,
    });

    // Log ra để kiểm tra cấu trúc dữ liệu trả về
    // console.log("Login response:", response);
    if (response && response.accessToken) {
      setCookie("token", response.accessToken, 1); // Lưu trong 1 ngày
    }

    return response;
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

// Thêm hàm để lấy thông tin user sau khi đã đăng nhập thành công

// Đảm bảo endpoint này đúng với backend
export const getUserInfo = async () => {
  try {
    // Sửa endpoint này theo đúng API của backend
    const response = await request.get('/users/my-info');
    // console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};