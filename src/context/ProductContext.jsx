import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [
    {
      id: 1,
      title: "Natural Shampoo",
      category: "Hair Care",
      price: 29.99,
      description: "Organic ingredients for healthy hair...",
      image: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=300",
      status: "In Stock",
      date: "2024-02-24",
    },
    {
      id: 2,
      title: "Vitamin C Serum",
      category: "Skin Care",
      price: 49.99,
      description: "Brightening serum for radiant skin...",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300",
      status: "In Stock",
      date: "2024-02-24",
    }
  ];

  const [products, setProducts] = useState(storedProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    try {
      setLoading(true);
      const productWithId = {
        ...newProduct,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: "In Stock",
        price: Number(newProduct.price)
      };
      setProducts([...products, productWithId]);
      Swal.fire({
        icon: "success",
        title: "Product Added Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Adding Product",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = (updatedProduct) => {
    try {
      setLoading(true);
      const validatedProduct = {
        ...updatedProduct,
        price: Number(updatedProduct.price)
      };
      setProducts(products.map((product) => 
        product.id === validatedProduct.id ? validatedProduct : product
      ));
      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Product",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#182371",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
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
            text: error.message,
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const searchProducts = (searchTerm) => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((product) => 
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  };

  const filterByCategory = (category) => {
    if (!category || category === "All Categories") return products;
    return products.filter((product) => product.category === category);
  };

  const sortProducts = (sortBy) => {
    const sortedProducts = [...products];
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
        loading 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;