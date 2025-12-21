import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const allPosts = [
        {
            id: 1,
            title: "Top 10 Skills Employers Are Looking For in 2024",
            category: "Career Advice",
            author: "Sarah Johnson",
            date: "Dec 15, 2024",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
            excerpt: "The job market is constantly evolving. Discover the essential technical and soft skills that will set you apart from the competition this year."
        },
        {
            id: 2,
            title: "How to Ace Your Remote Job Interview",
            category: "Interview Tips",
            author: "Michael Chen",
            date: "Dec 12, 2024",
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80",
            excerpt: "Remote interviews come with their own set of challenges. Learn how to prepare your tech, setting, and answers for a flawless virtual interview."
        },
        {
            id: 3,
            title: "The Future of Work: Hybrid Models",
            category: "Industry Trends",
            author: "Emma Wilson",
            date: "Dec 10, 2024",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            excerpt: "Is the 9-to-5 dead? Explore how hybrid work models are reshaping company cultures and employee productivity worldwide."
        },
        {
            id: 4,
            title: "Networking 101: Building Professional Connections",
            category: "Networking",
            author: "David Brown",
            date: "Dec 05, 2024",
            image: "https://images.unsplash.com/photo-1515169067750-d51a743a5a33?auto=format&fit=crop&w=800&q=80",
            excerpt: "Your network is your net worth. Practical tips on how to build meaningful professional relationships that can boost your career."
        },
        {
            id: 5,
            title: "Crafting the Perfect Resume",
            category: "Resume Tips",
            author: "Alice Cooper",
            date: "Nov 28, 2024",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
            excerpt: "Learn the dos and don'ts of resume writing. Get noticed by recruiters with a resume that tells your professional story effectively."
        },
        {
            id: 6,
            title: "Mental Health in the Workplace",
            category: "Wellness",
            author: "Dr. Robert Lee",
            date: "Nov 20, 2024",
            image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&q=80",
            excerpt: "Prioritizing mental health is crucial for long-term career success. Strategies for maintaining work-life balance and managing stress."
        },
        {
            id: 7,
            title: "Career Change at 40: It's Not Too Late",
            category: "Career Advice",
            author: "John Miller",
            date: "Nov 15, 2024",
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            excerpt: "Starting over in a new industry mid-career can be daunting but rewarding. Learn how to leverage your existing experience for a fresh start."
        },
        {
            id: 8,
            title: "The Rise of Freelance Economy",
            category: "Industry Trends",
            author: "Sophia Garcia",
            date: "Nov 10, 2024",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
            excerpt: "More professionals are choosing independence over corporate stability. We look at the data driving the massive growth in the gig economy."
        },
        {
            id: 9,
            title: "Negotiating Your Salary Like a Pro",
            category: "Career Advice",
            author: "Robert Taylor",
            date: "Nov 05, 2024",
            image: "https://images.unsplash.com/photo-1573164060897-425941c30312?auto=format&fit=crop&w=800&q=80",
            excerpt: "Don't leave money on the table. Expert strategies for researching market rates and handling the awkward 'expected salary' talk."
        }
    ];

    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        setLoading(true);
        // Simulate an API delay
        setTimeout(() => {
            setVisibleCount(prev => prev + 3);
            setLoading(false);
        }, 800);
    };

    const blogPosts = allPosts.slice(0, visibleCount);

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold display-5 mb-3">Latest Career Insights</h1>
                <p className="text-muted lead">Expert advice to help you navigate your career path</p>
            </div>

            <div className="row g-4">
                {blogPosts.map(post => (
                    <div key={post.id} className="col-lg-4 col-md-6">
                        <div className="card h-100 border-0 shadow-sm hover-card bg-white rounded-4 overflow-hidden position-relative">
                            <div className="position-relative">
                                <img src={post.image} className="card-img-top" alt={post.title} style={{ height: '240px', objectFit: 'cover' }} />
                                <span className="position-absolute top-0 start-0 bg-primary text-white px-3 py-1 m-3 rounded-pill small fw-bold">
                                    {post.category}
                                </span>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex align-items-center mb-3 text-muted small">
                                    <i className="bi bi-calendar3 me-2"></i>
                                    <span className="me-3">{post.date}</span>
                                    <i className="bi bi-person-circle me-2"></i>
                                    <span>{post.author}</span>
                                </div>
                                <h4 className="card-title fw-bold mb-3">
                                    <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark stretched-link">
                                        {post.title}
                                    </Link>
                                </h4>
                                <p className="card-text text-muted mb-4 flex-grow-1">
                                    {post.excerpt}
                                </p>
                                <div className="d-flex align-items-center text-primary fw-bold">
                                    Read Article <i className="bi bi-arrow-right ms-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < allPosts.length && (
                <div className="text-center mt-5">
                    <button
                        className="btn btn-outline-primary btn-lg rounded-pill px-5"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Loading Articles...
                            </>
                        ) : 'Load More Articles'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Blog;
