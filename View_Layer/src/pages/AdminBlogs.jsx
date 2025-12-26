import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BlogService from '../services/BlogService';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({
        title: '',
        content: '',
        category: 'Career Advice',
        author: 'Admin',
        imageUrl: '',
        summary: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await BlogService.getAllBlogs();
            if (Array.isArray(data)) {
                setBlogs(data);
            } else if (data && typeof data === 'object' && Array.isArray(data.content)) {
                setBlogs(data.content);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setCurrentBlog(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const blogToSave = { ...currentBlog };

            if (isEditing) {
                await BlogService.updateBlog(currentBlog.id, blogToSave);
                alert("Blog post updated successfully!");
            } else {
                await BlogService.createBlog(blogToSave);
                alert("Blog post published successfully!");
            }
            setShowModal(false);
            fetchBlogs();
            resetForm();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog post: " + (error.response?.data?.message || error.message || "Unknown error"));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await BlogService.deleteBlog(id);
                fetchBlogs();
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const resetForm = () => {
        setCurrentBlog({
            title: '',
            content: '',
            category: 'Career Advice',
            author: 'Admin',
            imageUrl: '',
            summary: ''
        });
        setImageFile(null);
        setImagePreview('');
        setIsEditing(false);
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Manage Career Insights (Blogs)</h3>
                <button
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                    onClick={() => { resetForm(); setShowModal(true); }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Create New Blog
                </button>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Blog Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading blogs...</td></tr>
                            ) : blogs.length > 0 ? (
                                blogs.map(blog => (
                                    <tr key={blog.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={blog.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=100&q=80"}
                                                    alt="thumb"
                                                    className="rounded me-3"
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                                <span className="fw-bold">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-light text-primary border">{blog.category}</span></td>
                                        <td>{blog.author}</td>
                                        <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(blog)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(blog.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No blogs found. Start by creating one!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label small fw-bold">Title</label>
                                            <input type="text" className="form-control rounded-3" name="title" value={currentBlog.title} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold">Category</label>
                                            <select className="form-select rounded-3" name="category" value={currentBlog.category} onChange={handleInputChange}>
                                                <option>Career Advice</option>
                                                <option>Interview Tips</option>
                                                <option>Industry Trends</option>
                                                <option>Networking</option>
                                                <option>Resume Tips</option>
                                                <option>Wellness</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Blog Image</label>
                                            <div className="d-flex flex-column gap-2">
                                                <div className="d-flex gap-2">
                                                    <input
                                                        type="file"
                                                        className="form-control rounded-3"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    <span className="align-self-center">OR</span>
                                                    <input
                                                        type="url"
                                                        className="form-control rounded-3"
                                                        name="imageUrl"
                                                        value={currentBlog.imageUrl.startsWith('data:') ? '' : currentBlog.imageUrl}
                                                        onChange={handleInputChange}
                                                        placeholder="Paste Image URL..."
                                                    />
                                                </div>
                                                {(imagePreview || currentBlog.imageUrl) && (
                                                    <div className="mt-2 text-center">
                                                        <img
                                                            src={imagePreview || currentBlog.imageUrl}
                                                            alt="Preview"
                                                            className="rounded-3 shadow-sm"
                                                            style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Summary (Excerpt)</label>
                                            <textarea className="form-control rounded-3" name="summary" rows="2" value={currentBlog.summary} onChange={handleInputChange} required placeholder="Short description for the blog list..."></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Content (HTML allowed)</label>
                                            <textarea className="form-control rounded-3" name="content" rows="6" value={currentBlog.content} onChange={handleInputChange} required placeholder="Detailed blog content..."></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Author Name</label>
                                            <input type="text" className="form-control rounded-3" name="author" value={currentBlog.author} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            isEditing ? 'Update Post' : 'Publish Blog'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminBlogs;
