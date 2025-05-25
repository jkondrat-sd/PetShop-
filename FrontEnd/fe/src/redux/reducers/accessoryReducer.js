import {
  FETCH_ACCESSORIES_REQUEST,
  FETCH_ACCESSORIES_SUCCESS,
  FETCH_ACCESSORIES_FAILURE,
  FETCH_ACCESSORY_DETAIL_REQUEST,
  FETCH_ACCESSORY_DETAIL_SUCCESS,
  FETCH_ACCESSORY_DETAIL_FAILURE,
} from '../actions/accessoryActions';

const initialState = {
  loading: false,
  list: [],
  pagination: {},
  error: null,
  detail: null,
  detailLoading: false,
  detailError: null,
};

const accessoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCESSORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ACCESSORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.content || [],
        pagination: {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        },
        error: null,
      };
    case FETCH_ACCESSORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ACCESSORY_DETAIL_REQUEST:
      return { ...state, detailLoading: true, detailError: null };
    case FETCH_ACCESSORY_DETAIL_SUCCESS:
      return { ...state, detailLoading: false, detail: action.payload, detailError: null };
    case FETCH_ACCESSORY_DETAIL_FAILURE:
      return { ...state, detailLoading: false, detailError: action.payload };

    default:
      return state;
  }
};

export default accessoryReducer;
