import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import EmployerService from '../services/EmployerService';
import UserService from '../services/UserService';

const EmployerProfile = () => {
    const { user, login } = useAuth(); // We might need to refresh user in context
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        companyName: '',
        description: '',
        email: '',
        location: '',
        website: '',
        industry: '',
        phone: '',
        profilePicture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await EmployerService.getProfile();
            const userRes = await UserService.getMyProfile();

            if (res.data) {
                setProfile({
                    companyName: res.data.companyName || '',
                    description: res.data.description || '',
                    email: userRes.data.email || '',
                    location: res.data.location || '',
                    website: res.data.website || '',
                    industry: res.data.industry || 'Technology',
                    phone: userRes.data.phone || '',
                    profilePicture: userRes.data.profilePicture || ''
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            // Update company info
            await EmployerService.updateProfile({
                companyName: profile.companyName,
                description: profile.description,
                location: profile.location,
                website: profile.website,
                industry: profile.industry
            });

            // Update user info (email and phone)
            await UserService.updateProfile(user.id, {
                email: profile.email,
                phone: profile.phone
            });

            setIsEditing(false);
            alert('Profile updated successfully!');
            fetchProfile(); // Refresh
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile. Email might already be in use.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setSaving(true);
                await UserService.uploadProfilePicture(file);
                alert('Profile picture updated!');
                fetchProfile();
            } catch (error) {
                console.error("Error uploading photo:", error);
                alert('Failed to upload photo.');
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="employer">
                <div className="text-center py-5">
                    <div className="spinner-border text-teal" role="status"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="employer">
            <h3 className="fw-bold mb-4">Company Profile Settings</h3>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="content-card text-center p-4 shadow-sm border-0 rounded-4">
                        <div className="position-relative d-inline-block mb-3">
                            <div
                                className="rounded-circle bg-light border-4 border-white shadow-sm overflow-hidden d-flex align-items-center justify-content-center cursor-pointer hover-opacity"
                                style={{ width: '150px', height: '150px', border: 'solid 1px #eee' }}
                                onClick={handlePhotoClick}
                            >
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture.startsWith('http') ? profile.profilePicture : `http://localhost:8085${profile.profilePicture}`}
                                        alt="Profile"
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                ) : (
                                    <i className="bi bi-building fs-1 text-muted"></i>
                                )}
                                <div className="position-absolute bottom-0 end-0 bg-teal text-white rounded-circle p-2 shadow-sm">
                                    <i className="bi bi-camera-fill"></i>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="d-none"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h4 className="fw-bold mb-1">{profile.companyName}</h4>
                        <p className="text-muted small mb-3">{profile.industry}</p>

                        <div className={`badge rounded-pill px-3 py-2 ${user?.isVerified ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                            <i className={`bi ${user?.isVerified ? 'bi-check-circle-fill' : 'bi-clock-history'} me-2`}></i>
                            {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
                        </div>

                        <hr className="my-4 opacity-50" />

                        <div className="text-start">
                            <h6 className="fw-bold extra-small text-uppercase text-muted mb-3">Company Details</h6>
                            <div className="d-flex align-items-center mb-3 small">
                                <i className="bi bi-envelope text-teal me-3"></i>
                                <span>{profile.email}</span>
                            </div>
                            <div className="d-flex align-items-center mb-3 small">
                                <i className="bi bi-geo-alt text-teal me-3"></i>
                                <span>{profile.location || 'Location not set'}</span>
                            </div>
                            <div className="d-flex align-items-center mb-0 small">
                                <i className="bi bi-globe text-teal me-3"></i>
                                <a href={profile.website} target="_blank" rel="noreferrer" className="text-decoration-none text-dark">{profile.website || 'No website'}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="content-card shadow-sm border-0 rounded-4 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">General Information</h5>
                            {!isEditing && (
                                <button className="btn btn-teal text-white btn-sm px-4 rounded-pill" onClick={() => setIsEditing(true)}>
                                    <i className="bi bi-pencil-square me-2"></i>Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.companyName}
                                            onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Industry</label>
                                        <select
                                            className="form-select"
                                            value={profile.industry}
                                            onChange={e => setProfile({ ...profile, industry: e.target.value })}
                                        >
                                            <option value="Technology">Technology</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Education">Education</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Services">Services</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Login Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Contact Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label small fw-bold">Location / Headquarters</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.location}
                                            onChange={e => setProfile({ ...profile, location: e.target.value })}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label small fw-bold">Website URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            value={profile.website}
                                            onChange={e => setProfile({ ...profile, website: e.target.value })}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label small fw-bold">Company Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={profile.description}
                                            onChange={e => setProfile({ ...profile, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-teal text-white px-4 rounded-pill" disabled={saving}>
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button type="button" className="btn btn-light px-4 rounded-pill" onClick={() => setIsEditing(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <h6 className="fw-bold small text-muted text-uppercase mb-2">About the Company</h6>
                                    <p className="text-muted small lh-lg">{profile.description || 'No description provided yet. Click edit to add one.'}</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-1">Industry</h6>
                                        <p className="small mb-0">{profile.industry}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-1">Location</h6>
                                        <p className="small mb-0">{profile.location || 'Not set'}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-1">Official Email</h6>
                                        <p className="small mb-0">{profile.email}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-1">Phone Number</h6>
                                        <p className="small mb-0">{profile.phone || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
                .bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
                .hover-opacity:hover { opacity: 0.8; cursor: pointer; }
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </DashboardLayout>
    );
};

export default EmployerProfile;
