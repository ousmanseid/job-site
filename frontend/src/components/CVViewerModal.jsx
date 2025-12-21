import React, { useState, useEffect } from 'react';
import ApplicationService from '../services/ApplicationService';

const CVViewerModal = ({ applicationId, show, onClose }) => {
    const [cv, setCV] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && applicationId) {
            fetchCV();
        }
    }, [show, applicationId]);

    const fetchCV = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApplicationService.getApplicationCV(applicationId);
            setCV(response.data);
        } catch (err) {
            console.error('Error fetching CV:', err);
            setError('Failed to load CV');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="fw-bold">Applicant CV</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-teal" role="status"></div>
                                <p className="text-muted mt-3">Loading CV...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : cv ? (
                            <div className="cv-content">
                                {cv.filePath ? (
                                    // Uploaded CV File
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <i className="bi bi-file-earmark-pdf display-1 text-danger"></i>
                                            <h6 className="mt-3 fw-bold">{cv.title}</h6>
                                            <p className="text-muted small">{cv.fileName}</p>
                                        </div>
                                        <a
                                            href={`http://localhost:8085${cv.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-teal text-white px-4 py-2 rounded-pill fw-bold"
                                        >
                                            <i className="bi bi-download me-2"></i>
                                            Download CV
                                        </a>
                                    </div>
                                ) : (
                                    // Built CV
                                    <div className="cv-builder-view">
                                        <div className="mb-4 pb-3 border-bottom">
                                            <h4 className="fw-bold text-dark mb-1">{cv.title}</h4>
                                            {cv.templateName && (
                                                <span className="badge bg-teal-soft text-teal small">
                                                    Template: {cv.templateName}
                                                </span>
                                            )}
                                        </div>

                                        {cv.summary && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-person-badge me-2"></i>
                                                    Professional Summary
                                                </h6>
                                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.summary}
                                                </p>
                                            </div>
                                        )}

                                        {cv.experience && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-briefcase me-2"></i>
                                                    Experience
                                                </h6>
                                                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.experience}
                                                </div>
                                            </div>
                                        )}

                                        {cv.education && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-mortarboard me-2"></i>
                                                    Education
                                                </h6>
                                                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.education}
                                                </div>
                                            </div>
                                        )}

                                        {cv.skills && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-tools me-2"></i>
                                                    Skills
                                                </h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {cv.skills.split(',').map((skill, idx) => (
                                                        <span key={idx} className="badge bg-light text-dark px-3 py-2">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {cv.certifications && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-award me-2"></i>
                                                    Certifications
                                                </h6>
                                                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.certifications}
                                                </div>
                                            </div>
                                        )}

                                        {cv.languages && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-translate me-2"></i>
                                                    Languages
                                                </h6>
                                                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.languages}
                                                </div>
                                            </div>
                                        )}

                                        {cv.projects && (
                                            <div className="mb-4">
                                                <h6 className="fw-bold text-primary mb-2">
                                                    <i className="bi bi-folder me-2"></i>
                                                    Projects
                                                </h6>
                                                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {cv.projects}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-file-earmark-x display-4 mb-3 d-block"></i>
                                <p>No CV attached to this application</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-top-0 pt-0">
                        <button className="btn btn-light px-4 rounded-pill fw-bold" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVViewerModal;
