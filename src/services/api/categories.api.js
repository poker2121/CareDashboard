import { publicAxios, privateAxios } from '../config/axios.config';

export const categoriesAPI = {
    // GET all categories
    getAllCategories: async () => {
        try {
            const response = await publicAxios.get('/category');
            return response.data;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    },
    
    // POST create category
    createCategory: async (categoryData) => {
        try {
            const response = await privateAxios.post('/category', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },
    
    // PUT update category
    updateCategory: async (id, categoryData) => {
        try {
            const response = await privateAxios.put(`/category/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
    },
    
    // DELETE delete category
    deleteCategory: async (id) => {
        try {
            const response = await privateAxios.delete(`/category/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    },
    
    // GET one category
    getCategory: async (id) => {
        try {
            const response = await publicAxios.get(`/category/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            throw error;
        }
    },
};

export default categoriesAPI;