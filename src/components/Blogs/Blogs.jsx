// ✅ الكود المحسن للملف الأول (Blogs.jsx)

import { useState, useEffect, useMemo } from "react";
import { Button, Form, Row, Col, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useBlogContext } from "../../context/BlogContext";
import styles from "./Blogs.module.css";
import { Helmet } from "react-helmet";

const Blogs = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogContext();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    excerpt: "",
    image: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleShowModal = (blog = null) => {
    setEditingBlog(blog);
    setFormData({
      title: blog?.title || "",
      author: blog?.author || "",
      excerpt: blog?.excerpt || "",
      image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBlog) {
      updateBlog(editingBlog.id, formData);
    } else {
      addBlog(formData);
    }
    setShowModal(false);
  };

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return blogs.filter(({ title = "", excerpt = "" }) =>
      [title, excerpt].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [blogs, searchTerm]);

  return (
    <div className={styles.blogsContainer}>
      <Helmet>
        <title>Blogs & Posts</title>
      </Helmet>

      <div className={styles.header}>
        <div>
          <h2>Blog Posts</h2>
          <p className={styles.subtitle}>Manage and publish your blog content</p>
        </div>
        <Button variant="primary" className={styles.createButton} onClick={() => handleShowModal()}>
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
            <button className={styles.clearSearch} onClick={() => setSearchTerm("")}>×</button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div className={styles.activeFilters}>
          <p>
            {filteredBlogs.length === 0
              ? "No results found"
              : `${filteredBlogs.length} result${filteredBlogs.length !== 1 ? "s" : ""} found`}
          </p>
          <Button
            variant="outline-secondary"
            size="sm"
            className={styles.resetButton}
            onClick={() => setSearchTerm("")}
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
      ) : filteredBlogs.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
              alt="No Content"
              className={styles.emptyStateImage}
            />
            <h3>No Blog Posts Yet</h3>
            <p>Start creating your blog content to engage with your audience.</p>
          </div>
        </div>
      ) : (
        <div className={styles.blogList}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogItem}>
              <div className={styles.blogImage}>
                <img src={blog.image || "https://placehold.co/300x200"} alt={blog.title || "Blog Image"} />
              </div>

              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogExcerpt}>{blog.excerpt}</p>

                <div className={styles.blogMeta}>
                  <div className={styles.metaInfo}>
                    <span className={styles.metaItem}><FaUser /> {blog.author}</span>
                    <span className={styles.metaItem}><FaCalendarAlt /> {blog.date}</span>
                  </div>
                  <div className={styles.blogActions}>
                    <Button variant="outline-primary" size="sm" className={styles.actionButton} onClick={() => handleShowModal(blog)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" className={styles.actionButton} onClick={() => deleteBlog(blog.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className={styles.blogModal}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</Modal.Title>
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter blog title"
                    className={styles.formControl}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter author name"
                    className={styles.formControl}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Write a brief excerpt for your blog post"
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className={styles.formControl}
                  />
                </Form.Group>
                <div className={styles.imagePreviewContainer}>
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
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
              <Button variant="secondary" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className={styles.submitButton}>
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