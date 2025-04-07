import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './Products.module.css';
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from 'react-helmet';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts, filterByCategory, sortProducts, loading } = useProductContext();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filePreview, setFilePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    categoryId: "",
    price: "",
    description: "",
    mainImage: null,
    stock: "",
    discount: "",
    bestSeller: false,
  });

  const categories = [
    { name: "Hair Care", id: "67de56fc4cd18468ceb406" },
    { name: "Skin Care", id: "skin-care-id" },
    { name: "Makeup", id: "makeup-id" },
    { name: "Supplement", id: "supplement-id" },
    { name: "latest", id: "latest-id" },
    { name: "popular", id: "popular-id" },
  ];

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        let results = products;
        
        if (searchTerm.trim()) {
          results = await searchProducts(searchTerm);
        }
        
        if (selectedCategory && selectedCategory !== "All Categories") {
          results = filterByCategory(selectedCategory);
        }
        
        const sortedResults = sortProducts(sortBy, results);
        setFilteredProducts(sortedResults);
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredProducts(products);
      }
    };

    applyFilters();
  }, [products, searchTerm, selectedCategory, sortBy, searchProducts, filterByCategory, sortProducts]);

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        category: product.category || "",
        categoryId: product.categoryId || getIdFromCategory(product.category),
        price: product.price || "",
        description: product.description || "",
        mainImage: null,
        stock: product.stock || "",
        discount: product.discount || "",
        bestSeller: product.bestSeller || false,
      });
      setFilePreview("");
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        categoryId: "",
        price: "",
        description: "",
        mainImage: null,
        stock: "",
        discount: "0",
        bestSeller: false,
      });
      setFilePreview("");
    }
    setShowModal(true);
  };

  const getIdFromCategory = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("discount", formData.discount || "0");
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("bestSeller", formData.bestSeller.toString());
      
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formDataToSend);
      } else {
        await addProduct(formDataToSend);
      }
      
      setShowModal(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCat = categories.find(cat => cat.name === e.target.value);
    setFormData({
      ...formData,
      category: selectedCat ? selectedCat.name : "",
      categoryId: selectedCat ? selectedCat.id : "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, mainImage: file });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.productsContainer}>
      <Helmet>
        <title>Product Management</title>
      </Helmet>
      
      <div className={styles.header}>
        <div>
          <h2>Products</h2>
          <p className={styles.subtitle}>Manage your product inventory</p>
        </div>
        <Button className={styles.createButton} onClick={() => handleShowModal()}>
          <FaPlus /> Add Product
        </Button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Latest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center my-5">
          <p>No products found. Add your first product!</p>
        </div>
      ) : (
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className={styles.productCard}>
                <div className={styles.productImage}>
                  <img 
                    src={product.mainImage} 
                    alt={product.name} 
                    onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/300"}}
                  />
                  <Badge className={styles.categoryBadge}>{product.category}</Badge>
                  {product.bestSeller && (
                    <Badge className={`${styles.bestSellerBadge}`}>Best Seller</Badge>
                  )}
                </div>
                <Card.Body>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <div className={styles.priceContainer}>
                    <p className={styles.productPrice}>${product.price}</p>
                    {product.discount > 0 && (
                      <small className={styles.discountBadge}>{product.discount}% OFF</small>
                    )}
                  </div>
                  <p className={styles.productDescription}>{product.description}</p>
                  <div className={styles.productMeta}>
                    <small className={styles.date}>{product.date}</small>
                    <Badge bg={product.stock > 0 ? "success" : "danger"}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </Badge>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(product)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => deleteProduct(product.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} className={styles.productModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Main Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                required={!editingProduct}
                onChange={handleImageChange}
              />
            </Form.Group>
            
            {filePreview && (
              <div className={styles.imagePreview}>
                <img src={filePreview} alt="Preview" />
              </div>
            )}
            
            {editingProduct && !filePreview && (
              <div className={styles.imagePreview}>
                <p>Current image will be used if no new image is selected</p>
                <img src={editingProduct.mainImage} alt={editingProduct.name} 
                  onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/300"}}
                />
              </div>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as Best Seller"
                checked={formData.bestSeller}
                onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" animation="border" role="status" /> Processing...
                </>
              ) : (
                editingProduct ? "Update Product" : "Add Product"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;