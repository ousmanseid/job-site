import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Jobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const mockJobs = [
        { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp Solutions', location: 'Remote', type: 'Full-time', category: 'Software Development', date: '2 days ago', salary: '$120k - $150k' },
        { id: 2, title: 'UX/UI Designer', company: 'Creative Agency', location: 'San Francisco, CA', type: 'Full-time', category: 'Design', date: '1 day ago', salary: '$90k - $120k' },
        { id: 3, title: 'Java Backend Engineer', company: 'Global Systems', location: 'New York, NY', type: 'Contract', category: 'Software Development', date: '3 days ago', salary: '$80 - $100/hr' },
        { id: 4, title: 'Product Manager', company: 'Future AI', location: 'Remote', type: 'Full-time', category: 'Management', date: '5 days ago', salary: '$130k - $160k' },
        { id: 5, title: 'Data Scientist', company: 'Data Inc.', location: 'Austin, TX', type: 'Part-time', category: 'Data Science', date: 'Today', salary: '$60k - $80k' },
    ];

    const filteredJobs = mockJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5 mt-4">
                <h1 className="fw-bold display-5 mb-3">Find Your Dream Job</h1>
                <p className="text-muted lead">Browse through thousands of opportunities from top companies</p>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm p-3 mb-5 rounded-4 bg-white mx-auto" style={{ maxWidth: '800px' }}>
                <div className="row g-2">
                    <div className="col-md-9">
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 py-3"
                                placeholder="Job title, keywords, or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-teal w-100 h-100 text-white fw-bold">Search Jobs</button>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Filters Sidebar */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-4">Filter Jobs</h5>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Category</label>
                            <div className="d-flex flex-column gap-2">
                                {['All', 'Software Development', 'Design', 'Management', 'Data Science'].map(cat => (
                                    <div key={cat} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="category"
                                            id={cat}
                                            checked={filterCategory === cat}
                                            onChange={() => setFilterCategory(cat)}
                                        />
                                        <label className="form-check-label small" htmlFor={cat}>{cat}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Job Type</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="fulltime" defaultChecked />
                                <label className="form-check-label small" htmlFor="fulltime">Full-time</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="contract" />
                                <label className="form-check-label small" htmlFor="contract">Contract</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="remote" />
                                <label className="form-check-label small" htmlFor="remote">Remote</label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Experience Level</label>
                            <select className="form-select form-select-sm">
                                <option>Any Experience</option>
                                <option>Entry Level</option>
                                <option>Mid Level</option>
                                <option>Senior Level</option>
                            </select>
                        </div>

                        <button className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={() => { setSearchQuery(''); setFilterCategory('All') }}>Reset All</button>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="col-lg-9 mt-4 mt-lg-0">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">Showing {filteredJobs.length} Jobs</h5>
                        <select className="form-select form-select-sm" style={{ width: '150px' }}>
                            <option>Latest First</option>
                            <option>Oldest First</option>
                            <option>Highest Salary</option>
                        </select>
                    </div>

                    <div className="d-grid gap-3">
                        {filteredJobs.length > 0 ? filteredJobs.map(job => (
                            <div key={job.id} className="card border-0 shadow-sm-hover transition-all p-4 rounded-4 bg-white-hover">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex gap-3">
                                        <div className="bg-light rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-building fs-3 text-secondary"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">{job.title}</h5>
                                            <p className="text-primary small fw-bold mb-2">{job.company}</p>
                                            <div className="d-flex flex-wrap gap-2 mb-0">
                                                <span className="badge bg-light text-muted fw-normal"><i className="bi bi-geo-alt me-1"></i> {job.location}</span>
                                                <span className="badge bg-light text-muted fw-normal"><i className="bi bi-clock me-1"></i> {job.type}</span>
                                                <span className="badge bg-light text-success fw-bold"><i className="bi bi-cash me-1"></i> {job.salary}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-muted small mb-3">{job.date}</div>
                                        <Link to={`/jobs/${job.id}`} className="btn btn-teal text-white px-4">Details</Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-5">
                                <i className="bi bi-search display-1 text-light mb-3"></i>
                                <p className="text-muted">No jobs found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
