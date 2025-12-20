import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applied, setApplied] = useState(false);

    // Mock job details
    const job = {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        email: 'jobs@techcorp.com',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120k - $150k',
        date: '2 days ago',
        description: `We are looking for a Senior Frontend Developer to join our team...
        
        Responsibilities:
        - Develop new user-facing features using React.js
        - Build reusable components and front-end libraries for future use
        - Optimize applications for maximum speed and scalability
        
        Requirements:
        - 5+ years of experience with modern frontend frameworks
        - Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model
        - Thorough understanding of React.js and its core principles`,
        skills: ['React', 'TypeScript', 'Redux', 'Unit Testing']
    };

    const handleApply = () => {
        if (!user) {
            alert('Please login as a Job Seeker to apply.');
            navigate('/login');
            return;
        }

        if (user.role !== 'jobseeker') {
            alert('Only Job Seekers can apply for roles.');
            return;
        }

        alert('Application submitted successfully using your default CV!');
        setApplied(true);
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-bold mb-1">{job.title}</h2>
                                <p className="mb-0 opacity-75">{job.company} • {job.location}</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-light" onClick={() => navigate(-1)}>Back</button>
                                {!applied ? (
                                    <button className="btn btn-teal text-white fw-bold px-4" onClick={handleApply}>Apply Now</button>
                                ) : (
                                    <button className="btn btn-success fw-bold px-4" disabled>Applied ✓</button>
                                )}
                            </div>
                        </div>

                        <div className="card-body p-5">
                            <div className="row mb-5">
                                <div className="col-md-3 border-end">
                                    <div className="mb-4">
                                        <label className="text-muted small fw-bold text-uppercase">Salary Range</label>
                                        <p className="fw-bold text-success mb-0">{job.salary}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 border-end">
                                    <div className="mb-4">
                                        <label className="text-muted small fw-bold text-uppercase">Job Type</label>
                                        <p className="fw-bold mb-0">{job.type}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 border-end px-md-4">
                                    <div className="mb-4">
                                        <label className="text-muted small fw-bold text-uppercase">Posted</label>
                                        <p className="fw-bold mb-0">{job.date}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 px-md-4">
                                    <div className="mb-4">
                                        <label className="text-muted small fw-bold text-uppercase">Contact</label>
                                        <p className="fw-bold mb-0 text-primary">{job.email}</p>
                                    </div>
                                </div>
                            </div>

                            <h5 className="fw-bold mb-3 border-bottom pb-2">Job Description</h5>
                            <div className="job-description mb-5" style={{ whiteSpace: 'pre-line' }}>
                                {job.description}
                            </div>

                            <h5 className="fw-bold mb-3 border-bottom pb-2">Skills & Requirements</h5>
                            <div className="d-flex flex-wrap gap-2 mb-5">
                                {job.skills.map(skill => (
                                    <span key={skill} className="badge bg-light text-dark border px-3 py-2 fw-normal">{skill}</span>
                                ))}
                            </div>

                            <div className="bg-light p-4 rounded-4 border">
                                <h6 className="fw-bold mb-2">About the Company</h6>
                                <p className="mb-0 small text-muted">TechCorp Solutions is a leader in modern web technologies, providing innovative solutions to Fortune 500 companies worldwide.</p>
                                <div className="mt-3">
                                    <span className="text-primary small fw-bold cursor-pointer">View Company Profile →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
