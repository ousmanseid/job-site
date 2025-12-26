import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ApplicationService from '../services/ApplicationService';
import { Link } from 'react-router-dom';

const EmployerApplications = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterJob, setFilterJob] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await ApplicationService.getCompanyApplications();
            if (res && res.data) {
                setApplicants(res.data);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        const notes = prompt(`Enter notes for ${status} status (optional):`);
        try {
            await ApplicationService.updateApplicationStatus(id, status, notes);
            setShowModal(false);
            fetchApplications(); // Refresh
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const uniqueJobs = ['All', ...new Set(applicants.map(a => a.job ? a.job.title : 'Unknown'))];

    const filteredApplicants = applicants.filter(app => {
        if (filterJob === 'All') return true;
        return app.job && app.job.title === filterJob;
    });

    const openDetails = (app) => {
        setSelectedApp(app);
        setShowModal(true);
    };

    return (
        <DashboardLayout role="employer">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Recruitment / Applications</h3>
                <select
                    className="form-select w-25 shadow-none"
                    value={filterJob}
                    onChange={(e) => setFilterJob(e.target.value)}
                >
                    {uniqueJobs.map(job => (
                        <option key={job} value={job}>{job}</option>
                    ))}
                </select>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Candidate</th>
                                <th>Job Applied</th>
                                <th>Date</th>
                                <th>CV Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : filteredApplicants.length > 0 ? (
                                filteredApplicants.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                                                    {item.applicant ? `${item.applicant.firstName?.[0] || ''}${item.applicant.lastName?.[0] || ''}` : 'U'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-primary">
                                                        <Link to={`/dashboard/employer/applicant/${item.applicant?.id}`} className="text-decoration-none">
                                                            {item.applicant ? `${item.applicant.firstName} ${item.applicant.lastName}` : 'Unknown'}
                                                        </Link>
                                                    </div>
                                                    <div className="small text-muted">{item.applicant?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold small">{item.job ? item.job.title : 'N/A'}</div>
                                        </td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {item.cv ? (
                                                <span className={`badge ${item.cv.filePath ? 'bg-danger' : 'bg-primary'} extra-small`}>
                                                    {item.cv.filePath ? 'PDF/File' : 'Built CV'}
                                                </span>
                                            ) : (
                                                <span className="text-muted small">No CV attached</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${item.status === 'ACCEPTED' || item.status === 'SHORTLISTED' ? 'bg-success' :
                                                item.status === 'REJECTED' ? 'bg-danger' :
                                                    'bg-warning text-dark'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-teal text-white extra-small" onClick={() => openDetails(item)}>View Application</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center py-4 text-muted">No applications found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            {showModal && selectedApp && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                            <div className="modal-header bg-light p-4">
                                <div>
                                    <h5 className="fw-bold mb-1">Application for {selectedApp.job?.title}</h5>
                                    <p className="text-muted small mb-0">Submitted by: {selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName}</p>
                                </div>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small text-muted mb-2">Cover Letter / Note</h6>
                                    <div className="p-3 bg-light rounded small lh-lg">
                                        {selectedApp.coverLetter || 'No cover letter provided.'}
                                    </div>
                                </div>

                                <hr />

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small text-muted mb-3 d-flex justify-content-between">
                                        Candidate CV Content
                                        {selectedApp.cv?.filePath && (
                                            <a href={`http://localhost:8085${selectedApp.cv.filePath}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-primary p-0 text-decoration-none">
                                                <i className="bi bi-download me-1"></i> Download PDF
                                            </a>
                                        )}
                                    </h6>

                                    {selectedApp.cv ? (
                                        selectedApp.cv.filePath ? (
                                            <div className="text-center py-4 border rounded bg-light">
                                                <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-2 d-block"></i>
                                                <p className="small mb-2">This candidate uploaded a document: <strong>{selectedApp.cv.fileName}</strong></p>
                                                <a href={`http://localhost:8085${selectedApp.cv.filePath}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-danger px-4 rounded-pill">View PDF Document</a>
                                            </div>
                                        ) : (
                                            <div className="cv-content-preview p-4 border rounded shadow-sm bg-white">
                                                <div className="text-center mb-4 border-bottom pb-3">
                                                    <h5 className="fw-bold mb-1">{selectedApp.cv.title}</h5>
                                                    <p className="extra-small text-muted">SmartJob Built Profile (Style: {selectedApp.cv.templateName})</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="fw-bold extra-small text-primary text-uppercase">Summary</h6>
                                                    <p className="small">{selectedApp.cv.summary || 'N/A'}</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold extra-small text-primary text-uppercase">Experience</h6>
                                                        <div className="small white-space-pre">{selectedApp.cv.experience || 'N/A'}</div>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <h6 className="fw-bold extra-small text-primary text-uppercase">Education</h6>
                                                        <div className="small white-space-pre">{selectedApp.cv.education || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <h6 className="fw-bold extra-small text-primary text-uppercase">Skills</h6>
                                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                                        {selectedApp.cv.skills ? selectedApp.cv.skills.split(',').map(s => (
                                                            <span key={s} className="badge bg-light text-dark border small fw-normal">{s.trim()}</span>
                                                        )) : <span className="text-muted extra-small">None listed.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="alert alert-warning small">No specific CV was selected for this application. Profile details might be available in the Candidate Profile view.</div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer bg-light p-4 d-flex justify-content-between">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-success px-4 rounded-pill fw-bold" onClick={() => updateStatus(selectedApp.id, 'SHORTLISTED')} disabled={selectedApp.status === 'SHORTLISTED'}>Shortlist Candidate</button>
                                    <button className="btn btn-outline-danger px-4 rounded-pill fw-bold" onClick={() => updateStatus(selectedApp.id, 'REJECTED')} disabled={selectedApp.status === 'REJECTED'}>Reject</button>
                                </div>
                                <button className="btn btn-secondary px-4 rounded-pill fw-bold" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .white-space-pre { white-space: pre-wrap; }
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </DashboardLayout>
    );
};

export default EmployerApplications;
