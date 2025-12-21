import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import EmployerService from '../services/EmployerService';

const EmployerEditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await EmployerService.getJobById(id);
                if (res.data) {
                    setJobData({
                        ...res.data,
                        salaryMin: res.data.salaryMin || '',
                        salaryMax: res.data.salaryMax || '',
                        applicationDeadline: res.data.applicationDeadline ? res.data.applicationDeadline.split('T')[0] : ''
                    });
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                alert("Failed to load job details.");
                navigate('/dashboard/employer/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                ...jobData,
                salaryMin: jobData.salaryMin ? Number(jobData.salaryMin) : null,
                salaryMax: jobData.salaryMax ? Number(jobData.salaryMax) : null,
                openings: parseInt(jobData.openings) || 1
            };

            await EmployerService.updateJob(id, payload);
            alert('Job Updated Successfully!');
            navigate('/dashboard/employer/jobs');
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job post.");
        } finally {
            setSaving(false);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Edit Job Post</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
            </div>

            <div className="content-card shadow-sm border-0 rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control form-control-lg border-2"
                                value={jobData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Description</label>
                            <textarea
                                name="description"
                                className="form-control border-2"
                                rows="6"
                                value={jobData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Requirements</label>
                            <textarea
                                name="requirements"
                                className="form-control border-2"
                                rows="4"
                                value={jobData.requirements}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Required Skills</label>
                            <input
                                type="text"
                                name="skillsRequired"
                                className="form-control border-2"
                                placeholder="React, Java, etc."
                                value={jobData.skillsRequired}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control border-2"
                                value={jobData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Job Type</label>
                            <select name="jobType" className="form-select border-2" value={jobData.jobType} onChange={handleChange}>
                                <option value="FULL_TIME">Full-time</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Work Mode</label>
                            <select name="workMode" className="form-select border-2" value={jobData.workMode} onChange={handleChange}>
                                <option value="ONSITE">On-site</option>
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Openings</label>
                            <input
                                type="number"
                                name="openings"
                                className="form-control border-2"
                                value={jobData.openings}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Min Salary</label>
                            <input
                                type="number"
                                name="salaryMin"
                                className="form-control border-2"
                                value={jobData.salaryMin}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Max Salary</label>
                            <input
                                type="number"
                                name="salaryMax"
                                className="form-control border-2"
                                value={jobData.salaryMax}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Deadline</label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                className="form-control border-2"
                                value={jobData.applicationDeadline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12 mt-5 text-end">
                            <button type="submit" className="btn btn-teal btn-lg px-5 text-white fw-bold shadow-sm" disabled={saving}>
                                {saving ? 'Saving...' : 'Update Job Post'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EmployerEditJob;
