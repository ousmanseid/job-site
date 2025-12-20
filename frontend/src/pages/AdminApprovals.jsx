import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AdminApprovals = () => {
    const [approvals, setApprovals] = useState([
        { id: 1, company: 'InnovateX', email: 'hr@innovatex.com', industry: 'Software', doc: 'license_v3.pdf', date: '2024-10-21' },
        { id: 2, company: 'SkyBlue Logistics', email: 'admin@skyblue.com', industry: 'Logistics', doc: 'registration.pdf', date: '2024-10-20' },
    ]);

    const handleAction = (id, status) => {
        // Mocking approval/rejection
        setApprovals(approvals.filter(a => a.id !== id));
        alert(`Employer ${status}!`);
    };

    return (
        <DashboardLayout role="admin">
            <h3 className="fw-bold mb-4">Employer Approvals</h3>

            <div className="alert alert-warning border-0 shadow-sm mb-4">
                <div className="d-flex align-items-center">
                    <i className="bi bi-shield-lock-fill fs-3 me-3"></i>
                    <div>
                        <h6 className="mb-1 fw-bold">Verification Required</h6>
                        <p className="mb-0 small opacity-75">Employers can only post jobs after you verify their business documents and approve their account.</p>
                    </div>
                </div>
            </div>

            <div className="content-card">
                <h5 className="content-title">Pending Applications ({approvals.length})</h5>
                {approvals.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Company Details</th>
                                    <th>Industry</th>
                                    <th>Submission Date</th>
                                    <th>Documents</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvals.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{item.company}</div>
                                            <div className="text-muted small">{item.email}</div>
                                        </td>
                                        <td>{item.industry}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-info text-dark">
                                                <i className="bi bi-file-earmark-pdf me-1"></i> View Doc
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success me-2 px-3"
                                                onClick={() => handleAction(item.id, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-3"
                                                onClick={() => handleAction(item.id, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-check2-circle display-4 text-success mb-3"></i>
                        <p className="text-muted">All pending employer applications have been processed.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminApprovals;
