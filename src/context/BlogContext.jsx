import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const BlogContext = createContext();

export const useBlogContext = () => useContext(BlogContext);

const BlogProvider = ({ children }) => {
  const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
  const [blogs, setBlogs] = useState(storedBlogs);

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const addBlog = (newBlog) => {
    const blogWithId = {
      ...newBlog,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      views: 0,
      comments: 0,
    };
    setBlogs([...blogs, blogWithId]);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)));
  };

  const deleteBlog = (blogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
        Swal.fire("Deleted!", "The blog has been deleted.", "success");
      }
    });
  };

  const searchBlogs = (searchTerm) => {
    if (!searchTerm.trim()) return blogs;
    return blogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filterByCategory = (category) => {
    if (category === "All Categories") return blogs;
    return blogs.filter((blog) => blog.category === category);
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog, searchBlogs, filterByCategory }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;
