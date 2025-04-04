import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { blogAPI } from "../services/api/blog.api";

const BlogContext = createContext();

export const useBlogContext = () => useContext(BlogContext);

const BlogProvider = ({ children }) => {
  const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
  const [blogs, setBlogs] = useState(Array.isArray(storedBlogs) ? storedBlogs : []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogAPI.getAllBlogs();
        const fetchedBlogs = Array.isArray(response.data) ? response.data : [];
        
        console.log("Fetched Blogs:", fetchedBlogs); // ✅ Debugging
  
        if (fetchedBlogs.length > 0) {
          const formattedBlogs = fetchedBlogs.map((blog, index) => ({
            id: blog.id || Date.now() + index,
            title: blog.title || "Untitled",
            excerpt: blog.excerpt || "No excerpt available",
            author: blog.author || "Unknown Author",
            image: blog.image || "",
            date: blog.date || new Date().toLocaleDateString(),
          }));
  
          setBlogs(formattedBlogs);
          localStorage.setItem("blogs", JSON.stringify(formattedBlogs));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // ❌ مش لازم نعمل Reset للـ blogs هنا
      }
    };
  
    if (blogs.length === 0) {
      fetchBlogs();
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const handleBlogResponse = (response, fallbackBlog = {}) => ({
    id: response?.data?.id || Date.now(),
    title: response?.data?.title || fallbackBlog.title || "Untitled",
    excerpt: response?.data?.excerpt || fallbackBlog.excerpt || "No excerpt available",
    author: response?.data?.author || fallbackBlog.author || "Unknown Author",
    image: response?.data?.image || fallbackBlog.image || "",
    date: new Date().toLocaleDateString(),
  });

  const addBlog = async (newBlog) => {
    try {
      const formData = new FormData();
      Object.entries(newBlog).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await blogAPI.createBlog(formData);
      const createdBlog = handleBlogResponse(response, newBlog);

      setBlogs((prev) => {
        const updated = [...prev, createdBlog];
        localStorage.setItem("blogs", JSON.stringify(updated));
        return updated;
      });

      Swal.fire("Success!", "Blog created successfully.", "success");
    } catch (error) {
      console.error("Error creating blog:", error);
      Swal.fire("Error!", "Failed to create blog.", "error");
    }
  };

  const updateBlog = async (blogId, updatedBlog) => {
    try {
      const formData = new FormData();
      Object.entries(updatedBlog).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await blogAPI.updateBlog(blogId, formData);
      const updatedBlogData = handleBlogResponse(response, updatedBlog);

      setBlogs((prev) => {
        const updated = prev.map((blog) => (blog.id === blogId ? updatedBlogData : blog));
        localStorage.setItem("blogs", JSON.stringify(updated));
        return updated;
      });

      Swal.fire("Success!", "Blog updated successfully.", "success");
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire("Error!", "Failed to update blog.", "error");
    }
  };

  const deleteBlog = async (blogId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await blogAPI.deleteBlog(blogId);
        setBlogs((prev) => {
          const updated = prev.filter((blog) => blog.id !== blogId);
          localStorage.setItem("blogs", JSON.stringify(updated));
          return updated;
        });

        Swal.fire("Deleted!", "The blog has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting blog:", error);
        Swal.fire("Error!", "Failed to delete blog.", "error");
      }
    }
  };

  const searchBlogs = (searchTerm) => {
    return searchTerm.trim()
      ? blogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : blogs;
  };

 
  return (
    <BlogContext.Provider
      value={{ blogs, addBlog, updateBlog, deleteBlog, searchBlogs }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;