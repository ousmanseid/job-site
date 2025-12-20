import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const JobSeekerProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+254 712 345 678',
        location: 'Nairobi, Kenya',
        bio: 'Passionate software developer with 3 years of experience in React and Java.',
        status: 'Actively Looking'
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted.');
            logout();
        }
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="fw-bold mb-0">My Profile</h4>
                    {!isEditing && (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
                            <i className="bi bi-pencil me-1"></i> Edit Profile
                        </button>
                    )}
                </div>

                <div className="row">
                    <div className="col-md-4 text-center border-end">
                        <div className="position-relative d-inline-block mb-3">
                            <div className="bg-light rounded-circle p-4 d-flex align-items-center justify-content-center border" style={{ width: '130px', height: '130px' }}>
                                <i className="bi bi-person display-4 text-secondary"></i>
                            </div>
                            <button className="btn btn-sm btn-dark position-absolute bottom-0 end-0 rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}>
                                <i className="bi bi-camera-fill small"></i>
                            </button>
                        </div>
                        <h5 className="fw-bold mb-1">{profile.name}</h5>
                        <p className="text-muted small mb-3">{profile.location}</p>
                        <span className="badge bg-success-soft text-success rounded-pill px-3 py-2 mb-4" style={{ backgroundColor: '#e8f5e9' }}>
                            <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i> {profile.status}
                        </span>

                        <div className="d-grid gap-2 mt-2">
                            <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                                <i className="bi bi-trash me-1"></i> Delete Account
                            </button>
                        </div>
                    </div>

                    <div className="col-md-8 ps-md-5 mt-4 mt-md-0">
                        {isEditing ? (
                            <form onSubmit={handleUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Email</label>
                                        <input type="email" className="form-control" value={profile.email} disabled />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Professional Bio</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-12 d-flex gap-2 pt-3">
                                        <button type="submit" className="btn btn-teal px-4 text-white">Save Changes</button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-view">
                                <div className="mb-4">
                                    <label className="text-muted small fw-bold text-uppercase">About Me</label>
                                    <p className="mt-1 text-dark">{profile.bio}</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Email</label>
                                        <p className="mt-1 fw-bold">{profile.email}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Phone</label>
                                        <p className="mt-1 fw-bold">{profile.phone}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Preferred Location</label>
                                        <p className="mt-1 fw-bold">{profile.location}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small fw-bold text-uppercase">Profile Status</label>
                                        <p className="mt-1 text-primary fw-bold">Account Active</p>
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

export default JobSeekerProfile;
