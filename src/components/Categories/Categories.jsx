
import { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { 
  FaBox, 
  FaShoppingBag, 
  FaSprayCan, 
  FaPills,
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

const Categories = () => {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [categoryCards, setCategoryCards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    totalProducts: 0,
    activeProducts: 0,
    growth: '+0%'
  });
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);

  // Map API data to UI format
  useEffect(() => {
    if (categories && categories.length > 0) {
      const iconMap = {
        'Skin Care': <FaSprayCan />,
        'Hair Care': <FaShoppingBag />,
        'Supplements': <FaPills />,
        'Makeup': <FaBox />,
        // Default icon for other categories
        'default': <FaBox />
      };

      const colorMap = {
        'Skin Care': '#4f46e5',
        'Hair Care': '#06b6d4',
        'Supplements': '#10b981',
        'Makeup': '#f59e0b',
        // Default color for other categories
        'default': '#6b7280'
      };

      const mappedCategories = categories.map(category => ({
        id: category.id,
        title: category.name,
        icon: iconMap[category.name] || iconMap.default,
        totalProducts: category.totalProducts || 0,
        activeProducts: category.activeProducts || 0,
        growth: category.growth || '+0%',
        color: colorMap[category.name] || colorMap.default
      }));

      setCategoryCards(mappedCategories);
    } else {
      // Fallback to static data if no API data is available
      setCategoryCards([
        {
          title: 'Skin Care',
          icon: <FaSprayCan />,
          totalProducts: 45,
          activeProducts: 38,
          growth: '+12.5%',
          color: '#4f46e5'
        },
        {
          title: 'Hair Care',
          icon: <FaShoppingBag />,
          totalProducts: 32,
          activeProducts: 28,
          growth: '+8.2%',
          color: '#06b6d4'
        },
        {
          title: 'Supplements',
          icon: <FaPills />,
          totalProducts: 28,
          activeProducts: 25,
          growth: '+15.3%',
          color: '#10b981'
        },
        {
          title: 'Makeup',
          icon: <FaBox />,
          totalProducts: 35,
          activeProducts: 30,
          growth: '+10.7%',
          color: '#f59e0b'
        }
      ]);
    }
  }, [categories]);

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
      totalProducts: 0,
      activeProducts: 0,
      growth: '+0%'
    });
    setCategoryImage(null);
    setImagePreview('');
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.title,
      totalProducts: category.totalProducts,
      activeProducts: category.activeProducts,
      growth: category.growth
    });
    setCategoryImage(null);
    setImagePreview('');
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
      
      // Optional fields - only add if your API supports them
      if (formData.totalProducts) {
        formDataToSend.append('totalProducts', formData.totalProducts);
      }
      if (formData.activeProducts) {
        formDataToSend.append('activeProducts', formData.activeProducts);
      }
      if (formData.growth) {
        formDataToSend.append('growth', formData.growth);
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
      
      // Optional fields - only add if your API supports them
      if (formData.totalProducts) {
        formDataToSend.append('totalProducts', formData.totalProducts);
      }
      if (formData.activeProducts) {
        formDataToSend.append('activeProducts', formData.activeProducts);
      }
      if (formData.growth) {
        formDataToSend.append('growth', formData.growth);
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
          {categoryCards.map((category, index) => (
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
                  
                  <h3 className={styles.categoryTitle}>{category.title}</h3>
                  
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Total Products</span>
                      <span className={styles.statValue}>{category.totalProducts}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Active</span>
                      <span className={styles.statValue}>{category.activeProducts}</span>
                    </div>
                  </div>

                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progress} 
                      style={{ 
                        width: `${(category.activeProducts / category.totalProducts) * 100 || 0}%`,
                        backgroundColor: category.color
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
            
            <Form.Group className="mb-3">
              <Form.Label>Total Products</Form.Label>
              <Form.Control 
                type="number" 
                name="totalProducts" 
                value={formData.totalProducts} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Active Products</Form.Label>
              <Form.Control 
                type="number" 
                name="activeProducts" 
                value={formData.activeProducts} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Growth</Form.Label>
              <Form.Control 
                type="text" 
                name="growth" 
                value={formData.growth} 
                onChange={handleInputChange} 
                placeholder="e.g. +10.5%" 
              />
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

      {/* Edit Category Modal - Update similar to Add Modal */}
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
            
            <Form.Group className="mb-3">
              <Form.Label>Total Products</Form.Label>
              <Form.Control 
                type="number" 
                name="totalProducts" 
                value={formData.totalProducts} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Active Products</Form.Label>
              <Form.Control 
                type="number" 
                name="activeProducts" 
                value={formData.activeProducts} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Growth</Form.Label>
              <Form.Control 
                type="text" 
                name="growth" 
                value={formData.growth} 
                onChange={handleInputChange} 
                placeholder="e.g. +10.5%" 
              />
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

      {/* Delete Category Modal - Keep as is */}
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
