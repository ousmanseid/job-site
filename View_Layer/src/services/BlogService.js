import axiosInstance from './axiosInstance';

const BlogService = {
    getAllBlogs: async () => {
        const response = await axiosInstance.get('/api/blogs');
        return response.data;
    },

    getBlogById: async (id) => {
        const response = await axiosInstance.get(`/api/blogs/${id}`);
        return response.data;
    },

    getBlogsByCategory: async (category) => {
        const response = await axiosInstance.get(`/api/blogs/category/${category}`);
        return response.data;
    },

    createBlog: async (blogData) => {
        const response = await axiosInstance.post('/api/blogs', blogData);
        return response.data;
    },

    updateBlog: async (id, blogData) => {
        const response = await axiosInstance.put(`/api/blogs/${id}`, blogData);
        return response.data;
    },

    deleteBlog: async (id) => {
        const response = await axiosInstance.delete(`/api/blogs/${id}`);
        return response.data;
    }
};

export default BlogService;
