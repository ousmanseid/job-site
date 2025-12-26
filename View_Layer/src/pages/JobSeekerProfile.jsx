import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import JobSeekerService from '../services/JobSeekerService';

const JobSeekerProfile = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: '',
        profilePicture: '',
        status: 'Actively Looking'
    });
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await JobSeekerService.getProfile();
                if (res.data) {
                    setProfile({
                        firstName: res.data.firstName || '',
                        lastName: res.data.lastName || '',
                        email: res.data.email || '',
                        phone: res.data.phone || '',
                        location: res.data.city || '',
                        bio: res.data.bio || '',
                        skills: res.data.skills || '',
                        profilePicture: res.data.profilePicture || '',
                        status: 'Actively Looking'
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await JobSeekerService.updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                location: profile.location,
                bio: profile.bio,
                skills: profile.skills
            });
            setIsEditing(false);
            // Update global state
            updateUser({
                ...user,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                city: profile.location,
                bio: profile.bio
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile.');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await JobSeekerService.uploadProfilePicture(file);
            const newPhotoUrl = res.data.profilePicture;
            setProfile({ ...profile, profilePicture: newPhotoUrl });
            // Update global state
            updateUser({
                ...user,
                profilePicture: newPhotoUrl
            });
            alert('Profile picture updated!');
        } catch (error) {
            console.error("Error uploading picture:", error);
            alert('Failed to upload picture.');
        } finally {
            setUploading(false);
        }
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
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border overflow-hidden shadow-sm" style={{ width: '130px', height: '130px' }}>
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/130?text=User"; }} />
                                ) : (
                                    <i className="bi bi-person display-4 text-secondary"></i>
                                )}
                                {uploading && (
                                    <div className="position-absolute translate-middle top-50 start-50">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    </div>
                                )}
                            </div>
                            <button
                                className="btn btn-sm btn-dark position-absolute bottom-0 end-0 rounded-circle shadow-none border-2 border-white"
                                style={{ width: '36px', height: '36px', padding: '0', zIndex: 2 }}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <i className="bi bi-camera-fill small"></i>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="d-none"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h5 className="fw-bold mb-1">{profile.firstName} {profile.lastName}</h5>
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
                                        <label className="form-label small fw-bold">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Skills (Comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="React, Node.js, Python..."
                                            value={profile.skills}
                                            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                                        />
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
                                    <p className="mt-1 text-dark">{profile.bio || 'No bio provided'}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="text-muted small fw-bold text-uppercase">Skills</label>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        {profile.skills ? profile.skills.split(',').map(s => (
                                            <span key={s} className="badge bg-light text-dark border px-3 py-1 fw-normal">{s.trim()}</span>
                                        )) : <span className="text-muted small">No specific skills listed.</span>}
                                    </div>
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
