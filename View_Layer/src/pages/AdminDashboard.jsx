import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import AdminService from '../services/AdminService'

const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalCompanies: 0,
        totalApplicants: 0,
        totalApplications: 0,
        pendingUsers: 0,
        pendingJobs: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Job Seekers, Employers

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsRes = await AdminService.getStats();
            const usersRes = await AdminService.getAllUsers();
            const appsRes = await AdminService.getRecentApplications();

            if (statsRes && statsRes.data) {
                setStats(statsRes.data);
            }
            if (usersRes && Array.isArray(usersRes.data)) {
                setUsers([...usersRes.data].reverse());
            }
            if (appsRes && Array.isArray(appsRes.data)) {
                setApplications(appsRes.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await AdminService.approveUser(id);
            fetchDashboardData(); // Refresh
        } catch (error) {
            console.error("Error approving user:", error);
        }
    };

    const handleSuspend = async (id) => {
        try {
            await AdminService.deactivateUser(id);
            fetchDashboardData();
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        if (filter === 'All') return true;
        if (filter === 'Job Seekers') return user.roles.some(r => r.name === 'ROLE_JOBSEEKER');
        if (filter === 'Employers') return user.roles.some(r => r.name === 'ROLE_EMPLOYER');
        return true;
    });

    return (
        <DashboardLayout role="admin">
            {/* Main Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-value">{stats.totalUsers || 0}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="stat-value">{stats.totalJobs || 0}</div>
                        <div className="stat-label">Total Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="bi bi-building"></i>
                        </div>
                        <div className="stat-value">{stats.totalCompanies || 0}</div>
                        <div className="stat-label">Companies</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <i className="bi bi-person-badge"></i>
                        </div>
                        <div className="stat-value">{stats.totalApplicants || 0}</div>
                        <div className="stat-label">Total Applicants</div>
                    </div>
                </div>
            </div>

            {/* Sub Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green-outline">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-value">{stats.activeJobs || 0}</div>
                        <div className="stat-label">Active Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon red-outline">
                            <i className="bi bi-x-circle"></i>
                        </div>
                        <div className="stat-value">{stats.closedJobs || 0}</div>
                        <div className="stat-label">Closed Jobs</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon yellow">
                            <i className="bi bi-person-check"></i>
                        </div>
                        <div className="stat-value">{stats.pendingUsers || 0}</div>
                        <div className="stat-label">Pending Users</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange-outline">
                            <i className="bi bi-file-earmark-check"></i>
                        </div>
                        <div className="stat-value">{stats.pendingJobs || 0}</div>
                        <div className="stat-label">Pending Jobs</div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                {/* Recent User Activity */}
                <div className="col-lg-7">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="content-title mb-0">Recent User Activity</h4>
                            <div className="btn-group">
                                <button className={`btn btn-sm ${filter === 'All' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter('All')}>All</button>
                                <button className={`btn btn-sm ${filter === 'Job Seekers' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter('Job Seekers')}>Job Seekers</button>
                                <button className={`btn btn-sm ${filter === 'Employers' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter('Employers')}>Employers</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>User Name</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.slice(0, 5).map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {user.firstName ? user.firstName.charAt(0) : 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{user.firstName} {user.lastName}</div>
                                                            <div className="text-muted" style={{ fontSize: '10px' }}>{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="small">
                                                    {user.roles.some(r => r.name === 'ROLE_EMPLOYER') ? 'Employer' : 'Job Seeker'}
                                                </td>
                                                <td>
                                                    {user.isActive ? (
                                                        user.isVerified ? <span className="badge bg-success rounded-pill" style={{ fontSize: '10px' }}>Active</span> : <span className="badge bg-warning text-dark rounded-pill" style={{ fontSize: '10px' }}>Pending</span>
                                                    ) : (
                                                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px' }}>Suspended</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        {user.roles.some(r => r.name === 'ROLE_EMPLOYER') && !user.isVerified ? (
                                                            <button className="btn btn-sm btn-success p-1 me-1" style={{ fontSize: '10px' }} onClick={() => handleApprove(user.id)}>Approve</button>
                                                        ) : null}
                                                        {user.isActive ? (
                                                            <button className="btn btn-sm btn-outline-danger p-1" style={{ fontSize: '10px' }} onClick={() => handleSuspend(user.id)}>Suspend</button>
                                                        ) : (
                                                            <span className="text-muted small">Suspended</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center">No users found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Application Activity */}
                <div className="col-lg-5">
                    <div className="content-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="content-title mb-0">Recent Applications</h4>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Job</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="text-center">Loading...</td></tr>
                                    ) : applications.length > 0 ? (
                                        applications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="fw-bold small">{app.applicant.firstName} {app.applicant.lastName}</div>
                                                    <div className="text-muted" style={{ fontSize: '10px' }}>{new Date(app.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="small">{app.job.title}</td>
                                                <td>
                                                    <span className={`badge rounded-pill style={{fontSize: '10px'}} ${app.status === 'ACCEPTED' ? 'bg-success' :
                                                        app.status === 'REJECTED' ? 'bg-danger' :
                                                            app.status === 'INTERVIEW_SCHEDULED' ? 'bg-info' : 'bg-secondary'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="text-center">No applications yet.</td></tr>
                                    )}
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
