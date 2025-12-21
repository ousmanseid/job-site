import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmployerService from '../services/EmployerService';
import { Link } from 'react-router-dom';

const EmployerManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await EmployerService.getJobs();
            setJobs(res.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (action === 'delete') {
            if (window.confirm('Are you sure you want to delete this job post?')) {
                try {
                    await EmployerService.deleteJob(id);
                    fetchJobs(); // Refresh
                } catch (error) {
                    console.error("Error deleting job:", error);
                    alert("Failed to delete job.");
                }
            }
        } else if (action === 'close') {
            if (window.confirm('Are you sure you want to close this job post? Applications will no longer be accepted.')) {
                try {
                    await EmployerService.updateJobStatus(id, 'CLOSED');
                    fetchJobs(); // Refresh
                } catch (error) {
                    console.error("Error closing job:", error);
                    alert("Failed to close job.");
                }
            }
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Manage Your Jobs</h3>
                    <p className="text-muted small mb-0">Track and manage all your posted job opportunities.</p>
                </div>
                <Link to="/dashboard/employer/post-job" className="btn btn-teal text-white px-4 rounded-pill shadow-sm">
                    <i className="bi bi-plus-lg me-2"></i>Post New Job
                </Link>
            </div>

            <div className="content-card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 border-0 small text-uppercase fw-bold text-muted">Job Title & Date</th>
                                <th className="py-3 border-0 small text-uppercase fw-bold text-muted text-center">Applicants</th>
                                <th className="py-3 border-0 small text-uppercase fw-bold text-muted text-center">Status</th>
                                <th className="pe-4 py-3 border-0 small text-uppercase fw-bold text-muted text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border text-teal" role="status"></div>
                                    </td>
                                </tr>
                            ) : jobs.length > 0 ? (
                                jobs.map(job => (
                                    <tr key={job.id}>
                                        <td className="ps-4 py-3">
                                            <div className="fw-bold text-dark mb-0">{job.title}</div>
                                            <div className="text-muted extra-small">Posted on {new Date(job.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <div className="d-flex flex-column align-items-center">
                                                <span className="badge bg-light text-dark border mb-1 px-3">{job.applicationCount || 0}</span>
                                                <Link to={`/dashboard/employer/applications?jobId=${job.id}`} className="extra-small text-teal text-decoration-none fw-bold">View List</Link>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`badge rounded-pill px-3 py-2 ${job.status === 'OPEN' ? 'bg-success-light text-success' : 'bg-secondary-light text-secondary'}`}>
                                                <i className={`bi bi-circle-fill me-2 extra-small`}></i>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="pe-4 py-3 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/dashboard/employer/edit-job/${job.id}`} className="btn btn-sm btn-outline-teal rounded-pill px-3">
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <div className="dropdown">
                                                    <button className="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                                        {job.status === 'OPEN' && (
                                                            <li><button className="dropdown-item py-2" onClick={() => handleAction(job.id, 'close')}><i className="bi bi-x-circle me-2"></i>Close Job</button></li>
                                                        )}
                                                        <li><button className="dropdown-item py-2 text-danger" onClick={() => handleAction(job.id, 'delete')}><i className="bi bi-trash me-2"></i>Delete Post</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="text-muted">No jobs posted yet. Start by posting your first job!</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
                .bg-secondary-light { background-color: rgba(108, 117, 125, 0.1); }
                .btn-outline-teal { color: #20c997; border-color: #20c997; }
                .btn-outline-teal:hover { background-color: #20c997; color: white; }
            `}</style>
        </DashboardLayout>
    );
};

export default EmployerManageJobs;
