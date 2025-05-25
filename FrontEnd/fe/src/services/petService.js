import * as request from '../utils/request';

export const getPets = async (params = {}) => {
  try {
    console.log("API call params:", params);
    const response = await request.get('/pets', {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        type: params.type,
        breedId: params.breedId
      }
    });
    
    console.log("Raw API response:", response);
    
    if (!response) {
      console.error("No response from API");
      return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
    }
    
    if (response.data) {
      return response.data;
    } else if (response.content) {
      return response;
    } else if (Array.isArray(response)) {
      return { content: response, page: 0, size: response.length, totalElements: response.length, totalPages: 1 };
    }
    
    return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

export const getPetById = async (petId) => {
  try {
    const response = await request.get(`/pets/${petId}`);
    // Nếu response dạng { success, message, data }
    if (response?.data?.data) return response.data.data;
    if (response?.data) return response.data;
    return response;
  } catch (error) {
    console.error("Error fetching pet details:", error);
    throw error;
  }
};

export const createPet = async (petData, thumbnailFile, imageFiles) => {
  try {
    const formData = new FormData();
    
    // Thêm dữ liệu pet
    Object.keys(petData).forEach(key => {
      if (petData[key] !== null && petData[key] !== undefined) {
        formData.append(key, petData[key]);
      }
    });
    
    // Thêm thumbnail file
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    
    // Thêm image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }
    
    const response = await request.post('/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response?.data || null;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
};

export const updatePet = async (petId, petData, thumbnailFile, imageFiles) => {
  try {
    const formData = new FormData();
    // Đúng chuẩn backend: gửi petRequest là JSON string
    formData.append('petRequest', JSON.stringify(petData));
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }
    const response = await request.put(`/pets/${petId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response?.data || null;
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};

export const deletePet = async (petId) => {
  try {
    const response = await request.del(`/pets/${petId}`);
    return response?.data || null;
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};

// Service cho breed
export const getBreeds = async () => {
  try {
    // Add authentication header explicitly
    const response = await request.get('/breeds', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Make sure this matches your auth format
      }
    });
    
    console.log("Breed response:", response);
    return response?.data || { content: [] };
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
};