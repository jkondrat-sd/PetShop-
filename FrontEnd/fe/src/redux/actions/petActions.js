import { 
  getPets, 
  getPetById,
  createPet,
  updatePet,
  deletePet
} from '../../services/petService';

// Action Types
export const PET_ACTIONS = {
  FETCH_PETS_REQUEST: 'FETCH_PETS_REQUEST',
  FETCH_PETS_SUCCESS: 'FETCH_PETS_SUCCESS',
  FETCH_PETS_FAILURE: 'FETCH_PETS_FAILURE',
  
  FETCH_PET_REQUEST: 'FETCH_PET_REQUEST',
  FETCH_PET_SUCCESS: 'FETCH_PET_SUCCESS',
  FETCH_PET_FAILURE: 'FETCH_PET_FAILURE',
  
  CREATE_PET_REQUEST: 'CREATE_PET_REQUEST',
  CREATE_PET_SUCCESS: 'CREATE_PET_SUCCESS',
  CREATE_PET_FAILURE: 'CREATE_PET_FAILURE',
  
  UPDATE_PET_REQUEST: 'UPDATE_PET_REQUEST',
  UPDATE_PET_SUCCESS: 'UPDATE_PET_SUCCESS',
  UPDATE_PET_FAILURE: 'UPDATE_PET_FAILURE',
  
  DELETE_PET_REQUEST: 'DELETE_PET_REQUEST',
  DELETE_PET_SUCCESS: 'DELETE_PET_SUCCESS',
  DELETE_PET_FAILURE: 'DELETE_PET_FAILURE',
  
  CLEAR_PET_ERROR: 'CLEAR_PET_ERROR',
  RESET_PET_STATE: 'RESET_PET_STATE'
};

// Thunk actions
export const fetchPets = (params = {}) => async (dispatch) => {
  dispatch({ type: PET_ACTIONS.FETCH_PETS_REQUEST });
  
  try {
    const response = await getPets(params);
    console.log("Full API response:", response);
    
    // Extract the correct pet data structure
    // If response has nested data property that contains our pet content
    const petData = response.data?.data || response.data || response;
    
    dispatch({
      type: PET_ACTIONS.FETCH_PETS_SUCCESS,
      payload: petData
    });
    return response;
  } catch (error) {
    dispatch({
      type: PET_ACTIONS.FETCH_PETS_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

export const fetchPetById = (petId) => async (dispatch) => {
  dispatch({ type: PET_ACTIONS.FETCH_PET_REQUEST });
  
  try {
    const response = await getPetById(petId);
    dispatch({
      type: PET_ACTIONS.FETCH_PET_SUCCESS,
      payload: response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: PET_ACTIONS.FETCH_PET_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const createNewPet = (petData, thumbnailFile, imageFiles) => async (dispatch) => {
  dispatch({ type: PET_ACTIONS.CREATE_PET_REQUEST });
  
  try {
    const response = await createPet(petData, thumbnailFile, imageFiles);
    dispatch({
      type: PET_ACTIONS.CREATE_PET_SUCCESS,
      payload: response.data
    });
    return response;
  } catch (error) {
    dispatch({
      type: PET_ACTIONS.CREATE_PET_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

export const updateExistingPet = (petId, petData, thumbnailFile, imageFiles) => async (dispatch) => {
  dispatch({ type: PET_ACTIONS.UPDATE_PET_REQUEST });
  
  try {
    const response = await updatePet(petId, petData, thumbnailFile, imageFiles);
    dispatch({
      type: PET_ACTIONS.UPDATE_PET_SUCCESS,
      payload: response.data
    });
    return response;
  } catch (error) {
    dispatch({
      type: PET_ACTIONS.UPDATE_PET_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

export const removePet = (petId) => async (dispatch) => {
  dispatch({ type: PET_ACTIONS.DELETE_PET_REQUEST });
  
  try {
    await deletePet(petId);
    dispatch({
      type: PET_ACTIONS.DELETE_PET_SUCCESS,
      payload: petId
    });
  } catch (error) {
    dispatch({
      type: PET_ACTIONS.DELETE_PET_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

export const clearPetError = () => ({
  type: PET_ACTIONS.CLEAR_PET_ERROR
});

export const resetPetState = () => ({
  type: PET_ACTIONS.RESET_PET_STATE
});