import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import JobService from '../services/JobService';

const Jobs = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterLocation, setFilterLocation] = useState('');

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword');
        const loc = params.get('location');
        const cat = params.get('category');
        if (keyword) setSearchQuery(keyword);
        if (loc) setFilterLocation(loc);
        if (cat) setFilterCategory(cat);
    }, [location.search]);

    useEffect(() => {
        fetchJobs();
    }, [page, filterCategory, searchQuery, filterLocation]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            let response;
            if (searchQuery || (filterCategory && filterCategory !== 'All' && filterCategory !== 'All Categories') || filterLocation) {
                response = await JobService.advancedSearch({
                    keyword: searchQuery,
                    location: filterLocation,
                    category: (filterCategory === 'All Categories' ? 'All' : filterCategory),
                }, page);
            } else {
                response = await JobService.getAllJobs(page);
            }
            if (response.data && response.data.content) {
                setJobs(response.data.content);
                setTotalPages(response.data.totalPages);
            } else if (Array.isArray(response.data)) {
                setJobs(response.data);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchJobs();
    };

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5 mt-4">
                <h1 className="fw-bold display-5 mb-3">Find Your Dream Job</h1>
                <p className="text-muted lead">Browse through thousands of opportunities from top companies</p>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm p-3 mb-5 rounded-4 bg-white mx-auto" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSearch}>
                    <div className="row g-2">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 py-3"
                                    placeholder="Keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0">
                                    <i className="bi bi-geo-alt text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 py-3"
                                    placeholder="Location..."
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-teal w-100 h-100 text-white fw-bold">Search</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="row">
                {/* Filters Sidebar */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-4">Filter Jobs</h5>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Category</label>
                            <div className="d-flex flex-column gap-2">
                                {['All', 'Accounting', 'Development', 'Marketing', 'Design', 'Sales', 'Management', 'Customer Support'].map(cat => (
                                    <div key={cat} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="category"
                                            id={cat}
                                            checked={filterCategory === cat || (cat === 'All' && filterCategory === 'All Categories')}
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
                        <h5 className="fw-bold mb-0">
                            {loading ? 'Loading...' : `Showing ${jobs.length} Jobs`}
                        </h5>
                        <select className="form-select form-select-sm" style={{ width: '150px' }}>
                            <option>Latest First</option>
                            <option>Oldest First</option>
                            <option>Highest Salary</option>
                        </select>
                    </div>

                    <div className="d-grid gap-3">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map(job => (
                                <div key={job.id} className="card border-0 shadow-sm-hover transition-all p-4 rounded-4 bg-white-hover">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex gap-3">
                                            <div className="bg-light rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-building fs-3 text-secondary"></i>
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-1">{job.title}</h5>
                                                <p className="text-primary small fw-bold mb-2">{job.company?.name || 'Confidentail'}</p>
                                                <div className="d-flex flex-wrap gap-2 mb-0">
                                                    <span className="badge bg-light text-muted fw-normal"><i className="bi bi-geo-alt me-1"></i> {job.location || 'Remote'}</span>
                                                    <span className="badge bg-light text-muted fw-normal"><i className="bi bi-clock me-1"></i> {job.jobType}</span>
                                                    <span className="badge bg-light text-success fw-bold"><i className="bi bi-cash me-1"></i> {job.salaryMin ? `$${job.salaryMin} - $${job.salaryMax}` : 'Negotiable'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-muted small mb-3">{new Date(job.createdAt).toLocaleDateString()}</div>
                                            <Link to={`/jobs/${job.id}`} className="btn btn-teal text-white px-4">Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
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
