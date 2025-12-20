import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const EmployerPostJob = () => {
    const { user } = useAuth();
    const isApproved = user?.status !== 'Pending'; // Simple check

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        skills: '',
        location: '',
        salary: '',
        deadline: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isApproved) {
            alert('Your account is not approved yet. You cannot post jobs.');
            return;
        }
        console.log('Posting Job:', jobData);
        alert('Job Posted Successfully!');
    };

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Post a New Job</h3>
            </div>

            {!isApproved && (
                <div className="alert alert-danger mb-4 shadow-sm border-0 d-flex align-items-center">
                    <i className="bi bi-exclamation-octagon-fill fs-3 me-3"></i>
                    <div>
                        <h6 className="mb-1 fw-bold">Action Restricted</h6>
                        <p className="mb-0 small">Your account is currently <strong>Pending Approval</strong>. You will be able to post jobs once the admin verifies your company.</p>
                    </div>
                </div>
            )}

            <div className="content-card">
                <form onSubmit={handleSubmit} className={!isApproved ? 'opacity-50' : ''}>
                    <div className="row g-4">
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control form-control-lg"
                                placeholder="e.g. Senior Frontend Developer"
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Job Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="6"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            ></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Required Skills</label>
                            <input
                                type="text"
                                name="skills"
                                className="form-control"
                                placeholder="e.g. React, Node.js, TypeScript"
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                placeholder="e.g. Remote or San Francisco, CA"
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Salary (Optional)</label>
                            <input
                                type="text"
                                name="salary"
                                className="form-control"
                                placeholder="e.g. $100k - $130k"
                                onChange={handleChange}
                                disabled={!isApproved}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Application Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                className="form-control"
                                onChange={handleChange}
                                required
                                disabled={!isApproved}
                            />
                        </div>
                        <div className="col-12 mt-4 text-end">
                            <button type="button" className="btn btn-outline-secondary px-4 me-2">Save as Draft</button>
                            <button type="submit" className="btn btn-teal px-5" disabled={!isApproved}>Publish Job</button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EmployerPostJob;
