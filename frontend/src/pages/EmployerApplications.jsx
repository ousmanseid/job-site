import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const EmployerApplications = () => {
    const [applicants, setApplicants] = useState([
        { id: 1, name: 'Alice Johnson', job: 'Senior React Developer', date: 'Oct 12, 2024', status: 'Pending' },
        { id: 2, name: 'Bob Smith', job: 'Senior React Developer', date: 'Oct 11, 2024', status: 'Shortlisted' },
        { id: 3, name: 'Charlie Brown', job: 'Backend Engineer', date: 'Oct 10, 2024', status: 'Pending' },
        { id: 4, name: 'Diana Prince', job: 'Backend Engineer', date: 'Oct 9, 2024', status: 'Rejected' },
    ]);

    const updateStatus = (id, status) => {
        setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a));
    };

    return (
        <DashboardLayout role="employer">
            <h3 className="fw-bold mb-4">Recruitment / Applications</h3>

            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="content-title mb-0">Applicant Lists</h5>
                    <select className="form-select w-25">
                        <option>Filter by Job Post</option>
                        <option>Senior React Developer</option>
                        <option>Backend Engineer</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Candidate</th>
                                <th>Job Applied</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold" style={{ width: '35px', height: '35px', fontSize: '0.8rem', textAlign: 'center' }}>
                                                {item.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="fw-bold">{item.name}</span>
                                        </div>
                                    </td>
                                    <td><small className="text-muted">{item.job}</small></td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${item.status === 'Shortlisted' ? 'bg-success' :
                                                item.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button className="btn btn-sm btn-outline-info text-dark me-2">
                                                <i className="bi bi-file-earmark-pdf"></i> CV
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-success me-2"
                                                onClick={() => updateStatus(item.id, 'Shortlisted')}
                                                disabled={item.status === 'Shortlisted'}
                                            >
                                                Shortlist
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => updateStatus(item.id, 'Rejected')}
                                                disabled={item.status === 'Rejected'}
                                            >
                                                Reject
                                            </button>
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

export default EmployerApplications;
