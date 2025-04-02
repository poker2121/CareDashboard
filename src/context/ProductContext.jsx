import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { productsAPI } from "../services/api/products.api";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const normalizeProduct = (apiProduct) => {
  const validCategories = ["Hair Care", "Skin Care", "Makeup", "Supplement", "popular", "latest", "Other"];
  const category = validCategories.includes(apiProduct.category)
    ? apiProduct.category
    : apiProduct.mainCategory || "Other";

  return {
    id: apiProduct._id || Date.now().toString(),
    title: apiProduct.name || "Untitled Product",
    category: category,
    mainCategory: apiProduct.mainCategory || apiProduct.category || "Other",
    price: apiProduct.priceAfterDiscount || apiProduct.price || 0,
    description: apiProduct.description || "No description available",
    image: apiProduct.mainImage?.path || apiProduct.mainImage || "https://via.placeholder.com/300", 
    stock: apiProduct.stock || 0,
    status: (apiProduct.stock !== undefined && apiProduct.stock > 0) ? "In Stock" : "Out of Stock",
    date: apiProduct.createdAt
      ? new Date(apiProduct.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    featured: apiProduct.featured || false,
    bestSeller: apiProduct.bestSeller || false,
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

  const addProduct = async (newProduct) => {
    try {
      setLoading(true);
      const productToAdd = {
        name: newProduct.title || "Untitled Product",
        description: newProduct.description || "No description available",
        price: Number(newProduct.price) || 0,
        discount: newProduct.discount || 0, // إضافة discount
        category: newProduct.category || "Other",
        mainCategory: newProduct.category || "Other",
        stock: newProduct.status === "In Stock" ? 10 : 0,
        mainImage: newProduct.image || "https://via.placeholder.com/300", // بيبعت كـ string زي الـ API
        categoryId: newProduct.categoryId || "67de56e4c4cd18468c6ebe406", // قيمة افتراضية لـ categoryId
        featured: newProduct.featured || false,
        bestSeller: newProduct.bestSeller || false,
      };
      console.log("Product to Add (Sent to API):", productToAdd);
      const response = await productsAPI.createProduct(productToAdd);
      console.log("Added Product Response (From API):", response.data);
      const normalizedNewProduct = normalizeProduct(response.data);
      console.log("Normalized New Product:", normalizedNewProduct);
      setProducts((prevProducts) => {
        const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
        const updatedProducts = [...currentProducts, normalizedNewProduct];
        console.log("Updated Products:", updatedProducts);
        return updatedProducts;
      });
      Swal.fire({
        icon: "success",
        title: "Product Added Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Add Product Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Adding Product",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      setLoading(true);
      const productToUpdate = {
        name: updatedProduct.title || "Untitled Product",
        description: updatedProduct.description || "No description available",
        price: Number(updatedProduct.price) || 0,
        discount: updatedProduct.discount || 0,
        category: updatedProduct.category || "Other",
        mainCategory: updatedProduct.category || "Other",
        stock: updatedProduct.status === "In Stock" ? 10 : 0,
        mainImage: updatedProduct.image || "https://via.placeholder.com/300",
        categoryId: updatedProduct.categoryId || "67de56e4c4cd18468c6ebe406",
        featured: updatedProduct.featured || false,
        bestSeller: updatedProduct.bestSeller || false,
      };
      console.log("Product to Update (Sent to API):", productToUpdate);
      const response = await productsAPI.updateProduct(updatedProduct.id, productToUpdate);
      console.log("Updated Product Response (From API):", response.data);
      const normalizedUpdatedProduct = normalizeProduct(response.data);
      setProducts(products.map((product) =>
        product.id === updatedProduct.id ? normalizedUpdatedProduct : product
      ));
      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Update Product Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Product",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
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
          setProducts(products.filter((product) => product.id !== productId));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The product has been deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error Deleting Product",
            text: error.response?.data?.message || error.message,
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const searchProducts = async (searchTerm) => {
    if (!searchTerm.trim()) return products;
    try {
      const response = await productsAPI.searchProducts(searchTerm);
      console.log("Search Products Response:", response.data);
      return Array.isArray(response.data.products)
        ? response.data.products.map(normalizeProduct)
        : [];
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Searching Products",
        text: error.response?.data?.message || error.message,
      });
      return products;
    }
  };

  const filterByCategory = async (category) => {
    if (!category || category === "All Categories") return products;
    try {
      const response = await productsAPI.getAllProducts();
      const normalizedProducts = Array.isArray(response.data.products)
        ? response.data.products.map(normalizeProduct)
        : [];
      return normalizedProducts.filter((product) => product.mainCategory === category);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Filtering Products",
        text: error.response?.data?.message || error.message,
      });
      return products;
    }
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
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
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