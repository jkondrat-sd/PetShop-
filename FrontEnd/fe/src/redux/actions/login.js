// This file contains action creators for managing user login state in a Redux store.

export const checkLogin = (isLoggedIn, userData) => {
  return {
    type: 'CHECK_LOGIN',
    payload: {
      isLoggedIn,
      userData
    }
  };
};

export const updateUserData = (userData) => ({
  type: 'UPDATE_USER_DATA',
  payload: userData
});

export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

// Lấy dữ liệu từ localStorage khi khởi tạo
const getUserDataFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
    return null;
  }
};

const token = document.cookie.includes('token=');

const initialState = {
  isLoggedIn: !!token,
  userData: getUserDataFromStorage()
};