import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminService from '../services/AdminService';

const AdminApprovals = () => {
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('employers');

    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const employerRes = await AdminService.getPendingEmployers();
            const jobRes = await AdminService.getPendingJobs();

            if (employerRes && Array.isArray(employerRes.data)) {
                setEmployers(employerRes.data);
            }
            if (jobRes && Array.isArray(jobRes.data)) {
                setJobs(jobRes.data);
            }
        } catch (error) {
            console.error("Error fetching approvals data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployerAction = async (id, status) => {
        try {
            if (status === 'Approved') {
                await AdminService.approveUser(id);
            } else {
                await AdminService.deactivateUser(id);
            }
            alert(`Employer ${status}!`);
            setSelectedEmployer(null); // Close modal if open
            fetchData();
        } catch (error) {
            console.error(`Error ${status}ing employer:`, error);
            alert(`Failed to ${status} employer.`);
        }
    };

    const handleJobAction = async (id, status) => {
        try {
            if (status === 'Approved') {
                await AdminService.approveJob(id);
            } else {
                await AdminService.rejectJob(id);
            }
            alert(`Job ${status}!`);
            setSelectedJob(null); // Close modal if open
            fetchData();
        } catch (error) {
            console.error(`Error ${status}ing job:`, error);
            alert(`Failed to ${status} job.`);
        }
    };

    return (
        <DashboardLayout role="admin">
            <h3 className="fw-bold mb-4">Pending Approvals</h3>

            <div className="alert alert-warning border-0 shadow-sm mb-4">
                <div className="d-flex align-items-center">
                    <i className="bi bi-shield-lock-fill fs-3 me-3"></i>
                    <div>
                        <h6 className="mb-1 fw-bold">Verification Required</h6>
                        <p className="mb-0 small opacity-75">Review and approve employer accounts and job postings to maintain platform quality.</p>
                    </div>
                </div>
            </div>

            <div className="content-card">
                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'employers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('employers')}
                        >
                            Employers ({employers.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            Jobs ({jobs.length})
                        </button>
                    </li>
                </ul>

                {loading ? (
                    <div className="text-center py-5">Loading...</div>
                ) : activeTab === 'employers' ? (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Company Details</th>
                                    <th>Industry</th>
                                    <th>Submission Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employers.length > 0 ? employers.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{item.company ? item.company.name : (item.firstName + ' ' + item.lastName)}</div>
                                            <div className="text-muted small">{item.email}</div>
                                        </td>
                                        <td>{item.company ? item.company.industry : 'N/A'}</td>
                                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2 text-white"
                                                onClick={() => setSelectedEmployer(item)}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success me-2 px-3"
                                                onClick={() => handleEmployerAction(item.id, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-3"
                                                onClick={() => handleEmployerAction(item.id, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-4">No pending employer applications.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Job Title</th>
                                    <th>Company</th>
                                    <th>Posted Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length > 0 ? jobs.map(job => (
                                    <tr key={job.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{job.title}</div>
                                            <div className="text-muted small">{job.type} • {job.location}</div>
                                        </td>
                                        <td>{job.companyName || (job.company ? job.company.name : 'Unknown Company')}</td>
                                        <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2 text-white"
                                                onClick={() => setSelectedJob(job)}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success me-2 px-3"
                                                onClick={() => handleJobAction(job.id, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-3"
                                                onClick={() => handleJobAction(job.id, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-4">No pending job postings.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Employer Details Modal */}
            {selectedEmployer && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Employer Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedEmployer(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted text-uppercase small">User Information</h6>
                                        <p className="mb-1"><strong>Name:</strong> {selectedEmployer.firstName} {selectedEmployer.lastName}</p>
                                        <p className="mb-1"><strong>Email:</strong> {selectedEmployer.email}</p>
                                        <p className="mb-1"><strong>Phone:</strong> {selectedEmployer.phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted text-uppercase small">Company Information</h6>
                                        <p className="mb-1"><strong>Company Name:</strong> {selectedEmployer.company?.name || 'N/A'}</p>
                                        <p className="mb-1"><strong>Industry:</strong> {selectedEmployer.company?.industry || 'N/A'}</p>
                                        <p className="mb-1"><strong>Website:</strong> {selectedEmployer.company?.website || 'N/A'}</p>
                                    </div>
                                    <div className="col-12">
                                        <hr className="my-2" />
                                    </div>
                                    <div className="col-12">
                                        <h6 className="fw-bold text-muted text-uppercase small">Company Description</h6>
                                        <p className="text-muted">{selectedEmployer.company?.description || 'No description provided.'}</p>
                                    </div>
                                    <div className="col-12">
                                        <h6 className="fw-bold text-muted text-uppercase small">Address</h6>
                                        <p className="mb-0">{selectedEmployer.city}, {selectedEmployer.state} {selectedEmployer.country}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedEmployer(null)}>Close</button>
                                <button type="button" className="btn btn-success" onClick={() => handleEmployerAction(selectedEmployer.id, 'Approved')}>Approve</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleEmployerAction(selectedEmployer.id, 'Rejected')}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Job Post Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedJob(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <h4 className="fw-bold mb-2">{selectedJob.title}</h4>
                                        <p className="text-muted mb-3">
                                            {selectedJob.companyName || selectedJob.company?.name} • {selectedJob.location} • {selectedJob.jobType?.replace('_', ' ')}
                                        </p>

                                        <h6 className="fw-bold mt-4">Description</h6>
                                        <p className="text-muted small" style={{ whiteSpace: 'pre-line' }}>{selectedJob.description}</p>

                                        <h6 className="fw-bold mt-3">Requirements</h6>
                                        <p className="text-muted small" style={{ whiteSpace: 'pre-line' }}>{selectedJob.requirements}</p>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card bg-light border-0 p-3">
                                            <h6 className="fw-bold mb-3">Job Overview</h6>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Salary Range</small>
                                                <span className="fw-medium">
                                                    {selectedJob.salaryMin && selectedJob.salaryMax
                                                        ? `$${selectedJob.salaryMin.toLocaleString()} - $${selectedJob.salaryMax.toLocaleString()}`
                                                        : 'Not Disclosed'}
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Work Mode</small>
                                                <span className="fw-medium">{selectedJob.workMode}</span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Experience</small>
                                                <span className="fw-medium">{selectedJob.experienceLevel || 'Not Specified'}</span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Posted On</small>
                                                <span className="fw-medium">{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                                <button type="button" className="btn btn-success" onClick={() => handleJobAction(selectedJob.id, 'Approved')}>Approve</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleJobAction(selectedJob.id, 'Rejected')}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminApprovals;
