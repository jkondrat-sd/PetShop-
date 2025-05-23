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
  try {
    // Changed from request.delete to request.del
    const response = await request.del(`/orders/${orderId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Error cancelling order');
    }
    
    return response;
  } catch (error) {
    console.error('Cancel order error:', error);
    throw error;
  }
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