import * as request from "~/utils/request";

export const getCategories = async () => {
  try {
    const response = await request.get(`/categories`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (data) => {
  try {
    const response = await request.post(`/categories`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await request.put(`/categories/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await request.del(`/categories/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const searchCategory = async (keyword) => {
  try {
    const response = await request.get(`/categories/search`, {
      params: {
        keyword: keyword,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryDocument = async (categoryId, page, size) => {
  try {
    const response = await request.get(`/categories/${categoryId}/documents`, {
      params:{
        page: page,
        size: size,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await request.get(`/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}