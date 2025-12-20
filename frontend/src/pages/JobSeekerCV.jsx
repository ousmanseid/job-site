import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const JobSeekerCV = () => {
    const [cvType, setCvType] = useState('built'); // 'built' or 'uploaded'
    const [isEditing, setIsEditing] = useState(false);

    // Mock data for built CV
    const [builtCV, setBuiltCV] = useState({
        template: 'Modern Professional',
        sections: {
            personal: { name: 'John Doe', email: 'john@example.com', phone: '+254 712 345 678' },
            education: 'BSc Computer Science, University of Nairobi',
            experience: '2 years as Frontend Developer at Tech Hub',
            skills: 'React, Node.js, CSS, Java'
        }
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`File "${file.name}" uploaded successfully!`);
            setCvType('uploaded');
        }
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">My CV & Experience</h3>
                <div className="btn-group">
                    <button
                        className={`btn btn-sm ${cvType === 'built' ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                        onClick={() => setCvType('built')}
                    >
                        Built CV
                    </button>
                    <button
                        className={`btn btn-sm ${cvType === 'uploaded' ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                        onClick={() => setCvType('uploaded')}
                    >
                        Uploaded CV
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {cvType === 'built' ? (
                        <div className="content-card">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 className="fw-bold mb-0">Interactive CV Builder</h5>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(!isEditing)}>
                                        {isEditing ? 'Save Progress' : 'Edit CV'}
                                    </button>
                                    <button className="btn btn-sm btn-success">
                                        <i className="bi bi-download me-1"></i> Download PDF
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="cv-form mt-3">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Template Style</label>
                                        <select className="form-select">
                                            <option>Modern Professional</option>
                                            <option>Clean Minimalist</option>
                                            <option>Creative Portfolio</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Work Experience</label>
                                        <textarea className="form-control" rows="4" value={builtCV.sections.experience} onChange={(e) => setBuiltCV({ ...builtCV, sections: { ...builtCV.sections, experience: e.target.value } })}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Skills (comma separated)</label>
                                        <input type="text" className="form-control" value={builtCV.sections.skills} onChange={(e) => setBuiltCV({ ...builtCV, sections: { ...builtCV.sections, skills: e.target.value } })} />
                                    </div>
                                    <button className="btn btn-teal w-100 mt-2 text-white" onClick={() => setIsEditing(false)}>Update CV</button>
                                </div>
                            ) : (
                                <div className="cv-preview p-4 border rounded bg-light shadow-sm" id="cv-preview">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold mb-1">{builtCV.sections.personal.name}</h2>
                                        <p className="text-muted small">{builtCV.sections.personal.email} | {builtCV.sections.personal.phone}</p>
                                    </div>
                                    <hr />
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-primary text-uppercase small">Professional Summary</h6>
                                        <p className="text-dark small">Highly motivated developer with strong logic and problem-solving skills.</p>
                                    </div>
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-primary text-uppercase small">Experience</h6>
                                        <p className="text-dark small">{builtCV.sections.experience}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-primary text-uppercase small">Skills</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {builtCV.sections.skills.split(',').map(s => (
                                                <span key={s} className="badge bg-white text-dark border">{s.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center mt-5">
                                        <button className="btn btn-sm btn-link text-danger" onClick={() => { if (window.confirm('Delete built CV?')) setBuiltCV({ ...builtCV, sections: { personal: {}, education: '', experience: '', skills: '' } }) }}>Delete CV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="content-card text-center py-5">
                            <div className="mb-4">
                                <i className="bi bi-cloud-arrow-up display-1 text-muted"></i>
                            </div>
                            <h5>Upload Your Own CV</h5>
                            <p className="text-muted mb-4 small">Supported formats: PDF, DOCX (Max 2MB)</p>
                            <label className="btn btn-teal text-white px-5 py-2 cursor-pointer">
                                <i className="bi bi-file-earmark-plus me-2"></i> Choose File
                                <input type="file" hidden onChange={handleFileUpload} accept=".pdf,.docx" />
                            </label>

                            <div className="mt-5 pt-3 border-top">
                                <h6 className="fw-bold mb-3">Currently Active CV:</h6>
                                <div className="d-inline-flex align-items-center gap-3 bg-light p-3 rounded border">
                                    <i className="bi bi-file-pdf text-danger fs-3"></i>
                                    <div className="text-start">
                                        <div className="fw-bold small">john_doe_cv_2024.pdf</div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Uploaded on Oct 12, 2024</div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger ms-3">Remove</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-lg-4">
                    <div className="content-card mb-4 bg-primary text-white border-0">
                        <h5 className="fw-bold mb-3">CV Tip of the Day</h5>
                        <p className="small opacity-75">Quantify your achievements! Instead of saying "Improved performance", say "Improved performance by 40% using React optimizations".</p>
                    </div>
                    <div className="content-card">
                        <h6 className="fw-bold mb-3">Resume Strength</h6>
                        <div className="progress mb-2" style={{ height: '10px' }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%' }}></div>
                        </div>
                        <p className="small text-muted mb-0">Your resume is 85% ready for top-tier jobs. Add "Certifications" to reach 100%.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerCV;
