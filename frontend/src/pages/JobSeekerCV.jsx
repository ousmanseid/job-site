import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import JobSeekerService from '../services/JobSeekerService';

const JobSeekerCV = () => {
    const [cvs, setCvs] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCV, setSelectedCV] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
        templateName: '',
        templateId: ''
    });

    const [uploadData, setUploadData] = useState({
        file: null,
        title: 'My Resume'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const cvRes = await JobSeekerService.getCVs();
            setCvs(cvRes.data || []);

            const tempRes = await JobSeekerService.getCVTemplates();
            setTemplates(tempRes.data || []);

            // Pre-fill if editing
            if (selectedCV && !selectedCV.filePath) {
                setFormData({
                    title: selectedCV.title || '',
                    summary: selectedCV.summary || '',
                    experience: selectedCV.experience || '',
                    education: selectedCV.education || '',
                    skills: selectedCV.skills || '',
                    templateName: selectedCV.templateName || ''
                });
            }
        } catch (error) {
            console.error("Error fetching CV data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBuiltCV = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedCV) {
                await JobSeekerService.updateCV(selectedCV.id, formData);
            } else {
                await JobSeekerService.saveCV(formData);
            }
            setShowModal(false);
            setIsEditing(false);
            setSelectedCV(null);
            fetchData();
            alert('CV saved successfully!');
        } catch (error) {
            console.error("Error saving CV:", error);
            alert('Failed to save CV.');
        }
    };

    const handleUploadCV = async (e) => {
        e.preventDefault();
        if (!uploadData.file) {
            alert('Please select a file');
            return;
        }

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(uploadData.file.type)) {
            alert('Please upload a PDF or Word document (.pdf, .docx, .doc)');
            return;
        }

        // Validate file size (max 5MB)
        if (uploadData.file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            console.log('Uploading CV:', uploadData.file.name);
            const response = await JobSeekerService.uploadCV(uploadData.file, uploadData.title);
            console.log('Upload response:', response);
            setShowUploadModal(false);
            setUploadData({ file: null, title: 'My Resume' });
            await fetchData(); // Refresh the CV list
            alert('CV uploaded successfully!');
        } catch (error) {
            console.error("Error uploading CV:", error);
            const errorMsg = error.response?.data || error.message || 'Failed to upload CV.';
            alert('Upload failed: ' + errorMsg);
        }
    };

    const handleDeleteCV = async (id) => {
        if (window.confirm('Are you sure you want to delete this CV?')) {
            try {
                await JobSeekerService.deleteCV(id);
                await fetchData();
                alert('CV deleted successfully!');
            } catch (error) {
                console.error("Error deleting CV:", error);
                alert('Failed to delete CV: ' + (error.response?.data || error.message));
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            console.log('Setting CV as default:', id);
            const response = await JobSeekerService.setAsDefaultCV(id);
            console.log('Set default response:', response);
            await fetchData(); // Refresh to show updated default status
            alert('Default CV updated successfully!');
        } catch (error) {
            console.error("Error setting default:", error);
            alert('Failed to set default CV: ' + (error.response?.data || error.message));
        }
    };

    const openCreateModal = (template) => {
        setFormData({
            title: `${template.name} CV`,
            summary: '',
            experience: '',
            education: '',
            skills: '',
            templateName: template.name,
            templateId: template.id
        });
        setIsEditing(false);
        setSelectedCV(null);
        setShowModal(true);
    };

    const openEditModal = (cv) => {
        setSelectedCV(cv);
        setFormData({
            title: cv.title || '',
            summary: cv.summary || '',
            experience: cv.experience || '',
            education: cv.education || '',
            skills: cv.skills || '',
            templateName: cv.templateName || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    return (
        <DashboardLayout role="jobseeker">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">My CVs & Resumes</h3>
                <div className="d-flex gap-2">
                    <button className="btn btn-teal text-white shadow-sm" onClick={() => setShowUploadModal(true)}>
                        <i className="bi bi-cloud-arrow-up me-2"></i> Upload PDF/Word
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* User CVs List */}
                <div className="col-lg-8">
                    <h5 className="fw-bold mb-3">Your Saved CVs</h5>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-teal" role="status"></div>
                        </div>
                    ) : cvs.length > 0 ? (
                        <div className="row g-3">
                            {cvs.map(cv => (
                                <div className="col-md-6" key={cv.id}>
                                    <div className={`content-card border-0 shadow-sm h-100 position-relative ${cv.isDefault ? 'border-start border-4 border-teal' : ''}`}>
                                        {cv.isDefault && <span className="badge bg-teal text-white position-absolute top-0 end-0 m-2 extra-small">Default</span>}
                                        <div className="d-flex gap-3">
                                            <div className={`rounded p-3 d-flex align-items-center justify-content-center text-white ${cv.filePath ? 'bg-danger' : 'bg-primary'}`} style={{ width: '60px', height: '60px' }}>
                                                <i className={`bi ${cv.filePath ? 'bi-file-earmark-pdf' : 'bi-file-earmark-person'} fs-3`}></i>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-1 text-truncate">{cv.title}</h6>
                                                <p className="extra-small text-muted mb-2">{cv.filePath ? 'Uploaded File' : `Style: ${cv.templateName}`}</p>
                                                <div className="d-flex gap-2">
                                                    {!cv.filePath ? (
                                                        <button className="btn btn-sm btn-light extra-small px-2" onClick={() => openEditModal(cv)}>Edit</button>
                                                    ) : (
                                                        <a href={`http://localhost:8085${cv.filePath}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-light extra-small px-2">Download</a>
                                                    )}
                                                    {!cv.isDefault && (
                                                        <button className="btn btn-sm btn-light extra-small px-2" onClick={() => handleSetDefault(cv.id)}>Set Default</button>
                                                    )}
                                                    <button className="btn btn-sm btn-outline-danger extra-small px-2" onClick={() => handleDeleteCV(cv.id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="content-card text-center py-5 border-dashed">
                            <i className="bi bi-file-earmark-x display-4 text-muted mb-3 d-block"></i>
                            <p className="text-muted">You haven't added any CVs yet.</p>
                            <p className="small text-muted mb-4">Choose a template below to build one or upload an existing file.</p>
                        </div>
                    )}

                    {/* Templates Section */}
                    <div className="mt-5">
                        <h5 className="fw-bold mb-3">Available CV Templates</h5>
                        <div className="row g-3">
                            {templates.map(template => (
                                <div className="col-md-4" key={template.id}>
                                    <div className="content-card p-0 overflow-hidden h-100 hover-lift border-0 shadow-sm">
                                        <div className="template-preview d-flex align-items-center justify-content-center text-white" style={{ height: '100px', backgroundColor: template.color }}>
                                            <i className="bi bi-layout-text-sidebar-reverse fs-2"></i>
                                        </div>
                                        <div className="p-3">
                                            <h6 className="fw-bold mb-1 small">{template.name}</h6>
                                            <p className="extra-small text-muted mb-2">{template.description || 'Professional design'}</p>
                                            <button className="btn btn-sm btn-teal text-white w-100 extra-small" onClick={() => openCreateModal(template)}>Use Template</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="content-card bg-light border-0">
                        <h6 className="fw-bold mb-3 text-primary"><i className="bi bi-lightbulb me-2"></i>CV Builder Guide</h6>
                        <ul className="list-unstyled small mb-0 d-flex flex-column gap-3">
                            <li className="d-flex gap-2">
                                <i className="bi bi-check-circle-fill text-teal"></i>
                                <span>Choose a template that matches your industry.</span>
                            </li>
                            <li className="d-flex gap-2">
                                <i className="bi bi-check-circle-fill text-teal"></i>
                                <span>Keep your summary concise and impactful.</span>
                            </li>
                            <li className="d-flex gap-2">
                                <i className="bi bi-check-circle-fill text-teal"></i>
                                <span>List skills that match job descriptions.</span>
                            </li>
                            <li className="d-flex gap-2">
                                <i className="bi bi-check-circle-fill text-teal"></i>
                                <span>Your "Default" CV will be the first one employers see.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Build CV Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="fw-bold">{isEditing ? 'Editing CV' : `Building ${formData.templateName} CV`}</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveBuiltCV}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">CV Title</label>
                                        <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer CV" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Professional Summary</label>
                                        <textarea className="form-control" rows="3" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })}></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold">Experience (Pre-formatted)</label>
                                            <textarea className="form-control" rows="6" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} placeholder="Company Name | Role | Dates&#10;• Task 1&#10;• Task 2"></textarea>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold">Education</label>
                                            <textarea className="form-control" rows="6" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} placeholder="Degree | Institution | Year"></textarea>
                                        </div>
                                    </div>
                                    <div className="mb-0">
                                        <label className="form-label small fw-bold">Skills (Comma separated)</label>
                                        <input type="text" className="form-control" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Java, Python..." />
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0 p-4">
                                    <button type="button" className="btn btn-light px-4 rounded-pill fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-teal text-white px-4 rounded-pill fw-bold">{isEditing ? 'Update CV' : 'Save & Close'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload CV Modal */}
            {showUploadModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="fw-bold">Upload CV File</h5>
                                <button className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                            </div>
                            <form onSubmit={handleUploadCV}>
                                <div className="modal-body p-4">
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">CV Label / Title</label>
                                        <input type="text" className="form-control" value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })} />
                                    </div>
                                    <div className="mb-0">
                                        <label className="form-label small fw-bold">Choose File (PDF or DOCX)</label>
                                        <input type="file" className="form-control" accept=".pdf,.docx" required onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })} />
                                        <div className="form-text extra-small mt-1">Recommended size: Under 2MB</div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0 p-4">
                                    <button type="button" className="btn btn-light px-4 rounded-pill fw-bold" onClick={() => setShowUploadModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-teal text-white px-4 rounded-pill fw-bold">Start Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .border-dashed { border: 2px dashed #dee2e6 !important; }
                .hover-lift { transition: transform 0.2s; }
                .hover-lift:hover { transform: translateY(-5px); }
            `}</style>
        </DashboardLayout>
    );
};

export default JobSeekerCV;
