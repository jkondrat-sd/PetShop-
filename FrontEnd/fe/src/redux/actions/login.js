// This file contains action creators for managing user login state in a Redux store.

export const checkLogin = (isLoggedIn, userData = null) => ({
  type: 'CHECK_LOGIN',
  payload: { isLoggedIn, userData }
});

export const updateUserData = (userData) => ({
  type: 'UPDATE_USER_DATA',
  payload: userData
});