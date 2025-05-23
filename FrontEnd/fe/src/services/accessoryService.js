import * as request from '../utils/request';

export const getAccessories = async (params = {}) => {
  try {
    const response = await request.get('/accessories', {
      params: {
        status: params.status || 'active',
        categoryId: params.categoryId,
        name: params.name,
        page: params.page || 0,
        size: params.size || 12
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get accessories');
    }
    
    return response.data;
  } catch (error) {
    console.error('Get accessories error:', error);
    throw error;
  }
};

export const getAccessoryById = async (accessoryId) => {
  try {
    const response = await request.get(`/accessories/${accessoryId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get accessory details');
    }
    
    return response.data;
  } catch (error) {
    console.error('Get accessory details error:', error);
    throw error;
  }
};

export const getAccessoryCategories = async () => {
  try {
    const response = await request.get('/categories', {
      params: { type: 'accessory' }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get accessory categories');
    }
    
    return response.data;
  } catch (error) {
    console.error('Get accessory categories error:', error);
    throw error;
  }
};

export const createAccessory = async (accessoryData) => {
  try {
    const response = await request.post('/accessories', accessoryData);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create accessory');
    }
    
    return response.data;
  } catch (error) {
    console.error('Create accessory error:', error);
    throw error;
  }
};

export const updateAccessory = async (accessoryId, accessoryData) => {
  try {
    const response = await request.put(`/accessories/${accessoryId}`, accessoryData);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update accessory');
    }
    
    return response.data;
  } catch (error) {
    console.error('Update accessory error:', error);
    throw error;
  }
};

export const deleteAccessory = async (accessoryId) => {
  try {
    const response = await request.del(`/accessories/${accessoryId}`);
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete accessory');
    }
    
    return response;
  } catch (error) {
    console.error('Delete accessory error:', error);
    throw error;
  }
};

export const uploadAccessoryImages = async (accessoryId, files) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    const response = await request.post(`/accessories/${accessoryId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to upload accessory images');
    }
    
    return response.data;
  } catch (error) {
    console.error('Upload accessory images error:', error);
    throw error;
  }
};

export const uploadAccessoryThumbnail = async (accessoryId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request.post(`/accessories/${accessoryId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to upload accessory thumbnail');
    }
    
    return response.data;
  } catch (error) {
    console.error('Upload accessory thumbnail error:', error);
    throw error;
  }
};