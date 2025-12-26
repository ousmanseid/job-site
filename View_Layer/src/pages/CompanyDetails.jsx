import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CompanyService from '../services/CompanyService';
import JobService from '../services/JobService';
import API_BASE_URL from '../services/config';

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const companyRes = await CompanyService.getCompanyById(id);
                if (companyRes.data) {
                    setCompany(companyRes.data);
                }

                const jobsRes = await JobService.getJobsByCompany(id);
                if (jobsRes.data && jobsRes.data.content) {
                    setJobs(jobsRes.data.content);
                }
            } catch (error) {
                console.error("Error fetching company details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="container py-5 mt-5 text-center">
                <h3>Company Not Found</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/companies')}>Back to Companies</button>
            </div>
        );
    }

    return (
        <div className="container py-5 mt-5">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 text-center mb-4">
                        <div className="mx-auto bg-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="img-fluid rounded-circle" />
                            ) : (
                                <span className="fw-bold fs-1 text-secondary">{company.name.charAt(0)}</span>
                            )}
                        </div>
                        <h3 className="fw-bold mb-1">{company.name}</h3>
                        <p className="text-muted mb-4">{company.industry}</p>

                        <div className="text-start border-top pt-4">
                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Location</label>
                                <p className="mb-0"><i className="bi bi-geo-alt me-2 text-primary"></i>{company.city}, {company.country}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Company Size</label>
                                <p className="mb-0"><i className="bi bi-people me-2 text-primary"></i>{company.companySize || 'Not specified'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Website</label>
                                <p className="mb-0">
                                    <i className="bi bi-globe me-2 text-primary"></i>
                                    <a href={company.website || '#'} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                                        {company.website || 'No website provided'}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                        <h4 className="fw-bold mb-4">About the Company</h4>
                        <div className="lh-lg text-dark mb-0">
                            {company.description || 'This company has not provided a description yet.'}
                        </div>
                    </div>

                    <h4 className="fw-bold mt-5 mb-4 px-2">Job Openings at {company.name}</h4>
                    <div className="row g-3">
                        {jobs.length > 0 ? jobs.map(job => (
                            <div key={job.id} className="col-12">
                                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 hover-card transition-all">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="fw-bold mb-1">{job.title}</h5>
                                            <p className="text-muted mb-3 small">{job.location} • {job.jobType}</p>
                                        </div>
                                        <Link to={`/jobs/${job.id}`} className="btn btn-teal text-white btn-sm px-4">View</Link>
                                    </div>
                                    <div className="d-flex gap-2 mt-auto">
                                        <span className="badge bg-light text-primary fw-normal">New</span>
                                        <span className="badge bg-light text-muted fw-normal">{job.category}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-12">
                                <div className="bg-light p-5 rounded-4 text-center">
                                    <p className="text-muted mb-0">No open positions currently available.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
