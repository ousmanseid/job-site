import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const JobSeekerApplications = () => {
    const [applications, setApplications] = useState([
        { id: 1, title: 'Frontend Developer', company: 'TechCorp', date: 'Oct 12, 2024', status: 'Pending', type: 'Full-time' },
        { id: 2, title: 'UX Designer', company: 'CreativeStudio', date: 'Oct 10, 2024', status: 'Interview', type: 'Contract' },
        { id: 3, title: 'Product Manager', company: 'StartUp Inc.', date: 'Sep 28, 2024', status: 'Rejected', type: 'Remote' },
    ]);

    return (
        <DashboardLayout role="jobseeker">
            <h3 className="fw-bold mb-4">My Applications</h3>

            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="content-title mb-0">Application Tracking</h5>
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm" style={{ width: '150px' }}>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Interview</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Job Role</th>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div className="fw-bold text-dark">{app.title}</div>
                                    </td>
                                    <td>{app.company}</td>
                                    <td><span className="small text-muted">{app.type}</span></td>
                                    <td>{app.date}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${app.status === 'Interview' ? 'bg-success' :
                                                app.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2">Details</button>
                                        <button className="btn btn-sm btn-outline-secondary">Withdraw</button>
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

export default JobSeekerApplications;
