import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { blogAPI } from "../services/api/blog.api";

const BlogContext = createContext();

export const useBlogContext = () => useContext(BlogContext);

const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getAllBlogs();

      console.log("Fetched Blogs:", response.data.blogs);

      if (response.data.blogs.length > 0) {
        setIsLoading(false);
        const formattedBlogs = response.data.blogs.map((blog, index) => ({
          id: blog.id || Date.now() + index,
          title: blog.title || "Untitled",
          excerpt: blog.excerpt || "No excerpt available",
          author: blog.author || "Unknown Author",
          image: blog.image.path || "",
          date: blog.date || new Date().toLocaleDateString(),
        }));

        setBlogs(formattedBlogs);
        localStorage.setItem("blogs", JSON.stringify(formattedBlogs));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {

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


      formData.append("title", newBlog.title || "");
      formData.append("author", newBlog.author || "");
      formData.append("excerpt", newBlog.excerpt || "");


      if (newBlog.image && newBlog.image instanceof File) {
        formData.append("image", newBlog.image);
        console.log("Adding image file:", newBlog.image.name);
      }


      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      setAddLoading(true);
      const response = await blogAPI.createBlog(formData);
      console.log("Server response:", response);
      if(response) setAddLoading(false);

      // const createdBlog = handleBlogResponse(response, newBlog);


      // setBlogs((prev) => {
      //   const updated = [...prev, createdBlog];
      //   localStorage.setItem("blogs", JSON.stringify(updated));
      //   return updated;
      // });
      fetchBlogs();
      Swal.fire("Success!", "Blog created successfully.", "success");
    } catch (error) {

      console.error("Error creating blog:", error);

      Swal.fire("Error!", `Failed to create blog: ${error.message}`, "error");

    }
  };

  const updateBlog = async (blogId, updatedBlog) => {
    try {
      // إنشاء FormData جديد
      const formData = new FormData();

      // إضافة البيانات النصية
      formData.append("title", updatedBlog.title || "");
      formData.append("author", updatedBlog.author || "");
      formData.append("excerpt", updatedBlog.excerpt || "");

      // تأكد من أن الصورة موجودة وأنها ملف فعلاً
      if (updatedBlog.image && updatedBlog.image instanceof File) {
        formData.append("image", updatedBlog.image);
        console.log("Adding image file for update:", updatedBlog.image.name);
      }

      // طباعة بيانات FormData للتصحيح
      console.log("Update FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      console.log(formData)
      // إرسال الطلب للخادم
      const response = await blogAPI.updateBlog(blogId, formData);
      console.log("Update response:", response);

      // إنشاء كائن البلوج المحدث من الاستجابة
      // const updatedBlogData = handleBlogResponse(response, updatedBlog);

      // تحديث البلوج في الحالة
      // setBlogs((prev) => {
      //   const updated = prev.map((blog) => (blog.id === blogId ? updatedBlogData : blog));
      //   localStorage.setItem("blogs", JSON.stringify(updated));
      //   return updated;
      // });

      Swal.fire("Success!", "Blog updated successfully.", "success");
    } catch (error) {
      console.error("Error updating blog:", error);

      // عرض تفاصيل الخطأ في وحدة تحكم المتصفح
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      Swal.fire("Error!", `Failed to update blog: ${error.message}`, "error");

      // استرجاع احتياطي - تحديث البلوج محلياً في حالة فشل الخادم
      // const fallbackBlog = {
      //   id: blogId,
      //   title: updatedBlog.title || "Untitled",
      //   excerpt: updatedBlog.excerpt || "No excerpt available",
      //   author: updatedBlog.author || "Unknown Author",
      //   image: updatedBlog.image instanceof File ? URL.createObjectURL(updatedBlog.image) : "",
      //   date: new Date().toLocaleDateString(),
      // };

      // setBlogs((prev) => {
      //   const updated = prev.map((blog) => (blog.id === blogId ? fallbackBlog : blog));
      //   localStorage.setItem("blogs", JSON.stringify(updated));
      //   return updated;
      // });
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


        setBlogs((prev) => {
          const updated = prev.filter((blog) => blog.id !== blogId);
          localStorage.setItem("blogs", JSON.stringify(updated));
          return updated;
        });

        Swal.fire("Error!", "Failed to delete blog from server, but removed locally.", "warning");
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
      value={{ blogs, addBlog, updateBlog, deleteBlog, searchBlogs, isLoading, addLoading }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;