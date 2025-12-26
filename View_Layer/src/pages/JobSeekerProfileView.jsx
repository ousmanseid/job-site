import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import JobSeekerService from '../services/JobSeekerService';

const JobSeekerProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We need a specific endpoint to view other profiles if authorized
        // For now, let's assume we can fetch it if we have the ID and are an employer
        const fetchProfile = async () => {
            try {
                setLoading(true);
                // Need to add this method or use a generic one
                // For now, let's try to fetch via a new service method or just axios
                const { default: axios } = await import('../services/axiosInstance');
                const res = await axios.get(`/api/jobseeker/profile/${id}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching job seeker profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout role="employer">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!profile) {
        return (
            <DashboardLayout role="employer">
                <div className="alert alert-danger">Profile not found or access denied.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Candidate Profile</h3>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i>Back to Applicants
                </button>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className="content-card text-center p-4">
                        <div className="mb-3">
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture.startsWith('http') ? profile.profilePicture : `http://localhost:8085${profile.profilePicture}`}
                                    alt="Profile"
                                    className="rounded-circle shadow-sm"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #f8f9fa' }}
                                />
                            ) : (
                                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center border" style={{ width: '120px', height: '120px' }}>
                                    <i className="bi bi-person fs-1 text-muted"></i>
                                </div>
                            )}
                        </div>
                        <h4 className="fw-bold mb-1">{profile.firstName} {profile.lastName}</h4>
                        <p className="text-muted small mb-3">{profile.email}</p>

                        <div className="d-flex justify-content-center gap-2 mb-4">
                            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-circle"><i className="bi bi-linkedin"></i></a>}
                            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark rounded-circle"><i className="bi bi-github"></i></a>}
                            {profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info rounded-circle"><i className="bi bi-globe"></i></a>}
                        </div>

                        <hr />

                        <div className="text-start mt-3">
                            <div className="mb-3">
                                <label className="extra-small text-uppercase fw-bold text-muted d-block">Location</label>
                                <span className="small"><i className="bi bi-geo-alt me-2"></i>{profile.city || profile.address || 'Not specified'}</span>
                            </div>
                            <div className="mb-3">
                                <label className="extra-small text-uppercase fw-bold text-muted d-block">Phone</label>
                                <span className="small"><i className="bi bi-telephone me-2"></i>{profile.phone || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="content-card p-4 mb-4">
                        <h5 className="fw-bold mb-3">About / Bio</h5>
                        <p className="text-muted lh-lg">
                            {profile.bio || 'This candidate hasn\'t provided a bio yet.'}
                        </p>
                    </div>

                    <div className="content-card p-4">
                        <h5 className="fw-bold mb-4">Skills & Expertise</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {profile.skills ? profile.skills.split(',').map(s => (
                                <span key={s} className="badge bg-light text-dark border px-3 py-2 fw-normal">{s.trim()}</span>
                            )) : <span className="text-muted small">No specific skills listed.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerProfileView;
