import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogService from '../services/BlogService';

const Blog = () => {
    const [allPosts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await BlogService.getAllBlogs();
            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setPosts(data);
            } else if (data && typeof data === 'object' && Array.isArray(data.content)) {
                // Handle paginated response if backend uses it
                setPosts(data.content);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const blogPosts = Array.isArray(allPosts) ? allPosts.slice(0, visibleCount) : [];

    if (loading && allPosts.length === 0) {
        return (
            <div className="container py-5 mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold display-5 mb-3">Latest Career Insights</h1>
                <p className="text-muted lead">Expert advice to help you navigate your career path</p>
            </div>

            <div className="row g-4">
                {blogPosts.length > 0 ? (
                    blogPosts.map(post => (
                        <div key={post.id} className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm hover-card bg-white rounded-4 overflow-hidden position-relative animate__animated animate__fadeInUp">
                                <div className="position-relative">
                                    <img src={post.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '240px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" }}
                                    />
                                    <span className="position-absolute top-0 start-0 bg-primary text-white px-3 py-1 m-3 rounded-pill small fw-bold shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center mb-3 text-muted small">
                                        <i className="bi bi-calendar3 me-2 text-primary"></i>
                                        <span className="me-3">{new Date(post.createdAt || new Date()).toLocaleDateString()}</span>
                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                        <span>{post.author}</span>
                                    </div>
                                    <h4 className="card-title fw-bold mb-3">
                                        <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark stretched-link hover-text-primary transition-all">
                                            {post.title}
                                        </Link>
                                    </h4>
                                    <p className="card-text text-muted mb-4 flex-grow-1 line-clamp-3">
                                        {post.summary}
                                    </p>
                                    <div className="d-flex align-items-center text-primary fw-bold mt-auto">
                                        Read Article <i className="bi bi-arrow-right ms-2 group-hover-translate-x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <i className="bi bi-journal-x display-1 text-muted mb-4 d-block"></i>
                        <h3>No blog posts found.</h3>
                        <p className="text-muted">Stay tuned for upcoming career advice and industry trends.</p>
                    </div>
                )}
            </div>

            {visibleCount < allPosts.length && (
                <div className="text-center mt-5">
                    <button
                        className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                        onClick={handleLoadMore}
                    >
                        Load More Articles
                    </button>
                </div>
            )}
        </div>
    );
};

export default Blog;
