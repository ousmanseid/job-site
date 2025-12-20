import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Link } from 'react-router-dom'

const JobSeekerDashboard = () => {
    return (
        <DashboardLayout role="jobseeker">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Total Applied</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-file-earmark-check"></i>
                        </div>
                        <div className="stat-value">2</div>
                        <div className="stat-label">Saved CVs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-bell"></i>
                        </div>
                        <div className="stat-value">5</div>
                        <div className="stat-label">Job Alerts</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon teal">
                            <i className="bi bi-star"></i>
                        </div>
                        <div className="stat-value">18</div>
                        <div className="stat-label">Recommended</div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Recent Applications */}
                <div className="col-lg-8">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Recent Applications</h5>
                            <Link to="/dashboard/jobseeker/applied" className="btn btn-sm btn-link text-decoration-none p-0">View All</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '0.85rem' }}>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ fontSize: '0.9rem' }}>
                                        <td><span className="fw-bold text-dark">Frontend Developer</span></td>
                                        <td>TechCorp</td>
                                        <td><span className="badge bg-warning text-dark rounded-pill">Pending</span></td>
                                        <td>Oct 12</td>
                                    </tr>
                                    <tr style={{ fontSize: '0.9rem' }}>
                                        <td><span className="fw-bold text-dark">UX Designer</span></td>
                                        <td>CreativeStudio</td>
                                        <td><span className="badge bg-success rounded-pill">Interview</span></td>
                                        <td>Oct 10</td>
                                    </tr>
                                    <tr style={{ fontSize: '0.9rem' }}>
                                        <td><span className="fw-bold text-dark">Java Engineer</span></td>
                                        <td>Global Systems</td>
                                        <td><span className="badge bg-danger rounded-pill">Rejected</span></td>
                                        <td>Sep 28</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="col-lg-4">
                    <div className="content-card h-100">
                        <h5 className="fw-bold mb-4">Recommended for You</h5>
                        <div className="d-grid gap-3">
                            {[
                                { title: 'Senior React Dev', company: 'Innovation Lab', type: 'Remote', salary: '$120k' },
                                { title: 'UI/UX Lead', company: 'Design Pro', type: 'Full-time', salary: '$95k' },
                                { title: 'Node.js Backend', company: 'Server Side', type: 'Contract', salary: '$80/hr' }
                            ].map((job, i) => (
                                <div key={i} className="p-3 border rounded shadow-sm-hover bg-light-hover transition-all">
                                    <div className="fw-bold text-dark mb-1">{job.title}</div>
                                    <div className="text-muted extra-small mb-2">{job.company} • {job.type}</div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-success fw-bold small">{job.salary}</span>
                                        <button className="btn btn-sm btn-teal text-white py-1 px-3" style={{ fontSize: '0.75rem' }}>Apply</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline-primary w-100 mt-4 py-2">Find More Jobs</button>
                    </div>
                </div>
            </div>

            {/* Account Insight Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="content-card bg-light border-0">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="fw-bold text-primary mb-2">Enhance Your Profile Visibility!</h5>
                                <p className="text-muted small mb-0">Users with a completed CV builder are 3x more likely to be contacted by employers. Build yours today to stand out in the pool.</p>
                            </div>
                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                <Link to="/dashboard/jobseeker/cv" className="btn btn-teal text-white px-4 py-2">Launch CV Builder</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default JobSeekerDashboard
