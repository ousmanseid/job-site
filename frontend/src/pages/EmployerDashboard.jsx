import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import EmployerService from '../services/EmployerService'

const EmployerDashboard = () => {
    const [stats, setStats] = useState({
        totalPosted: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalApplicants: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await EmployerService.getStats();
                if (statsRes && statsRes.data) {
                    setStats(statsRes.data);
                }

                const activityRes = await EmployerService.getRecentActivity();
                if (activityRes && Array.isArray(activityRes.data)) {
                    setRecentActivity(activityRes.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Posted', value: stats.totalPosted, icon: 'bi-megaphone', color: '#4cc9f0', bg: 'rgba(76, 201, 240, 0.1)' },
        { label: 'Active Jobs', value: stats.activeJobs, icon: 'bi-check2-circle', color: '#4361ee', bg: 'rgba(67, 97, 238, 0.1)' },
        { label: 'Closed Jobs', value: stats.closedJobs, icon: 'bi-slash-circle', color: '#f72585', bg: 'rgba(247, 37, 133, 0.1)' },
        { label: 'Total Applicants', value: stats.totalApplicants, icon: 'bi-people', color: '#20c997', bg: 'rgba(32, 201, 151, 0.1)' }
    ];

    return (
        <DashboardLayout role="employer">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Employer Dashboard</h3>
                <p className="text-muted small">Welcome back! Here's what's happening with your recruitment today.</p>
            </div>

            {/* Stats Grid */}
            <div className="row g-4 mb-5">
                {statCards.map((card, idx) => (
                    <div className="col-md-3" key={idx}>
                        <div className="content-card border-0 shadow-sm p-4 h-100 rounded-4 transition-hover">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: card.bg, color: card.color, width: '50px', height: '50px' }}>
                                    <i className={`bi ${card.icon} fs-4`}></i>
                                </div>
                                <div className="ms-auto">
                                    <span className="badge bg-light text-muted fw-normal">Live</span>
                                </div>
                            </div>
                            <h2 className="fw-bold mb-0">{card.value}</h2>
                            <p className="text-muted small mb-0">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="content-card border-0 shadow-sm rounded-4 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0">Recent Applications</h5>
                                <p className="text-muted extra-small mb-0">Latest applicants across your jobs</p>
                            </div>
                            <Link to="/dashboard/employer/applications" className="btn btn-sm btn-outline-teal rounded-pill px-3">View All</Link>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 ps-3 extra-small text-uppercase fw-bold text-muted">Candidate</th>
                                        <th className="border-0 extra-small text-uppercase fw-bold text-muted">Job Title</th>
                                        <th className="border-0 extra-small text-uppercase fw-bold text-muted text-center">Status</th>
                                        <th className="border-0 pe-3 extra-small text-uppercase fw-bold text-muted text-end">Applied</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border text-teal" role="status"></div></td></tr>
                                    ) : recentActivity.length > 0 ? (
                                        recentActivity.map((app) => (
                                            <tr key={app.id}>
                                                <td className="ps-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle bg-teal-light text-teal d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                            {app.applicant?.firstName?.charAt(0)}{app.applicant?.lastName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{app.applicant ? `${app.applicant.firstName} ${app.applicant.lastName}` : 'Anonymous'}</div>
                                                            <div className="extra-small text-muted">{app.applicant?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="small">{app.job ? app.job.title : 'Deleted Job'}</span></td>
                                                <td className="text-center">
                                                    <span className={`badge rounded-pill px-3 py-2 extra-small ${app.status === 'SUBMITTED' ? 'bg-primary-light text-primary' :
                                                            app.status === 'SHORTLISTED' ? 'bg-success-light text-success' :
                                                                'bg-secondary-light text-secondary'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="pe-3 text-end small text-muted">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted">No recent applications found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4 h-100">
                        {/* Quick Actions */}
                        <div className="content-card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4">Quick Actions</h5>
                            <div className="d-grid gap-3">
                                <Link to="/dashboard/employer/post-job" className="btn btn-teal text-white py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                                    <i className="bi bi-plus-circle-fill me-2 fs-5"></i> Post a New Job
                                </Link>
                                <Link to="/dashboard/employer/jobs" className="btn btn-light py-3 border rounded-3 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-briefcase me-2"></i> Manage My Jobs
                                </Link>
                                <Link to="/dashboard/employer/applications" className="btn btn-light py-3 border rounded-3 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-person-check me-2"></i> Review Applications
                                </Link>
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="content-card border-0 bg-teal text-white rounded-4 p-4 mt-auto">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-lightbulb fs-3 me-3"></i>
                                <h6 className="fw-bold mb-0">Recruitment Tip</h6>
                            </div>
                            <p className="small mb-0 opacity-75">
                                Response time matters! Candidates are 2x more likely to accept offers if you respond within 48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .transition-hover { transition: all 0.3s ease; }
                .transition-hover:hover { transform: translateY(-5px); }
                .extra-small { font-size: 0.7rem; }
                .bg-teal-light { background-color: rgba(32, 201, 151, 0.1); }
                .bg-primary-light { background-color: rgba(13, 110, 253, 0.1); }
                .bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
                .bg-secondary-light { background-color: rgba(108, 117, 125, 0.1); }
                .btn-outline-teal { color: #20c997; border-color: #20c997; }
                .btn-outline-teal:hover { background-color: #20c997; color: white; }
            `}</style>
        </DashboardLayout>
    );
};

export default EmployerDashboard
