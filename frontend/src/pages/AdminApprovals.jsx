import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminService from '../services/AdminService';

const AdminApprovals = () => {
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('employers');

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
                                        <td>{job.companyName}</td>
                                        <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
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
        </DashboardLayout>
    );
};

export default AdminApprovals;
