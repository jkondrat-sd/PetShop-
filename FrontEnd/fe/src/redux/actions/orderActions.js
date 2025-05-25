import * as orderService from '~/services/orderService';

export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';

export const fetchOrders = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST });
  try {
    const response = await orderService.getAllOrders(params);
    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ORDERS_FAILURE, payload: error.message });
  }
};
