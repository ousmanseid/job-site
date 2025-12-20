import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const EmployerProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        companyName: 'TechCorp Solutions',
        description: 'Leading technology solutions provider specializing in React and Node.js development.',
        email: user?.email || 'hr@techcorp.com',
        location: 'San Francisco, CA',
        website: 'www.techcorp.com'
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account? This action is permanent.')) {
            alert('Account deleted.');
            logout();
        }
    };

    return (
        <DashboardLayout role="employer">
            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="fw-bold mb-0">Company Profile</h4>
                    {!isEditing && (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
                            <i className="bi bi-pencil me-1"></i> Edit Profile
                        </button>
                    )}
                </div>

                <div className="row">
                    <div className="col-md-4 text-center border-end">
                        <div className="bg-light rounded-circle p-4 d-inline-block mb-3" style={{ width: '120px', height: '120px' }}>
                            <i className="bi bi-building display-4 text-primary"></i>
                        </div>
                        <h5 className="fw-bold">{profile.companyName}</h5>
                        <p className="badge bg-success rounded-pill px-3">Approved</p>
                        <div className="mt-4">
                            <button className="btn btn-outline-danger btn-sm w-100" onClick={handleDelete}>
                                <i className="bi bi-trash me-1"></i> Delete Account
                            </button>
                        </div>
                    </div>

                    <div className="col-md-8 ps-md-5">
                        {isEditing ? (
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={profile.companyName}
                                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={profile.email} disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Company Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={profile.description}
                                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="mb-4">
                                    <label className="text-muted small fw-bold text-uppercase">Description</label>
                                    <p className="mt-1">{profile.description}</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Email</label>
                                        <p className="mt-1">{profile.email}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Location</label>
                                        <p className="mt-1">{profile.location}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Website</label>
                                        <p className="mt-1 text-primary">{profile.website}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Account Status</label>
                                        <p className="mt-1 text-success fw-bold">Active / Verified</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerProfile;
