import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobService from '../services/JobService';

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All Categories');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        let queryParams = [];
        if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
        if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
        if (category && category !== 'All Categories') queryParams.push(`category=${encodeURIComponent(category)}`);

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        navigate(`/jobs${queryString}`);
    };

    const [latestJobs, setLatestJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contactEmail, setContactEmail] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (contactEmail) {
            // Here you would typically send the email to your backend
            alert(`Thank you for your request! We have received your email: ${contactEmail}. Our team will contact you shortly.`);
            setContactEmail('');
        }
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            alert(`Successfully subscribed to newsletter with: ${newsletterEmail}`);
            setNewsletterEmail('');
        }
    };

    useEffect(() => {
        const fetchLatestJobs = async () => {
            try {
                const response = await JobService.getAllJobs(0, 3); // Fetch first 3 jobs
                if (response.data && response.data.content) {
                    setLatestJobs(response.data.content);
                }
            } catch (error) {
                console.error("Error fetching latest jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestJobs();
    }, []);

    // Placeholder data for categories
    const categories = [
        { id: 1, title: 'Accounting', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
        { id: 2, title: 'Marketing', img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=400&q=80' },
        { id: 3, title: 'Development', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80' },
        { id: 4, title: 'Customer Support', img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80' },
        { id: 5, title: 'Human Resources', img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=400&q=80' },
        { id: 6, title: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80' },
        { id: 7, title: 'Sales', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80' },
        { id: 8, title: 'Project Mgmt', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80' }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section-new">
                <div className="container">
                    <h1 className="hero-title-new">Let's Find Your Future Job!</h1>
                    <p className="hero-subtitle-new">Connect with top employers and discover opportunities that match your skills and passions. Your dream career starts here.</p>

                    <div className="search-container-hero shadow-lg">
                        <input
                            type="text"
                            className="search-input-hero"
                            placeholder="Keywords, title, etc."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <select
                            className="search-input-hero"
                            style={{ borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="All Categories">All Categories</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Development">Development</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                            <option value="Sales">Sales</option>
                            <option value="Management">Management</option>
                            <option value="Customer Support">Customer Support</option>
                        </select>
                        <input
                            type="text"
                            className="search-input-hero"
                            placeholder="Location, city, country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button className="btn-search-hero" onClick={handleSearch}>Find Job</button>
                    </div>
                </div>
            </div>

            {/* Job Categories */}
            <section className="py-5">
                <div className="container py-4">
                    <h2 className="section-title">Job Categories</h2>
                    <p className="section-subtitle">Explore our diverse range of job categories and find the perfect role that aligns with your expertise and career goals.</p>

                    <div className="row g-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="col-lg-3 col-md-4 col-sm-6">
                                <Link to={`/jobs?category=${encodeURIComponent(cat.title)}`} className="text-decoration-none">
                                    <div className="category-card">
                                        <img src={cat.img} alt={cat.title} className="category-img" />
                                        <div className="category-overlay">
                                            <h5 className="category-title">{cat.title}</h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/jobs" className="text-decoration-none fw-bold" style={{ color: '#2c3e50' }}>Browse All Categories &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section (Requested) */}
            <section className="py-5 bg-light position-relative">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Latest Opportunities</h2>
                        <p className="section-subtitle">Hand-picked jobs just for you. Apply to the ones that match your profile.</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {loading ? (
                            <div className="col-12 text-center py-5">
                                <div className="spinner-border text-primary text-center" role="status"></div>
                                <p className="text-muted mt-3">Loading latest opportunities...</p>
                            </div>
                        ) : latestJobs.length > 0 ? (
                            latestJobs.map(job => (
                                <div key={job.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card transition-all">
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="bg-light rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                                    {job.company?.logo ? <img src={job.company.logo} alt="logo" className="img-fluid" /> : <i className="bi bi-building fs-3 text-primary"></i>}
                                                </div>
                                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-medium">
                                                    {job.jobType || 'Full Time'}
                                                </span>
                                            </div>

                                            <h5 className="fw-bold mb-1 text-dark text-truncate" title={job.title}>{job.title}</h5>
                                            <p className="text-muted small mb-3">{job.company?.name || 'Top Company'}</p>

                                            <div className="d-flex gap-3 mb-4 text-muted small">
                                                <span className="d-flex align-items-center"><i className="bi bi-geo-alt me-1 text-danger"></i> {job.location || 'Remote'}</span>
                                                <span className="d-flex align-items-center"><i className="bi bi-cash me-1 text-success"></i> {job.salaryMin ? `$${job.salaryMin / 1000}k+` : 'Negotiable'}</span>
                                            </div>

                                            <div className="mt-auto">
                                                <Link to={`/jobs/${job.id}`} className="btn btn-teal w-100 rounded-pill py-2 fw-bold text-white shadow-sm btn-hover-scale">
                                                    Apply Now
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                                            <div className="d-flex justify-content-between align-items-center small text-muted border-top pt-3 w-100">
                                                <span><i className="bi bi-clock me-1"></i> {new Date(job.createdAt).toLocaleDateString()}</span>
                                                <span className="fw-medium text-dark">{job.applicationCount || 0} applicants</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                                <p className="text-muted">No jobs are currently available right now. Please check back later or use the search.</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-5">
                        <Link to="/jobs" className="btn btn-outline-dark btn-lg rounded-pill px-5 fw-bold hover-scale">
                            Browse All Jobs
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title text-white">How It Works</h2>
                    <p className="section-subtitle text-white-50">Follow these three simple steps to land your dream job today.</p>

                    <div className="row text-center g-4 mt-4">
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-search"></i>
                                </div>
                                <h4 className="step-title">Search for Jobs</h4>
                                <p className="step-desc">Browse through our extensive database to find the perfect match for your skills and career aspirations.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <h4 className="step-title">Apply Easily</h4>
                                <p className="step-desc">Create your profile, upload your resume, and submit applications to top companies with just a click.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card">
                                <div className="step-icon-circle">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                                <h4 className="step-title">Get Hired</h4>
                                <p className="step-desc">Connect with recruiters, ace your interviews, and start your new career journey successfully.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Others Say */}
            <section className="py-5">
                <div className="container py-5">
                    <h2 className="section-title">What Others Say</h2>
                    <p className="section-subtitle">Hear from professionals who found their dream careers through our portal.</p>

                    <div className="row g-4 justify-content-center mt-4">
                        <div className="col-md-4">
                            <div className="testimonial-card h-100 rounded-4 shadow-lg p-4 text-center text-white position-relative" style={{ backgroundColor: '#2c3e50', marginTop: '30px' }}>
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah" className="rounded-circle border border-4 border-white shadow" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                </div>
                                <div className="mt-5 pt-3">
                                    <h5 className="fw-bold mb-1">Sarah Jenkins</h5>
                                    <p className="small text-white-50 mb-3">Senior Developer at TechFlow</p>
                                    <p className="fst-italic opacity-75 small">"This platform changed my life! I found a job that perfectly matches my skills within days. The interface is intuitive and recommendations were spot on."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="testimonial-card h-100 rounded-4 shadow-lg p-4 text-center text-white position-relative" style={{ backgroundColor: '#34495e', marginTop: '30px' }}>
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="David" className="rounded-circle border border-4 border-white shadow" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                </div>
                                <div className="mt-5 pt-3">
                                    <h5 className="fw-bold mb-1">David Chen</h5>
                                    <p className="small text-white-50 mb-3">Product Manager at Innovate</p>
                                    <p className="fst-italic opacity-75 small">"I was struggling to find senior roles that fit my criteria until I used this portal. The filtering options are excellent and I landed interviews quickly."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="testimonial-card h-100 rounded-4 shadow-lg p-4 text-center text-white position-relative" style={{ backgroundColor: '#2c3e50', marginTop: '30px' }}>
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" alt="Maria" className="rounded-circle border border-4 border-white shadow" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                </div>
                                <div className="mt-5 pt-3">
                                    <h5 className="fw-bold mb-1">Maria Rodriguez</h5>
                                    <p className="small text-white-50 mb-3">UX Designer at Creative Studio</p>
                                    <p className="fst-italic opacity-75 small">"As a designer, aesthetics matter to me. This site is not only beautiful but highly functional. Best job search experience I've ever had!"</p>
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
                            <p className="text-muted mb-4">Have questions or need assistance? Our support team is here to help you navigate your career journey.</p>

                            <form className="row g-3" onSubmit={handleContactSubmit}>
                                <div className="col-12">
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email here"
                                            style={{ padding: '12px' }}
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            required
                                        />
                                        <button className="btn btn-teal" type="submit">Request</button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-4 pt-3">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <i className="bi bi-geo-alt fs-4 text-muted"></i>
                                    <span className="text-muted">123 Innovation Drive, Silicon Valley, CA 94025</span>
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
                            <p className="text-white-50">Connecting talent with opportunity. Your trusted partner in career advancement and professional growth.</p>
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
                            <form onSubmit={handleNewsletterSubmit}>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email address"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        required
                                    />
                                    <button className="btn btn-teal" type="submit">Subscribe</button>
                                </div>
                            </form>
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
