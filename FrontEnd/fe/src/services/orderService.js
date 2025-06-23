import * as request from '../utils/request';

export const createOrder = async (orderData) => {
  try {
    console.log('Sending order data to API:', orderData);
    const response = await request.post('/orders', orderData);
    
    console.log('API response:', response);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Error creating order');
    }
    
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await request.get(`/orders/${orderId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Error fetching order');
    }
    
    return response.data;
  } catch (error) {
    console.error('Get order error:', error);
    throw error;
  }
};

export const getUserOrders = async (page = 0, size = 10) => {
  try {
    const response = await request.get('/orders', {
      params: { page, size }
    });
    
    console.log('Orders API response:', response);
    
    // Kiểm tra cấu trúc response và xử lý dữ liệu đúng cách
    if (response && response.success) {
      return response; // Trả về toàn bộ response để component xử lý
    } else {
      throw new Error(response?.message || 'Failed to get orders');
    }
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  return await request.del(`/orders/${orderId}`);
};

export const processPayment = async (orderId, paymentData) => {
  try {
    const response = await request.post(`/orders/${orderId}/payment`, paymentData);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Error processing payment');
    }
    
    return response.data;
  } catch (error) { 
    console.error('Payment error:', error);
    throw error;
  }
};

export const getAllOrders = async (params = {}) => {
  try {
    const response = await request.get('/orders/admin/all', {
      params: {
        status: params.status,
        page: params.page || 0,
        size: params.size || 10,
      }
    });
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get orders');
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await request.put(`/orders/admin/${orderId}/status?status=${status}`);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update order status');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};