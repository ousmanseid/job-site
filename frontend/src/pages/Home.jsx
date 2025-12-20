import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    // Placeholder data for categories
    const categories = [
        { id: 1, title: 'Accounting', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
        { id: 2, title: 'Marketing', img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=400&q=80' },
        { id: 3, title: 'Development', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80' },
        { id: 4, title: 'Customer Support', img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80' },
        { id: 5, title: 'Human Resources', img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=400&q=80' },
        { id: 6, title: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80' },
        { id: 7, title: 'Sales', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80' },
        { id: 8, title: 'Project Mgmt', img: 'https://images.unsplash.com/photo-1507208773393-40d9fc9f600e?auto=format&fit=crop&w=400&q=80' }
    ];

    const jobs = [
        { id: 1, title: "Frontend Developer", company: "Tech Solutions", type: "Full Time", loc: "New York" },
        { id: 2, title: "UX Designer", company: "Creative Agency", type: "Remote", loc: "Remote" },
        { id: 3, title: "Product Manager", company: "StartUp Inc.", type: "Contract", loc: "San Francisco" },
    ];

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section-new">
                <div className="container">
                    <h1 className="hero-title-new">Let's Find Your Future Job!</h1>
                    <p className="hero-subtitle-new">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium doloremque in neque recusandae, iste magni nos.</p>

                    <div className="search-container-hero shadow-lg">
                        <input type="text" className="search-input-hero" placeholder="Keywords, title, etc." />
                        <select className="search-input-hero" style={{ borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
                            <option>All Categories</option>
                            <option>Development</option>
                            <option>Design</option>
                        </select>
                        <input type="text" className="search-input-hero" placeholder="Location, city, country" />
                        <button className="btn-search-hero">Find Job</button>
                    </div>
                </div>
            </div>

            {/* Job Categories */}
            <section className="py-5">
                <div className="container py-4">
                    <h2 className="section-title">Job Categories</h2>
                    <p className="section-subtitle">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

                    <div className="row g-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="col-lg-3 col-md-4 col-sm-6">
                                <div className="category-card">
                                    <img src={cat.img} alt={cat.title} className="category-img" />
                                    <div className="category-overlay">
                                        <h5 className="category-title">{cat.title}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/categories" className="text-decoration-none fw-bold" style={{ color: '#2c3e50' }}>Browse All Categories &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section (Requested) */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="section-title">Latest Jobs</h2>
                    <p className="section-subtitle">Discover the latest opportunities added to our platform.</p>
                    <div className="row g-4 justify-content-center">
                        {jobs.map(job => (
                            <div key={job.id} className="col-md-6 col-lg-4">
                                <Link to={`/jobs/${job.id}`} className="text-decoration-none">
                                    <div className="job-card-simple h-100">
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="badge bg-light text-dark border">Now Hiring</span>
                                            <span className="text-muted small"><i className="bi bi-clock"></i> 2d ago</span>
                                        </div>
                                        <h5 className="fw-bold text-dark">{job.title}</h5>
                                        <p className="text-muted mb-2">{job.company}</p>
                                        <div className="d-flex text-muted small mb-3 gap-3">
                                            <span><i className="bi bi-geo-alt"></i> {job.loc}</span>
                                            <span><i className="bi bi-briefcase"></i> {job.type}</span>
                                        </div>
                                        <button className="btn btn-outline-dark w-100 btn-sm rounded-pill fw-bold">Apply Now</button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title text-white">How It Works</h2>
                    <p className="section-subtitle text-white-50">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

                    <div className="row text-center g-4 mt-4">
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-search"></i>
                                </div>
                                <h4 className="step-title">Seek for job</h4>
                                <p className="step-desc">Lorem ipsum dolor sit amet, conse adipisic elit. Laudantium doloremque recusandae.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <h4 className="step-title">Submit proposal</h4>
                                <p className="step-desc">Lorem ipsum dolor sit amet, conse adipisic elit. Laudantium doloremque recusandae.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                                <h4 className="step-title">Get hired</h4>
                                <p className="step-desc">Lorem ipsum dolor sit amet, conse adipisic elit. Laudantium doloremque recusandae.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Others Say */}
            <section className="py-5">
                <div className="container py-5">
                    <h2 className="section-title">What Others Say</h2>
                    <p className="section-subtitle">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-8">
                            <div className="testimonial-card rounded-3 shadow-lg" style={{ backgroundColor: '#2c3e50' }}>
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="testimonial-avatar" />
                                <div className="text-white">
                                    <h4 className="testimonial-name">Alfan Hidayat</h4>
                                    <p className="small opacity-50 mb-4">CEO of Mask Food Corp.</p>
                                    <p className="testimonial-text fs-5">"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium doloremque in neque recusandae, iste magni non nostrum saepe quis. Animi ipsum sequi quas placeat velit dolor iste."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Benefits Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="fw-bold mb-4">Contact us</h2>
                            <p className="text-muted mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium doloremque in neque recusandae iste magni non nostrum saepe quis.</p>

                            <form className="row g-3">
                                <div className="col-12">
                                    <div className="input-group">
                                        <input type="email" className="form-control" placeholder="Enter your email here" style={{ padding: '12px' }} />
                                        <button className="btn btn-teal">Request</button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-4 pt-3">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <i className="bi bi-geo-alt fs-4 text-muted"></i>
                                    <span className="text-muted">Jendral Sudirman 42, My City</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <i className="bi bi-envelope fs-4 text-muted"></i>
                                    <span className="text-muted">support@smartjobportal.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" alt="Office" className="img-fluid rounded-4 shadow" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-dark">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <Link to="/" className="footer-brand">SMART JOB PORTAL</Link>
                            <p className="text-white-50">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut enim ad minim veniam.</p>
                            <div className="mt-4">
                                <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
                                <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
                                <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-2 col-6 mb-4">
                            <h5 className="fw-bold mb-3">Categories</h5>
                            <Link to="#" className="footer-link">Development</Link>
                            <Link to="#" className="footer-link">Design</Link>
                            <Link to="#" className="footer-link">Marketing</Link>
                            <Link to="#" className="footer-link">Accounting</Link>
                        </div>
                        <div className="col-lg-2 col-6 mb-4">
                            <h5 className="fw-bold mb-3">Company</h5>
                            <Link to="#" className="footer-link">About Us</Link>
                            <Link to="#" className="footer-link">Careers</Link>
                            <Link to="#" className="footer-link">Blog</Link>
                            <Link to="#" className="footer-link">Contact</Link>
                        </div>
                        <div className="col-lg-4">
                            <h5 className="fw-bold mb-3">Newsletter</h5>
                            <p className="text-white-50 small">Subscribe to our newsletter to get the latest job alerts.</p>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Email address" />
                                <button className="btn btn-teal">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-top border-secondary mt-5 pt-4 text-center text-white-50 small">
                        <p>&copy; 2025 Smart Job Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
