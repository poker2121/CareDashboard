import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { productsAPI } from "../services/api/products.api";
import { toast } from "react-toastify";

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
    isDeleted: apiProduct.isDeleted
  };
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsLength, setProductsLength] = useState(0)

  // Fetch all products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAllProducts();
      const normalizedProducts = Array.isArray(response.data.products)
        ? response.data.products.map(normalizeProduct)
        : [];
      setProducts(normalizedProducts);
      setProductsLength(normalizedProducts.length)
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
  useEffect(() => {

    fetchProducts();
  }, []);

  const addProduct = async (formData) => {
    try {
      console.log("Form Data:", formData);
      setLoading(true);
      const response = await productsAPI.createProduct(formData);
      console.log("Response:", response);
      if (response.status === 200 || response.data.message === "Done" || response.status === 201) {

        Swal.fire({
          icon: "success",
          title: "Product Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchProducts();
      }
      // const normalizedNewProduct = normalizeProduct(response.data);
      // setProducts((prevProducts) => {
      //   const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
      //   return [...currentProducts, normalizedNewProduct];
      // });
      // Swal.fire({
      //   icon: "success",
      //   title: "Product Added Successfully!",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
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
      if (response.status === 200) {

        Swal.fire({
          icon: "success",
          title: "Product Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchProducts();
      }
      // const normalizedUpdatedProduct = normalizeProduct(response.data);
      // setProducts(prevProducts =>
      //   prevProducts.map((product) =>
      //     product.id === productId ? normalizedUpdatedProduct : product
      //   )
      // );
      // return normalizedUpdatedProduct;
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
      // Use a local loading state instead of the global one to prevent re-renders
      // of all components that depend on the ProductContext
      const response = await productsAPI.searchProducts(searchTerm);
      
      const searchResults = Array.isArray(response.data.products)
        ? response.data.products.map(normalizeProduct)
        : [];
        
      return searchResults;
    } catch (error) {
      console.error("Search Products Error:", error);
      toast.error(error.response?.data?.message || "Error searching products");
      return products;
    }
  };
  

  const filterByCategory = (category) => {
    console.log("Filtering by category:", category);
    if (!category || category === "All Categories") return products;
    return products.filter((product) => product.categoryId === category);
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
        productsLength
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;