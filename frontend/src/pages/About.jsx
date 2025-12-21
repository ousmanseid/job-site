import React from 'react'

const About = () => {
    return (
        <div className="container py-5 mt-5">
            <div className="row align-items-center mb-5">
                <div className="col-lg-6">
                    <h2 className="fw-bold display-5 mb-4 text-dark">About Smart Job Portal</h2>
                    <p className="lead text-muted mb-4">We are dedicated to connecting talent with opportunity on a global scale.</p>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        Our mission is to make the job search process as seamless and efficient as possible for both employers and job seekers.
                        We believe that everyone deserves a job they love, and every company deserves the right talent to grow.
                    </p>
                    <div className="d-flex gap-3">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                            <span className="fw-bold">Verified Jobs</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                            <span className="fw-bold">Quality Talent</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="position-relative">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                            alt="Team working"
                            className="img-fluid rounded-4 shadow-lg"
                        />
                        <div className="position-absolute bottom-0 start-0 bg-white p-4 rounded-top-end-4 shadow-sm d-none d-md-block" style={{ borderTopRightRadius: '2rem' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary rounded-circle p-3 text-white">
                                    <i className="bi bi-people-fill fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">10k+</h5>
                                    <small className="text-muted">Users Worldwide</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-5 bg-light rounded-4 px-4 px-md-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Our Features</h2>
                    <p className="text-muted">Why choose Smart Job Portal for your career journey?</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                            <div className="mx-auto bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-search fs-3"></i>
                            </div>
                            <h5 className="fw-bold">Easy Job Search</h5>
                            <p className="text-muted small">Advanced filters to find the perfect role matching your skills and preferences.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                            <div className="mx-auto bg-success bg-opacity-10 text-success rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-building fs-3"></i>
                            </div>
                            <h5 className="fw-bold">Top Companies</h5>
                            <p className="text-muted small">Connect with leading organizations and startups looking for talent like you.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                            <div className="mx-auto bg-warning bg-opacity-10 text-warning rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-file-earmark-person fs-3"></i>
                            </div>
                            <h5 className="fw-bold">CV Builder</h5>
                            <p className="text-muted small">Create a professional CV in minutes with our built-in templates and tools.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
