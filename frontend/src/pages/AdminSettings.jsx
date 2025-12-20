import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <DashboardLayout role="admin">
            <div className="content-card">
                <div className="border-bottom mb-4">
                    <ul className="nav nav-tabs border-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'general' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('general')}
                            >
                                General Settings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'roles' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('roles')}
                            >
                                Roles & Permissions
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold ${activeTab === 'notifications' ? 'text-primary border-bottom border-primary active' : 'text-muted'}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                Notifications
                            </button>
                        </li>
                    </ul>
                </div>

                {activeTab === 'general' && (
                    <div className="p-2">
                        <h5 className="mb-4">System Configuration</h5>
                        <form>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Website Name</label>
                                    <input type="text" className="form-control" defaultValue="Smart Job Portal" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Support Email</label>
                                    <input type="email" className="form-control" defaultValue="support@smartjobportal.com" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Language</label>
                                    <select className="form-select">
                                        <option>English</option>
                                        <option>French</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Timezone</label>
                                    <select className="form-select">
                                        <option>(GMT+03:00) Nairobi</option>
                                        <option>(GMT+00:00) UTC</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Job Posting Rules</label>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="autoApprove" />
                                    <label className="form-check-label" htmlFor="autoApprove">Auto-approve jobs from trusted employers</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="checkbox" id="limitPosts" />
                                    <label className="form-check-label" htmlFor="limitPosts">Limit posts per employer (Max 10/month)</label>
                                </div>
                            </div>
                            <button type="button" className="btn btn-teal">Save System Changes</button>
                        </form>
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="p-2">
                        <h5 className="mb-4">Role & Permission Management</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Role</th>
                                        <th>Permissions</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Admin</strong></td>
                                        <td><span className="badge bg-primary me-1">Full Access</span></td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-outline-secondary">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employer</strong></td>
                                        <td>
                                            <span className="badge bg-info me-1 text-dark">Post Jobs</span>
                                            <span className="badge bg-info me-1 text-dark">View Applications</span>
                                        </td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-outline-secondary">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Job Seeker</strong></td>
                                        <td>
                                            <span className="badge bg-info me-1 text-dark">Apply Jobs</span>
                                            <span className="badge bg-info me-1 text-dark">Build CV</span>
                                        </td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-outline-secondary">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-2 text-center py-5">
                        <i className="bi bi-bell fs-1 text-muted mb-3 d-block"></i>
                        <h5>Notification Settings</h5>
                        <p className="text-muted">Configure Email and SMS alerts for platform events.</p>
                        <button className="btn btn-outline-primary mt-2">Configure Provider</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
