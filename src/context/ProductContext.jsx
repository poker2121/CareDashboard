import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { productsAPI } from "../services/api/products.api";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const normalizeProduct = (apiProduct) => {
  // Simplified category determination based on what the backend provides
  const validCategories = ["Hair Care", "Skin Care", "Makeup", "Supplement", "latest", "popular", "Other"];
  const category = validCategories.includes(apiProduct.category)
    ? apiProduct.category
    : "Other";

  return {
    id: apiProduct._id || Date.now().toString(),
    name: apiProduct.name || "Untitled Product",
    category: category,
    categoryId: apiProduct.categoryId || "",
    price: apiProduct.price || 0,
    description: apiProduct.description || "No description available",
    mainImage: apiProduct.mainImage?.path || apiProduct.mainImage || "https://via.placeholder.com/300",
    stock: apiProduct.stock || 0,
    discount: apiProduct.discount || 0,
    status: (apiProduct.stock !== undefined && apiProduct.stock > 0) ? "In Stock" : "Out of Stock",
    date: apiProduct.createdAt
      ? new Date(apiProduct.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    bestSeller: apiProduct.bestSeller === "true" || apiProduct.bestSeller === true || false,
  };
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getAllProducts();
        const normalizedProducts = Array.isArray(response.data.products)
          ? response.data.products.map(normalizeProduct)
          : [];
        setProducts(normalizedProducts);
      } catch (error) {
        setError(error.message || "Failed to fetch products");
        Swal.fire({
          icon: "error",
          title: "Error Fetching Products",
          text: error.message,
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (formData) => {
    try {
      setLoading(true);
      const response = await productsAPI.createProduct(formData);
      const normalizedNewProduct = normalizeProduct(response.data);
      setProducts((prevProducts) => {
        const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
        return [...currentProducts, normalizedNewProduct];
      });
      Swal.fire({
        icon: "success",
        title: "Product Added Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      return normalizedNewProduct;
    } catch (error) {
      console.error("Add Product Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Adding Product",
        text: error.response?.data?.message || error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, formData) => {
    try {
      setLoading(true);
      const response = await productsAPI.updateProduct(productId, formData);
      const normalizedUpdatedProduct = normalizeProduct(response.data);
      setProducts(prevProducts => 
        prevProducts.map((product) =>
          product.id === productId ? normalizedUpdatedProduct : product
        )
      );
      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      return normalizedUpdatedProduct;
    } catch (error) {
      console.error("Update Product Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Product",
        text: error.response?.data?.message || error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#182371",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(true);
            await productsAPI.deleteProduct(productId);
            setProducts(prevProducts => prevProducts.filter((product) => product.id !== productId));
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The product has been deleted.",
              showConfirmButton: false,
              timer: 1500,
            });
            resolve(true);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Product",
              text: error.response?.data?.message || error.message,
            });
            reject(error);
          } finally {
            setLoading(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  };

  const searchProducts = async (searchTerm) => {
    if (!searchTerm.trim()) return products;
    try {
      setLoading(true);
      const response = await productsAPI.searchProducts(searchTerm);
      const searchResults = Array.isArray(response.data.products)
        ? response.data.products.map(normalizeProduct)
        : [];
      return searchResults;
    } catch (error) {
      console.error("Search Products Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Searching Products",
        text: error.response?.data?.message || error.message,
      });
      return products;
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category) => {
    if (!category || category === "All Categories") return products;
    return products.filter((product) => product.category === category);
  };

  const sortProducts = (sortBy, productsToSort = products) => {
    if (!Array.isArray(productsToSort)) {
      return [];
    }
    const sortedProducts = [...productsToSort];
    switch (sortBy) {
      case "price-asc":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case "date":
        return sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return sortedProducts;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        filterByCategory,
        sortProducts,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;