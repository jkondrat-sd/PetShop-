import * as request from "~/utils/request";
import { getCookie } from "~/helpers/cookie";

// Get Users list with pagination
export const getUsers = async (page = 0, size = 10) => {
  try {
    const response = await request.get(`users`, {
      params: {
        page,
        size,
      },
    });
    return response; // Return pagination result from API
  } catch (error) {
    throw error;
  }
};

// Get user details by ID
export const getUserById = async (userId) => {
  try {
    const response = await request.get(`users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (id, data) => {
  try {
    // Debug
    // console.log(`Updating user ${id} with:`, data);
    
    // Đảm bảo các headers được đặt đúng để xử lý FormData
    const response = await request.put(`users/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // console.log('Update response:', response);
    return response;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await request.del(`users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Lock/Unlock user
export const toggleUserStatus = async (id, status) => {
  try {
    const response = await request.patch(`users/${id}/status`, { status });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await request.get('/users/profile');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (data) => {
  try {
    // Không cần thêm token thủ công vì đã được xử lý bởi interceptor
    const response = await request.put('/users/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    });
    
    return response;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Thêm hàm để upload avatar
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Thêm hàm để cập nhật thông tin profile (bao gồm avatarUrl)
export const updateProfile = async (profileData) => {
  try {
    const response = await request.put('/users/profile', profileData);
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};