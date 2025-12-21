import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobService from '../services/JobService';
import ApplicationService from '../services/ApplicationService';
import JobSeekerService from '../services/JobSeekerService';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState("I am interested in this position and believe my skills align perfectly with the requirements.");
    const [userCVs, setUserCVs] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const res = await JobService.getJobById(id);
            if (res.data) {
                setJob(res.data);
                // Check if user already applied
                if (user && (user.role === 'JOBSEEKER' || user.role === 'jobseeker')) {
                    try {
                        const appsRes = await ApplicationService.getMyApplications();
                        const hasApplied = appsRes.data.some(app => app.job?.id === parseInt(id));
                        setApplied(hasApplied);
                    } catch (err) {
                        console.error("Error checking application status:", err);
                    }

                    // Fetch user CVs
                    try {
                        const cvRes = await JobSeekerService.getCVs();
                        console.log("CV Response:", cvRes);
                        if (cvRes && cvRes.data) {
                            const cvList = Array.isArray(cvRes.data) ? cvRes.data : [];
                            setUserCVs(cvList);
                            console.log("CVs loaded:", cvList);
                            // find default
                            const defCV = cvList.find(c => c.isDefault);
                            if (defCV) {
                                setSelectedCV(defCV.id);
                            } else if (cvList.length > 0) {
                                setSelectedCV(cvList[0].id);
                            }
                        } else {
                            setUserCVs([]);
                        }
                    } catch (err) {
                        console.error("Error fetching CVs:", err);
                        setUserCVs([]);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if ((!userCVs || userCVs.length === 0) && !selectedCV) {
            if (!window.confirm("You are applying without a CV. Employers typically prefer candidates with a CV. Are you sure you want to proceed?")) {
                return;
            }
        }
        try {
            setIsApplying(true);
            await ApplicationService.applyForJob(id, coverLetter, selectedCV);
            alert('Application submitted successfully!');
            setApplied(true);
            setShowApplyModal(false);
        } catch (error) {
            console.error("Error applying for job:", error);
            alert(error.response?.data || 'Failed to submit application.');
        } finally {
            setIsApplying(false);
        }
    };

    const openApplyModal = () => {
        if (!user) {
            alert('Please login as a Job Seeker to apply.');
            navigate('/login');
            return;
        }

        const userRole = (user.roles?.[0]?.name || user.role || '').toUpperCase();
        if (userRole !== 'ROLE_JOBSEEKER' && userRole !== 'JOBSEEKER') {
            alert('Only Job Seekers can apply for roles.');
            return;
        }
        setShowApplyModal(true);
    };

    if (loading) {
        return (
            <div className="container py-5 mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container py-5 mt-5 text-center">
                <h3>Job Not Found</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/jobs')}>Back to Listings</button>
            </div>
        );
    }

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-bold mb-1">{job.title}</h2>
                                <p className="mb-0 opacity-75">{job.company?.name || 'Private Company'} • {job.location}</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-light shadow-none" onClick={() => navigate(-1)}>Back</button>
                                {!applied ? (
                                    <button
                                        className="btn btn-teal text-white fw-bold px-4 shadow-none"
                                        onClick={openApplyModal}
                                    >
                                        Apply Now
                                    </button>
                                ) : (
                                    <button className="btn btn-success fw-bold px-4 shadow-none" disabled>Applied ✓</button>
                                )}
                            </div>
                        </div>

                        <div className="card-body p-lg-5">
                            <div className="row mb-5 g-4">
                                <div className="col-md-3 border-end">
                                    <div className="ps-2">
                                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Salary Range</label>
                                        <p className="fw-bold text-success mb-0">
                                            {job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : 'Negotiable'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-3 border-end">
                                    <div className="ps-2">
                                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Job Type</label>
                                        <p className="fw-bold mb-0">{job.jobType}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 border-end">
                                    <div className="ps-2">
                                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Posted On</label>
                                        <p className="fw-bold mb-0">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="ps-2">
                                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Openings</label>
                                        <p className="fw-bold mb-0">{job.openings} Position(s)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-8">
                                    <h5 className="fw-bold mb-3 border-bottom pb-2">Job Description</h5>
                                    <div className="job-description mb-5 lh-lg text-dark">
                                        {job.description}
                                    </div>

                                    <h5 className="fw-bold mb-3 border-bottom pb-2">Requirements</h5>
                                    <div className="job-requirements mb-5 lh-lg text-dark">
                                        {job.requirements}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="card border p-4 rounded-4 bg-light mb-4">
                                        <h6 className="fw-bold mb-3">Required Skills</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {job.skillsRequired ? job.skillsRequired.split(',').map(skill => (
                                                <span key={skill} className="badge bg-white text-dark border px-3 py-2 fw-normal small shadow-sm">{skill.trim()}</span>
                                            )) : <span className="text-muted">Not specified</span>}
                                        </div>
                                    </div>

                                    <div className="card border p-4 rounded-4 bg-white shadow-sm">
                                        <h6 className="fw-bold mb-2">About {job.company?.name || 'the Company'}</h6>
                                        <p className="mb-0 small text-muted lh-base">
                                            {job.company?.description || 'This company has not provided a description yet.'}
                                        </p>
                                        {job.company && (
                                            <div className="mt-3">
                                                <Link to={`/companies/${job.company.id}`} className="text-primary small fw-bold text-decoration-none">View Company Profile →</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowApplyModal(false)}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-0 pb-0 p-4">
                                <div>
                                    <h5 className="fw-bold mb-1">Apply for {job.title}</h5>
                                    <p className="text-muted small mb-0">Complete the form below to submit your application</p>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {/* CV Selection Section */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted mb-2">
                                        <i className="bi bi-file-earmark-person me-2"></i>
                                        Select CV
                                    </label>
                                    <select
                                        className="form-select form-select-lg shadow-none"
                                        value={selectedCV || ''}
                                        onChange={(e) => setSelectedCV(e.target.value ? parseInt(e.target.value) : null)}
                                        disabled={!userCVs || userCVs.length === 0}
                                    >
                                        <option value="" disabled>Select a CV</option>
                                        {Array.isArray(userCVs) && userCVs.map(cv => (
                                            <option key={cv.id} value={cv.id}>
                                                {cv.title || cv.fileName || `CV ${cv.id}`}
                                                {cv.isDefault ? ' (Default)' : ''}
                                            </option>
                                        ))}
                                    </select>

                                    {/* CV Status Messages */}
                                    {(!userCVs || userCVs.length === 0) ? (
                                        <div className="alert alert-warning mt-3 mb-0 d-flex align-items-start">
                                            <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>
                                            <div className="flex-grow-1">
                                                <strong className="d-block mb-1">No saved CVs found!</strong>
                                                <p className="small mb-2">You can upload a new CV below or create one in your profile.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-success mt-3 mb-0 d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <span className="small">
                                                <strong>{userCVs.length}</strong> CV{userCVs.length > 1 ? 's' : ''} available
                                                {selectedCV && ` • Selected: ${userCVs.find(cv => cv.id === parseInt(selectedCV))?.title || 'Default'}`}
                                            </span>
                                        </div>
                                    )}

                                    {/* Quick Upload CV */}
                                    <div className="mt-3">
                                        <p className="small text-muted mb-2 fw-bold">OR UPLOAD A NEW CV</p>
                                        <div className="input-group">
                                            <input
                                                type="file"
                                                className="form-control shadow-none"
                                                id="quickCVUpload"
                                                accept=".pdf,.doc,.docx"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    try {
                                                        const confirmUpload = window.confirm(`Upload "${file.name}" and use it for this application?`);
                                                        if (!confirmUpload) {
                                                            e.target.value = '';
                                                            return;
                                                        }

                                                        // Show loading state if needed
                                                        const title = `CV for ${job.title.substring(0, 20)}...`;
                                                        const res = await JobSeekerService.uploadCV(file, title);

                                                        if (res && res.data) {
                                                            alert("CV uploaded successfully!");
                                                            // Add to list and select it
                                                            const newCV = res.data;
                                                            setUserCVs(prev => [...prev, newCV]);
                                                            setSelectedCV(newCV.id);
                                                            e.target.value = ''; // Clear input
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Failed to upload CV. Please try again.");
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="form-text small">Supported formats: PDF, DOC, DOCX. Max 5MB.</div>
                                    </div>
                                </div>

                                {/* Cover Letter Section */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted mb-2">
                                        <i className="bi bi-envelope me-2"></i>
                                        Cover Letter / Note to Employer
                                    </label>
                                    <textarea
                                        className="form-control shadow-none"
                                        rows="5"
                                        placeholder="Explain why you are a perfect fit for this role. Highlight your relevant experience and skills..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        style={{ resize: 'vertical' }}
                                    ></textarea>
                                    <div className="form-text small">
                                        <i className="bi bi-lightbulb me-1"></i>
                                        Tip: Personalize your cover letter to stand out from other applicants
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 p-4 bg-light">
                                <button
                                    className="btn btn-light px-4 py-2 rounded-pill fw-bold"
                                    onClick={() => setShowApplyModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-teal text-white px-4 py-2 rounded-pill fw-bold"
                                    onClick={handleApply}
                                    disabled={isApplying}
                                >
                                    {isApplying ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2"></i>
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .modal.show {
                    display: block;
                    overflow-y: auto;
                }
                .modal-dialog {
                    margin: 1.75rem auto;
                }
                @media (max-width: 576px) {
                    .modal-dialog {
                        margin: 0.5rem;
                        max-width: calc(100% - 1rem);
                    }
                    .modal-body {
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobDetails;
