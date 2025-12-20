import React from 'react'
import DashboardLayout from '../components/DashboardLayout'

const AdminDashboard = () => {
    return (
        <DashboardLayout role="admin">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-value">1,250</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">340</div>
                        <div className="stat-label">Total Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-building"></i>
                        </div>
                        <div className="stat-value">120</div>
                        <div className="stat-label">Companies</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-value">5</div>
                        <div className="stat-label">Pending Approval</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="content-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="content-title mb-0">Recent User Activity</h4>
                            <div className="btn-group">
                                <button className="btn btn-outline-secondary btn-sm active">All</button>
                                <button className="btn btn-outline-secondary btn-sm">Job Seekers</button>
                                <button className="btn btn-outline-secondary btn-sm">Employers</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>User Name</th>
                                        <th>Role</th>
                                        <th>Date Joined</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold">JD</div>
                                                <div>
                                                    <span className="fw-bold">John Doe</span>
                                                    <div className="text-muted small">john@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Job Seeker</td>
                                        <td>Oct 20, 2024</td>
                                        <td><span className="badge bg-success rounded-pill">Active</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-link text-danger">Suspend</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold">TC</div>
                                                <div>
                                                    <span className="fw-bold">TechCorp Admin</span>
                                                    <div className="text-muted small">admin@techcorp.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Employer</td>
                                        <td>Oct 18, 2024</td>
                                        <td><span className="badge bg-warning text-dark rounded-pill">Pending</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-success me-2">Approve</button>
                                            <button className="btn btn-sm btn-link text-danger">Reject</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AdminDashboard
