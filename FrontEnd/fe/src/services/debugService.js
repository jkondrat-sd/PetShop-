import * as request from '../utils/request';

export const checkRedisCart = async () => {
  try {
    const response = await request.get('/redis-debug/cart-key');
    console.log('Redis Debug Result:', response);
    return response;
  } catch (error) {
    console.error('Redis debug error:', error);
    throw error;
  }
};