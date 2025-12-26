import React from 'react'

const JobCard = ({ job }) => {
    return (
        <div className="card h-100 job-card border-0 bg-white rounded-4 p-3 ml-2">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                    <div className="company-logo bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <span className="fw-bold text-secondary">{job.company[0]}</span>
                    </div>
                    <span className="badge bg-light text-dark align-self-start">{job.type}</span>
                </div>
                <h5 className="card-title fw-bold mb-1">{job.title}</h5>
                <p className="text-muted small mb-3">{job.company}</p>

                <div className="mb-4">
                    {job.tags.map(tag => (
                        <span key={tag} className="badge bg-secondary bg-opacity-10 text-secondary me-1 fw-normal">{tag}</span>
                    ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-primary">{job.salary}</span>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3">Apply Now</button>
                </div>
            </div>
        </div>
    )
}

export default JobCard
