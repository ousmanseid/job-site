import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import EmployerService from '../services/EmployerService';

const EmployerPostJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isApproved = user?.isVerified === true;

    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        requirements: '',
        skillsRequired: '',
        location: '',
        jobType: 'FULL_TIME',
        workMode: 'ONSITE',
        salaryMin: '',
        salaryMax: '',
        openings: 1,
        applicationDeadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isApproved) {
            alert('Your account is not approved yet. You cannot post jobs.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...jobData,
                salaryMin: jobData.salaryMin ? Number(jobData.salaryMin) : null,
                salaryMax: jobData.salaryMax ? Number(jobData.salaryMax) : null,
                openings: parseInt(jobData.openings) || 1
            };

            await EmployerService.postJob(payload);
            alert('Job Submitted for Approval! The admin will review it shortly.');
            navigate('/dashboard/employer/jobs');
        } catch (error) {
            console.error("Error posting job:", error);
            const msg = error.response?.data?.message || error.response?.data || "Please check all fields.";
            alert(`Failed to post job: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    return (
        <DashboardLayout role="employer">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Create New Job Listing</h3>
                <p className="text-muted small">Fill in the details below. Your job will be reviewed by an admin before going live.</p>
            </div>

            {!isApproved && (
                <div className="alert alert-warning mb-4 shadow-sm border-0 d-flex align-items-center rounded-4 p-3">
                    <i className="bi bi-shield-lock-fill fs-3 me-3 text-warning"></i>
                    <div>
                        <h6 className="mb-1 fw-bold">Verification Pending</h6>
                        <p className="mb-0 small">Your account is undergoing verification. You can draft your job post, but it will be visible once approved.</p>
                    </div>
                </div>
            )}

            <div className="content-card shadow-sm border-0 rounded-4 p-4 p-md-5">
                <form onSubmit={handleSubmit} className={!isApproved ? 'opacity-75' : ''}>
                    <div className="row g-4">
                        <div className="col-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control form-control-lg border-2"
                                placeholder="e.g. Senior Backend Engineer"
                                value={jobData.title}
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Category</label>
                            <select name="category" className="form-select border-2" onChange={handleChange} disabled={!isApproved}>
                                <option value="">Select Category</option>
                                <option value="IT & Software">IT & Software</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Design">Design</option>
                                <option value="Sales">Sales</option>
                                <option value="Finance">Finance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control border-2"
                                placeholder="e.g. New York, NY (or Remote)"
                                value={jobData.location}
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Description</label>
                            <textarea
                                name="description"
                                className="form-control border-2"
                                rows="5"
                                placeholder="What does this role involve?"
                                value={jobData.description}
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            ></textarea>
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Key Requirements</label>
                            <textarea
                                name="requirements"
                                className="form-control border-2"
                                rows="4"
                                placeholder="Skills, qualifications, and experience needed..."
                                value={jobData.requirements}
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            ></textarea>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Type</label>
                            <div className="d-flex flex-wrap gap-2">
                                {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`btn btn-sm rounded-pill px-3 ${jobData.jobType === type ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                                        onClick={() => setJobData({ ...jobData, jobType: type })}
                                        disabled={!isApproved}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Work Mode</label>
                            <div className="d-flex flex-wrap gap-2">
                                {['ONSITE', 'REMOTE', 'HYBRID'].map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        className={`btn btn-sm rounded-pill px-3 ${jobData.workMode === mode ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                                        onClick={() => setJobData({ ...jobData, workMode: mode })}
                                        disabled={!isApproved}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Salary Range (Min)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-2 border-end-0">$</span>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    className="form-control border-2 border-start-0"
                                    placeholder="50,000"
                                    value={jobData.salaryMin}
                                    onChange={handleChange}
                                    disabled={!isApproved}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Salary Range (Max)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-2 border-end-0">$</span>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    className="form-control border-2 border-start-0"
                                    placeholder="100,000"
                                    value={jobData.salaryMax}
                                    onChange={handleChange}
                                    disabled={!isApproved}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Application Deadline</label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                className="form-control border-2"
                                value={jobData.applicationDeadline}
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>

                        <div className="col-12 mt-5">
                            <div className="d-flex flex-column flex-md-row gap-3">
                                <button type="submit" className="btn btn-teal btn-lg px-5 text-white fw-bold shadow-sm" disabled={!isApproved || loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                    ) : 'Submit for Approval'}
                                </button>
                                <button type="button" className="btn btn-light btn-lg px-4" onClick={() => navigate(-1)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EmployerPostJob;
