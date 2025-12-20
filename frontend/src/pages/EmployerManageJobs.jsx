import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const EmployerManageJobs = () => {
    const [jobs, setJobs] = useState([
        { id: 1, title: 'Senior React Developer', date: 'Oct 1, 2024', status: 'Active', applicants: 15 },
        { id: 2, title: 'Backend Engineer', date: 'Sep 28, 2024', status: 'Active', applicants: 30 },
        { id: 3, title: 'UI Designer', date: 'Sep 15, 2024', status: 'Closed', applicants: 45 },
    ]);

    const handleAction = (id, action) => {
        if (action === 'delete') {
            if (window.confirm('Delete this job post?')) {
                setJobs(jobs.filter(j => j.id !== id));
            }
        } else if (action === 'close') {
            setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Closed' } : j));
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Manage Your Jobs</h3>
                <button className="btn btn-teal">+ Post New Job</button>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Job Title</th>
                                <th>Date Posted</th>
                                <th>Applicants</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td><span className="fw-bold text-dark">{job.title}</span></td>
                                    <td>{job.date}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-light text-dark border">{job.applicants}</span>
                                            <button className="btn btn-sm btn-link p-0 text-decoration-none small">View</button>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${job.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                Manage
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item">Edit Details</button></li>
                                                {job.status === 'Active' && (
                                                    <li><button className="dropdown-item" onClick={() => handleAction(job.id, 'close')}>Close Job</button></li>
                                                )}
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger" onClick={() => handleAction(job.id, 'delete')}>Delete Post</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerManageJobs;
