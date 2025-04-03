import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './Products.module.css';
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from 'react-helmet';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts, filterByCategory, sortProducts } = useProductContext();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");
  const [filteredProducts, setFilteredProducts] = useState(products); // State جديدة للمنتجات المفلترة
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
    status: "In Stock",
  });

  const categories = ["Hair Care", "Skin Care", "Makeup", "Supplement"];

  useEffect(() => {
    const applyFilters = async () => {
      try {
        // 1. Search
        let searchedProducts = products;
        if (searchTerm.trim()) {
          searchedProducts = await searchProducts(searchTerm);
        }

        // 2. Filter by category
        let filteredByCategory = searchedProducts;
        if (selectedCategory && selectedCategory !== "All Categories") {
          filteredByCategory = await filterByCategory(selectedCategory);
        }

        // 3. Sort
        const sortedProducts = sortProducts(sortBy, filteredByCategory);

        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredProducts(products); // Fallback to all products if there's an error
      }
    };

    applyFilters();
  }, [products, searchTerm, selectedCategory, sortBy, searchProducts, filterByCategory, sortProducts]);

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ title: "", category: "", price: "", description: "", image: "", status: "In Stock" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
    } else {
      addProduct(formData);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.productsContainer}>
      <Helmet>
        <title>The Stock</title>
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
            <option key={category} value={category}>{category}</option>
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

      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={product.image || "https://via.placeholder.com/300"} alt={product.title} />
                <Badge className={styles.categoryBadge}>{product.category}</Badge>
                <Badge className={`${styles.statusBadge} ${product.status === "In Stock" ? styles.inStock : styles.outStock}`}>
                  {product.status}
                </Badge>
              </div>
              <Card.Body>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>${product.price}</p>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productMeta}>
                  <small className={styles.date}>{product.date}</small>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} className={styles.productModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Form.Group>
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
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
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className={styles.submitButton}>
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;