import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/NotificationService';
import { useEffect } from 'react';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const res = await NotificationService.getUnreadCount();
            setUnreadCount(res.data);
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await NotificationService.getNotifications(0, 5);
            setNotifications(res.data.content || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const toggleNotifications = () => {
        if (!showNotifications) {
            fetchNotifications();
        }
        setShowNotifications(!showNotifications);
    };

    const markRead = async (id) => {
        try {
            await NotificationService.markAsRead(id);
            fetchUnreadCount();
            fetchNotifications();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

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
            { icon: 'bi-journal-text', label: 'Manage Blogs', path: '/dashboard/admin/blogs' },
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
                        <h2>Welcome, {user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || 'User')}!</h2>
                        <p>Here's what's happening with your account today.</p>
                    </div>

                    <div className="header-actions">
                        <div className="dashboard-search">
                            <i className="bi bi-search text-muted"></i>
                            <input
                                type="text"
                                placeholder="Search jobs, skills..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/jobs?keyword=${e.target.value}`;
                                    }
                                }}
                            />
                        </div>
                        <div className="position-relative me-3">
                            <button
                                className="btn btn-light rounded-circle shadow-none p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                                onClick={toggleNotifications}
                            >
                                <i className="bi bi-bell fs-5 text-muted"></i>
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="notification-dropdown shadow-lg rounded-4 border-0 position-absolute end-0 mt-2 bg-white overflow-hidden" style={{ width: '320px', zIndex: 1050 }}>
                                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                        <h6 className="fw-bold mb-0">Notifications</h6>
                                        <button
                                            className="btn btn-link btn-sm text-decoration-none extra-small"
                                            onClick={async () => {
                                                await NotificationService.markAllAsRead();
                                                fetchUnreadCount();
                                                setShowNotifications(false);
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={`p-3 border-bottom position-relative ${!n.isRead ? 'bg-light' : ''}`}
                                                    onClick={() => markRead(n.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="d-flex gap-2">
                                                        <div className={`rounded-circle p-2 mt-1 flex-shrink-0 d-flex align-items-center justify-content-center ${!n.isRead ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '30px', height: '30px' }}>
                                                            <i className={`bi ${n.type === 'APPLICATION_STATUS' ? 'bi-info-circle' : 'bi-bell'} small`}></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{n.title}</div>
                                                            <div className="extra-small text-muted lh-sm my-1">{n.message}</div>
                                                            <div className="extra-small opacity-50">{new Date(n.createdAt).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-5 text-center text-muted small">No notifications yet.</div>
                                        )}
                                    </div>
                                    <div className="p-2 text-center border-top">
                                        <Link to="/dashboard/jobseeker/alerts" className="text-decoration-none extra-small fw-bold text-primary" onClick={() => setShowNotifications(false)}>View All Alerts</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="user-profile-header">
                            <div className="user-avatar-small bg-light border overflow-hidden d-flex align-items-center justify-content-center">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:8085${user.profilePicture}`} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    user?.firstName ? user.firstName.charAt(0) : (user?.name ? user.name.charAt(0) : 'U')
                                )}
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
