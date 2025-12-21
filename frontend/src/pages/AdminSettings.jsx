import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminService from '../services/AdminService';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (activeTab === 'general') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await AdminService.getSettings();
            if (res && Array.isArray(res.data)) {
                setSettings(res.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        try {
            await AdminService.updateSettings(settings);
            setMessage({ type: 'success', text: 'System settings updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to update settings.' });
        }
    };

    const getSettingValue = (key, defaultValue = '') => {
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : defaultValue;
    };

    return (
        <DashboardLayout role="admin">
            <div className="content-card shadow-sm border-0 p-4">
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

                {message.text && (
                    <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                        {message.text}
                        <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="p-2">
                        <h5 className="mb-4 fw-bold">System Configuration</h5>
                        {loading ? (
                            <div className="text-center py-5">Loading...</div>
                        ) : (
                            <form onSubmit={handleSaveGeneral}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Website Name</label>
                                        <input
                                            type="text"
                                            className="form-control shadow-none"
                                            value={getSettingValue('website_name')}
                                            onChange={e => handleSettingChange('website_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Support Email</label>
                                        <input
                                            type="email"
                                            className="form-control shadow-none"
                                            value={getSettingValue('support_email')}
                                            onChange={e => handleSettingChange('support_email', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Default Language</label>
                                        <select
                                            className="form-select shadow-none"
                                            value={getSettingValue('language')}
                                            onChange={e => handleSettingChange('language', e.target.value)}
                                        >
                                            <option>English</option>
                                            <option>French</option>
                                            <option>Spanish</option>
                                            <option>Swahili</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Timezone</label>
                                        <select
                                            className="form-select shadow-none"
                                            value={getSettingValue('timezone')}
                                            onChange={e => handleSettingChange('timezone', e.target.value)}
                                        >
                                            <option>(GMT+03:00) Nairobi</option>
                                            <option>(GMT+00:00) UTC</option>
                                            <option>(GMT-05:00) Eastern Time</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Job Posting Rules</label>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultChecked id="autoApprove" />
                                        <label className="form-check-label" htmlFor="autoApprove">Auto-approve jobs from trusted employers</label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" id="limitPosts" />
                                        <label className="form-check-label" htmlFor="limitPosts">Limit posts per employer (Max 10/month)</label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-teal px-4">Save System Changes</button>
                            </form>
                        )}
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="p-2">
                        <h5 className="mb-4 fw-bold">Role & Permission Management</h5>
                        <div className="table-responsive">
                            <table className="table border align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Permissions</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Admin</strong></td>
                                        <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle me-1">Full Access</span></td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-light border">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employer</strong></td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle me-1 text-dark">Post Jobs</span>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle me-1 text-dark">View Applications</span>
                                        </td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-light border">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Job Seeker</strong></td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle me-1 text-dark">Apply Jobs</span>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle me-1 text-dark">Build CV</span>
                                        </td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td><button className="btn btn-sm btn-light border">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-2 text-center py-5">
                        <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                            <i className="bi bi-bell fs-1 text-teal"></i>
                        </div>
                        <h5 className="fw-bold">Notification Settings</h5>
                        <p className="text-muted">Configure Email and SMS alerts for platform events.</p>
                        <button className="btn btn-outline-teal mt-2">Configure Provider</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
