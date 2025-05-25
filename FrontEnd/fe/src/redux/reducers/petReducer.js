import { PET_ACTIONS } from '../actions/petActions';

const initialState = {
  pets: [],
  currentPet: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  },
  loading: false,
  error: null,
  operationLoading: false
};

const petReducer = (state = initialState, action) => {
  switch (action.type) {
    case PET_ACTIONS.FETCH_PETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case PET_ACTIONS.FETCH_PETS_SUCCESS:
      return {
        ...state,
        loading: false,
        pets: Array.isArray(action.payload?.content) ? action.payload.content : [],
        pagination: {
          page: action.payload?.page || 0,
          size: action.payload?.size || 10,
          totalElements: action.payload?.totalElements || 0,
          totalPages: action.payload?.totalPages || 0
        }
      };
      
    case PET_ACTIONS.FETCH_PETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case PET_ACTIONS.FETCH_PET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case PET_ACTIONS.FETCH_PET_SUCCESS:
      return {
        ...state,
        loading: false,
        currentPet: action.payload || null
      };
      
    case PET_ACTIONS.FETCH_PET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case PET_ACTIONS.CREATE_PET_REQUEST:
    case PET_ACTIONS.UPDATE_PET_REQUEST:
    case PET_ACTIONS.DELETE_PET_REQUEST:
      return {
        ...state,
        operationLoading: true,
        error: null
      };
      
    case PET_ACTIONS.CREATE_PET_SUCCESS:
      return {
        ...state,
        operationLoading: false,
        pets: [action.payload, ...state.pets].filter(Boolean)
      };
      
    case PET_ACTIONS.UPDATE_PET_SUCCESS:
      return {
        ...state,
        operationLoading: false,
        pets: state.pets.map(pet => 
          pet.petId === action.payload?.petId ? action.payload : pet
        ).filter(Boolean),
        currentPet: action.payload || null
      };
      
    case PET_ACTIONS.DELETE_PET_SUCCESS:
      return {
        ...state,
        operationLoading: false,
        pets: state.pets.filter(pet => pet.petId !== action.payload)
      };
      
    case PET_ACTIONS.CREATE_PET_FAILURE:
    case PET_ACTIONS.UPDATE_PET_FAILURE:
    case PET_ACTIONS.DELETE_PET_FAILURE:
      return {
        ...state,
        operationLoading: false,
        error: action.payload
      };
      
    case PET_ACTIONS.CLEAR_PET_ERROR:
      return {
        ...state,
        error: null
      };
      
    case PET_ACTIONS.RESET_PET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

export default petReducer;