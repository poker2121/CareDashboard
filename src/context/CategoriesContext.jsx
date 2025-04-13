import { createContext, useState, useEffect, useContext } from 'react';
import { categoriesAPI } from '../services/api/categories.api';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateLocalStorage = (data) => {
    localStorage.setItem('categories', JSON.stringify(data));
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAllCategories();
      setCategories(data.categories);
      updateLocalStorage(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await categoriesAPI.createCategory(categoryData);
      // Ensure categories is an array before spreading
      const updatedCategories = Array.isArray(categories) ? [...categories, newCategory] : [newCategory];
      setCategories(updatedCategories);
      updateLocalStorage(updatedCategories);
      return newCategory;
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await categoriesAPI.updateCategory(id, categoryData);
      // Ensure categories is an array before mapping
      const updatedCategories = Array.isArray(categories) 
        ? categories.map(cat => cat.id === id ? updatedCategory : cat)
        : [updatedCategory];
      setCategories(updatedCategories);
      updateLocalStorage(updatedCategories);
      return updatedCategory;
    } catch (err) {
      setError('Failed to update category');
      console.error(err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoriesAPI.deleteCategory(id);
      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);
      updateLocalStorage(updatedCategories);
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <CategoriesContext.Provider value={value} categories={categories}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export default CategoriesContext;
