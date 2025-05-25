import * as request from '../utils/request';

export const getBreeds = async (params = {}) => {
  try {
    const response = await request.get('/breeds', {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        name: params.name,
      }
    });
    // Handle both {success, message, data: {content: [...]}} and {content: [...]} structures
    if (response?.data?.content) {
      return response.data; // {content, ...}
    } else if (response?.data?.data?.content) {
      return response.data.data; // {content, ...}
    } else if (response?.content) {
      return response;
    }
    return { content: [] };
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
};

export const getBreedById = async (breedId) => {
  try {
    const response = await request.get(`/breeds/${breedId}`);
    if (response?.data) return response.data;
    return response;
  } catch (error) {
    console.error("Error fetching breed details:", error);
    throw error;
  }
};

export const createBreed = async (breedData) => {
  try {
    const response = await request.post('/breeds', breedData);
    if (response?.data) return response.data;
    return response;
  } catch (error) {
    console.error("Error creating breed:", error);
    throw error;
  }
};

export const updateBreed = async (breedId, breedData) => {
  try {
    const response = await request.put(`/breeds/${breedId}`, breedData);
    if (response?.data) return response.data;
    return response;
  } catch (error) {
    console.error("Error updating breed:", error);
    throw error;
  }
};

export const deleteBreed = async (breedId) => {
  try {
    const response = await request.del(`/breeds/${breedId}`);
    if (response?.data) return response.data;
    return response;
  } catch (error) {
    console.error("Error deleting breed:", error);
    throw error;
  }
};