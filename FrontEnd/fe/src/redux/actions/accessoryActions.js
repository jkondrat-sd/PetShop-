import * as accessoryService from '~/services/accessoryService';

// Action Types
export const FETCH_ACCESSORIES_REQUEST = 'FETCH_ACCESSORIES_REQUEST';
export const FETCH_ACCESSORIES_SUCCESS = 'FETCH_ACCESSORIES_SUCCESS';
export const FETCH_ACCESSORIES_FAILURE = 'FETCH_ACCESSORIES_FAILURE';

export const FETCH_ACCESSORY_DETAIL_REQUEST = 'FETCH_ACCESSORY_DETAIL_REQUEST';
export const FETCH_ACCESSORY_DETAIL_SUCCESS = 'FETCH_ACCESSORY_DETAIL_SUCCESS';
export const FETCH_ACCESSORY_DETAIL_FAILURE = 'FETCH_ACCESSORY_DETAIL_FAILURE';

// Fetch list
export const fetchAccessories = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ACCESSORIES_REQUEST });
  try {
    const data = await accessoryService.getAccessories(params);
    dispatch({ type: FETCH_ACCESSORIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_ACCESSORIES_FAILURE, payload: error.message });
  }
};

// Fetch detail
export const fetchAccessoryDetail = (id) => async (dispatch) => {
  dispatch({ type: FETCH_ACCESSORY_DETAIL_REQUEST });
  try {
    const data = await accessoryService.getAccessoryById(id);
    dispatch({ type: FETCH_ACCESSORY_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_ACCESSORY_DETAIL_FAILURE, payload: error.message });
  }
};
