import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BlogService from '../services/BlogService';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const data = await BlogService.getBlogById(id);
            setPost(data);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error fetching blog details:", error);
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="container py-5 mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!post) return <div className="container py-5 mt-5 text-center">Blog post not found.</div>;

    return (
        <div className="container py-5 mt-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{post.category}</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="animate__animated animate__fadeIn">
                        <img src={post.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"}
                            alt={post.title}
                            className="w-100 rounded-4 shadow-lg mb-4"
                            style={{ height: '450px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" }}
                        />

                        <div className="d-flex align-items-center mb-4 text-muted">
                            <span className="badge bg-primary rounded-pill px-3 py-2 me-3 shadow-sm">{post.category}</span>
                            <div className="d-flex align-items-center me-4">
                                <i className="bi bi-calendar3 me-2 text-primary"></i>
                                <span>{new Date(post.createdAt || new Date()).toLocaleDateString()}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2 text-primary"></i>
                                <span>By {post.author}</span>
                            </div>
                        </div>

                        <h1 className="fw-bold display-4 mb-4 text-dark lh-sm">{post.title || 'No Title'}</h1>

                        <div className="blog-content fs-5 leading-relaxed text-secondary mb-5 bg-white p-4 p-md-5 rounded-4 shadow-sm"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}>
                        </div>

                        <hr className="my-5" />

                        <div className="bg-light p-4 rounded-4 d-flex align-items-center mb-5 border-start border-primary border-4">
                            <img src={`https://ui-avatars.com/api/?name=${post.author}&background=0D6EFD&color=fff`} alt={post.author} className="rounded-circle me-4 shadow-sm" style={{ width: '80px' }} />
                            <div>
                                <h5 className="fw-bold mb-1">Written by {post.author}</h5>
                                <p className="text-muted mb-0 small">Professional career consultant and industry expert with over 10 years of experience helping candidates navigate the modern job market.</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link to="/blog" className="btn btn-outline-primary btn-lg rounded-pill px-5 shadow-sm transition-all hover-transform">
                                <i className="bi bi-arrow-left me-2"></i> Back to Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
