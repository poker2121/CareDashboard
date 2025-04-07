import { publicAxios, privateAxios } from '../config/axios.config';

export const productsAPI = {
   
    getAllProducts: async () => await publicAxios.get('/product'),
    getProductById: (id) => publicAxios.get(`/product/${id}`),
    getProductCategories: () => publicAxios.get('/product/categories'),
    searchProducts: (query) => publicAxios.get('/product/search', { params: { q: query } }),

  
    createProduct: (productData) => privateAxios.post('/product', productData),
    updateProduct: (id, productData) => privateAxios.put(`/product/${id}`, productData),
    deleteProduct: (id) => privateAxios.delete(`/product/${id}`),
    
    uploadProductImage: (id, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return privateAxios.post(`/product/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};