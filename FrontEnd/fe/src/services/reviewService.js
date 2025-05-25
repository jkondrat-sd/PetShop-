import * as request from '../utils/request';

export const getReviews = async (params = {}) => {
  try {
    const response = await request.get('/reviews', {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        petId: params.petId,
        accessoryId: params.accessoryId,
        userId: params.userId,
        rating: params.rating
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch reviews');
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const response = await request.get(`/reviews/${reviewId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch review details');
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching review details:", error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await request.post('/reviews', reviewData);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create review');
    }
    
    return response;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await request.put(`/reviews/${reviewId}`, reviewData);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update review');
    }
    
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await request.del(`/reviews/${reviewId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete review');
    }
    
    return response;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getPetReviews = async (petId, params = {}) => {
  try {
    const response = await request.get(`/pets/${petId}/reviews`, {
      params: {
        page: params.page || 0,
        size: params.size || 10
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch pet reviews');
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching pet reviews:", error);
    throw error;
  }
};

export const getAccessoryReviews = async (accessoryId, params = {}) => {
  try {
    const response = await request.get(`/accessories/${accessoryId}/reviews`, {
      params: {
        page: params.page || 0,
        size: params.size || 10
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch accessory reviews');
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching accessory reviews:", error);
    throw error;
  }
};