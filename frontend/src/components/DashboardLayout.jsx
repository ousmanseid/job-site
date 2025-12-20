import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Define sidebar items based on role
    const sidebarItems = {
        jobseeker: [
            { icon: 'bi-grid-fill', label: 'Dashboard', path: '/dashboard/jobseeker' },
            { icon: 'bi-briefcase-fill', label: 'Applied Jobs', path: '/dashboard/jobseeker/applied' },
            { icon: 'bi-file-earmark-person-fill', label: 'My CV', path: '/dashboard/jobseeker/cv' },
            { icon: 'bi-bell-fill', label: 'Job Alerts', path: '/dashboard/jobseeker/alerts' },
            { icon: 'bi-search', label: 'Find Jobs', path: '/jobs' }, // Public Search
            { icon: 'bi-person-circle', label: 'Profile', path: '/dashboard/jobseeker/profile' },
        ],
        employer: [
            { icon: 'bi-grid-fill', label: 'Dashboard', path: '/dashboard/employer' },
            { icon: 'bi-plus-circle-fill', label: 'Post a Job', path: '/dashboard/employer/post-job' },
            { icon: 'bi-briefcase-fill', label: 'Manage Jobs', path: '/dashboard/employer/jobs' },
            { icon: 'bi-people-fill', label: 'Applications', path: '/dashboard/employer/applications' },
            { icon: 'bi-building', label: 'Company Profile', path: '/dashboard/employer/profile' },
        ],
        admin: [
            { icon: 'bi-grid-fill', label: 'Dashboard', path: '/dashboard/admin' },
            { icon: 'bi-file-earmark-text-fill', label: 'CV Templates', path: '/dashboard/admin/cv' },
            { icon: 'bi-people-fill', label: 'Manage Users', path: '/dashboard/admin/users' },
            { icon: 'bi-check-circle-fill', label: 'Approvals', path: '/dashboard/admin/approvals' },
            { icon: 'bi-gear-fill', label: 'Settings', path: '/dashboard/admin/settings' },
        ]
    };

    const items = sidebarItems[role] || [];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <Link to="/" className="sidebar-brand">
                    <div className="bg-white text-dark rounded p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>SJ</span>
                    </div>
                    <span>SmartJob</span>
                </Link>

                <ul className="sidebar-menu">
                    {items.map((item, index) => (
                        <li key={index} className="sidebar-item">
                            <Link
                                to={item.path}
                                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    {/* Logout at bottom */}
                    <li className="sidebar-item mt-auto">
                        <button onClick={logout} className="sidebar-link w-100 border-0 bg-transparent text-start">
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="welcome-text">
                        <h2>Welcome, {user?.name || 'User'}!</h2>
                        <p>Here's what's happening with your account today.</p>
                    </div>

                    <div className="header-actions">
                        <div className="dashboard-search">
                            <i className="bi bi-search text-muted"></i>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <div className="user-profile-header">
                            <div className="user-avatar-small">
                                {user?.name ? user.name.charAt(0) : 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
