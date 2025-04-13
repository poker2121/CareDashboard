
import { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { 
  FaBox,
  FaEllipsisH,
  FaArrowUp,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage
} from 'react-icons/fa';
import styles from './Categories.module.css';
import { Helmet } from 'react-helmet';
import { useCategories } from '../../context/CategoriesContext';
import { useProductContext } from '../../context/ProductContext';

const Categories = () => {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { productsLength } = useProductContext();
  const [categoryCards, setCategoryCards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);

 
  useEffect(() => {
    console.log(categories);
    console.log('Categories data:', categories);
    

    let categoriesArray = [];
    
    if (Array.isArray(categories)) {
      // Check if it's an error response
      if (categories.length > 0 && categories[0].message === 'Catch error' && categories[0].err === 'jwt expired') {
        console.log('JWT token expired. User needs to log in again.');
        // You might want to redirect to login page or refresh token here
      } else {
       
        categoriesArray = categories;
      }
    } else if (categories && categories.categories && Array.isArray(categories.categories)) {
   
      categoriesArray = categories.categories;
    }
    
    if (categoriesArray.length > 0) {
      const mappedCategories = categoriesArray.map(category => ({
        id: category.id,
        title: category.name,
        icon: <FaBox />,
        image: category.image
      }));

      setCategoryCards(mappedCategories);
    } else {
      // If no categories are available, set empty array and log for debugging
      console.log('No categories available or categories array is empty');
      setCategoryCards([]);
      
      
      if (!loading) {
        fetchCategories();
      }
    }
  }, [categories, loading, fetchCategories]);

  const handleRefresh = () => {
    fetchCategories();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    setFormData({
      name: '',
    });
    setCategoryImage(null);
    setImagePreview('');
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.title,
    });
    setCategoryImage(null);
    setImagePreview(category.image || '');
    setShowEditModal(true);
    setMenuOpen(null);
  };

  const handleDeleteCategory = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
    setMenuOpen(null);
  };

  const submitAddCategory = async () => {
    try {
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      if (categoryImage) {
        formDataToSend.append('image', categoryImage);
      }

      await createCategory(formDataToSend);
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const submitEditCategory = async () => {
    try {
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      if (categoryImage) {
        formDataToSend.append('image', categoryImage);
      }

      await updateCategory(currentCategory.id, formDataToSend);
      setShowEditModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const submitDeleteCategory = async () => {
    try {
      await deleteCategory(currentCategory.id);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  return (
    <div className={styles.categoriesContainer}>
      <Helmet>
        <title>Categories - Dashboard</title>
      </Helmet>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h2 className={styles.title}>Categories</h2>
            <p className={styles.subtitle}>Manage your product categories</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="primary" className={styles.addButton} onClick={handleAddCategory}>
              <FaPlus className="me-2" /> Add Category
            </Button>
            <Button variant="outline-secondary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <Row className="g-4">
          {categories.map((category, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <Card className={styles.categoryCard}>
                <Card.Body>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: `${category.color}15` }}>
                      <div className={styles.icon} style={{ color: category.color }}>
                        {category.icon}
                      </div>
                    </div>
                    <div className={styles.menuContainer}>
                      <button className={styles.menuButton} onClick={() => toggleMenu(index)}>
                        <FaEllipsisH />
                      </button>
                      {menuOpen === index && (
                        <div className={styles.menuDropdown}>
                          <button onClick={() => handleEditCategory(category)} className={styles.menuItem}>
                            <FaEdit className={styles.menuIcon} /> Edit
                          </button>
                          <button onClick={() => handleDeleteCategory(category)} className={styles.menuItem}>
                            <FaTrash className={styles.menuIcon} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <img src={category.Image.path} alt={category.name} className={styles.categoryImage + " img-fluid"} />
                  </div>
                  
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Total Products</span>
                      <span className={styles.statValue}>{category.totalProducts}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Active</span>
                      <span className={styles.statValue}>{category.products.length}</span>
                    </div>
                  </div>

                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progress} 
                      style={{ 
                        width: `${(category.products.length / productsLength) * 100 || 0}%`,
                        // backgroundColor: category.color
                      }}
                    ></div>
                  </div>

                  <div className={styles.growth}>
                    <FaArrowUp className={styles.growthIcon} />
                    <span>{category.growth}</span>
                    <span className={styles.growthPeriod}>this month</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Category Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Enter category name" 
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category Image</Form.Label>
              <div className={styles.imageUploadContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="d-none"
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => fileInputRef.current.click()}
                  className={styles.uploadButton}
                >
                  <FaImage className="me-2" /> Choose Image
                </Button>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal - Simplified */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Enter category name" 
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category Image</Form.Label>
              <div className={styles.imageUploadContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="d-none"
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => fileInputRef.current.click()}
                  className={styles.uploadButton}
                >
                  <FaImage className="me-2" /> {imagePreview ? 'Change Image' : 'Choose Image'}
                </Button>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitEditCategory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Category Modal remains the same */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the category "{currentCategory?.title}"?</p>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submitDeleteCategory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
