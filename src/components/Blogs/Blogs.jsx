import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal, Spinner } from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaComment,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { useBlogContext } from "../../context/BlogContext";
import styles from "./Blogs.module.css";
import { Helmet } from "react-helmet";

const Blogs = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogContext();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    excerpt: "",
    image: "",
  });

  const categories = ["Hair Care", "Supplement", "Makeup", "Skin Care"];

  // Simulate loading 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleShowModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData(blog);
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        category: "",
        author: "",
        excerpt: "",
        image: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new date object to get a fresh timestamp
    const currentDate = new Date().toLocaleDateString();

    if (editingBlog) {
      updateBlog({ ...formData, id: editingBlog.id, date: editingBlog.date });
    } else {
      addBlog({
        ...formData,
        date: currentDate,
        views: Math.floor(Math.random() * 100), // Sample random data for demo
        comments: Math.floor(Math.random() * 10), // Sample random data for demo
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => deleteBlog(id);

  // Calculate filtered blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset search and filter
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
  };

  return (
   
    <div className={styles.blogsContainer}>
       <Helmet> 
                <title>Blogs & Posts</title>      
       </Helmet>
      <div className={styles.header}>
        <div>
          <h2>Blog Posts</h2>
          <p className={styles.subtitle}>
            Manage and publish your blog content
          </p>
        </div>
        <Button
          variant="primary"
          className={styles.createButton}
          onClick={() => handleShowModal()}
        >
          <FaPlus /> Create Post
        </Button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {(searchTerm || selectedCategory !== "All Categories") && (
        <div className={styles.activeFilters}>
          <p>
            {filteredBlogs.length === 0
              ? "No results found"
              : `${filteredBlogs.length} result${
                  filteredBlogs.length !== 1 ? "s" : ""
                } found`}
          </p>
          <Button
            variant="outline-secondary"
            size="sm"
            className={styles.resetButton}
            onClick={handleReset}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner animation="border" role="status" />
          <p>Loading blogs...</p>
        </div>
      ) : filteredBlogs.length === 0 &&
        !(searchTerm || selectedCategory !== "All Categories") ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
              alt="No Content"
              className={styles.emptyStateImage}
            />

            <h3>No Blog Posts Yet</h3>
            <p>
              Start creating your blog content to engage with your audience.
            </p>
           
          </div>
        </div>
      ) : (
        <div className={styles.blogList}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogItem}>
              <div className={styles.blogImage}>
                <img
                  src={blog.image || "https://via.placeholder.com/300"}
                  alt={blog.title}
                />
                <div className={styles.categoryBadge}>{blog.category}</div>
              </div>

              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogExcerpt}>{blog.excerpt}</p>

                <div className={styles.blogMeta}>
                  <div className={styles.metaInfo}>
                    <span className={styles.metaItem}>
                      <FaUser /> {blog.author}
                    </span>
                    <span className={styles.metaItem}>
                      <FaCalendarAlt /> {blog.date}
                    </span>
                    <span className={styles.metaItem}>
                      <FaEye /> {blog.views || 0} views
                    </span>
                    <span className={styles.metaItem}>
                      <FaComment /> {blog.comments || 0} comments
                    </span>
                  </div>

                  <div className={styles.blogActions}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className={styles.actionButton}
                      onClick={() => handleShowModal(blog)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className={styles.actionButton}
                      onClick={() => handleDelete(blog.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className={styles.blogModal}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={styles.formControl}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className={styles.formControl}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        placeholder="Enter author name"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    required
                    placeholder="Write a brief excerpt for your blog post"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                   
                    placeholder="Enter image URL"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className={styles.formControl}
                  />
                </Form.Group>

                <div className={styles.imagePreviewContainer}>
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>Image Preview</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className={styles.modalFooter}>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
              >
                {editingBlog ? "Update Blog" : "Add Blog"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Blogs;
