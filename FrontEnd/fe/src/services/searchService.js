import * as request from '../utils/request';

// Tìm kiếm tất cả sản phẩm (cả thú cưng và phụ kiện)
export const searchProducts = async (query, page = 0, size = 10, filters = {}) => {
  try {
    const response = await request.get('/search', {
      params: {
        query,
        page,
        size,
        ...filters
      }
    });
    
    // Xử lý các định dạng response khác nhau
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    
    if (response?.data?.content) {
      return response.data.content;
    }
    
    if (response?.content) {
      return response.content;
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    return [];
  }
};

// Tìm kiếm chỉ thú cưng
export const searchPets = async (query, page = 0, size = 10, filters = {}) => {
  try {
    const response = await request.get('/search/pets', {
      params: {
        query,
        page,
        size,
        ...filters
      }
    });
    
    // Xử lý định dạng response
    if (response?.data?.content) {
      return response.data.content;
    }
    
    if (response?.content) {
      return response.content;
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi tìm kiếm thú cưng:', error);
    return [];
  }
};

// Tìm kiếm chỉ phụ kiện
export const searchAccessories = async (query, page = 0, size = 10, filters = {}) => {
  try {
    const response = await request.get('/search/accessories', {
      params: {
        query,
        page,
        size,
        ...filters
      }
    });
    
    // Xử lý định dạng response
    if (response?.data?.content) {
      return response.data.content;
    }
    
    if (response?.content) {
      return response.content;
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi tìm kiếm phụ kiện:', error);
    return [];
  }
};