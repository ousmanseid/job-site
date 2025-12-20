import React from 'react'
import DashboardLayout from '../components/DashboardLayout'

const EmployerDashboard = () => {
    return (
        <DashboardLayout role="employer">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-megaphone"></i>
                        </div>
                        <div className="stat-value">8</div>
                        <div className="stat-label">Total Posted</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-value">5</div>
                        <div className="stat-label">Active Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-slash-circle"></i>
                        </div>
                        <div className="stat-value">3</div>
                        <div className="stat-label">Closed Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-value">124</div>
                        <div className="stat-label">Total Applicants</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="content-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Recent Activity</h5>
                            <button className="btn btn-sm btn-outline-secondary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Activity</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="fw-bold">New Application Received</div>
                                            <small className="text-muted">Alice Johnson applied for Senior React Developer</small>
                                        </td>
                                        <td>Today, 10:45 AM</td>
                                        <td><span className="badge bg-primary">New</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="fw-bold">Job Post Published</div>
                                            <small className="text-muted">Senior UX Designer position is now live</small>
                                        </td>
                                        <td>Yesterday</td>
                                        <td><span className="badge bg-success">Live</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="fw-bold">Application Shortlisted</div>
                                            <small className="text-muted">Bob Smith shortlisted for Backend Engineer</small>
                                        </td>
                                        <td>2 days ago</td>
                                        <td><span className="badge bg-info text-dark">Processed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="content-card">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="d-grid gap-2">
                            <a href="/dashboard/employer/post-job" className="btn btn-teal text-white text-decoration-none py-2">
                                <i className="bi bi-plus-circle me-2"></i> Post a New Job
                            </a>
                            <a href="/dashboard/employer/jobs" className="btn btn-outline-primary py-2 text-decoration-none">
                                <i className="bi bi-briefcase me-2"></i> Manage My Jobs
                            </a>
                            <a href="/dashboard/employer/applications" className="btn btn-outline-dark py-2 text-decoration-none">
                                <i className="bi bi-people me-2"></i> Review Applicants
                            </a>
                        </div>
                        <hr />
                        <div className="bg-light p-3 rounded">
                            <h6 className="fw-bold small mb-2">Platform Tip</h6>
                            <p className="small text-muted mb-0">Keep your company profile updated to attract more qualified candidates.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default EmployerDashboard
