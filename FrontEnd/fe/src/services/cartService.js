import * as request from '../utils/request';

export const getCart = async () => {
  return await request.get('/cart');
};

export const addToCart = async (item) => {
  // item: {type, itemId, quantity}
  return await request.post('/cart', item);
};

export const clearCart = async () => {
  return await request.del('/cart');
};