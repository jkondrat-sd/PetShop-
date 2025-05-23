import * as request from '~/utils/request';
import { setCookie, getCookie } from '~/helpers/cookie';

export const login = async (username, password) => {
  try {
    const response = await request.post('/auth/login', {
      username,
      password
    });
    
    if (response && response.success) {
      const userData = response.data;
      
      // Lưu token vào cookie
      setCookie('token', userData.token);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('userData', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        roles: userData.roles,
        fullName: userData.fullName || userData.username,
        avatarUrl: userData.avatarUrl || ''
      }));
      
      return userData;
    } else {
      throw new Error(response?.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await request.get('/users/profile');
    
    // Trả về toàn bộ response để xử lý ở component
    return response;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await request.post('/auth/register', userData);
    
    if (!response || response.success === false) {
      throw new Error(response?.message || 'Registration failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const uploadAvatar = async (formData) => {
  try {
    const response = await request.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Upload avatar response:', response);
    return response;
  } catch (error) {
    console.error('Upload avatar error:', error);
    throw error;
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const response = await request.put('/users/profile', userData);
    console.log('Update user info response:', response);
    return response;
  } catch (error) {
    console.error('Update user info error:', error);
    throw error;
  }
};