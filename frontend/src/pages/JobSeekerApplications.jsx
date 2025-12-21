import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ApplicationService from '../services/ApplicationService';

const JobSeekerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All Status');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await ApplicationService.getMyApplications();
                setApplications(res.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => {
        if (filterStatus === 'All Status') return true;
        return app.status === filterStatus;
    });

    return (
        <DashboardLayout role="jobseeker">
            <h3 className="fw-bold mb-4">My Applications</h3>

            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="content-title mb-0">Application Tracking</h5>
                    <div className="d-flex gap-2">
                        <select
                            className="form-select form-select-sm"
                            style={{ width: '150px' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Status</option>
                            <option value="SUBMITTED">Pending</option>
                            <option value="INTERVIEW_SCHEDULED">Interview</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="ACCEPTED">Accepted</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Job Role</th>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                            ) : filteredApplications.length > 0 ? (
                                filteredApplications.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="fw-bold text-dark">{app.job ? app.job.title : 'Unknown Job'}</div>
                                            {app.employerNotes && (
                                                <div className="extra-small text-info mt-1 fst-italic">
                                                    Note: {app.employerNotes}
                                                </div>
                                            )}
                                        </td>
                                        <td>{app.job && app.job.company ? app.job.company.name : 'Unknown Company'}</td>
                                        <td><span className="small text-muted">{app.job ? app.job.jobType : ''}</span></td>
                                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${app.status === 'INTERVIEW_SCHEDULED' ? 'bg-success' :
                                                app.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/jobs/${app.job?.id}`} className="btn btn-sm btn-outline-primary me-2">Details</Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to withdraw this application?')) {
                                                        try {
                                                            await ApplicationService.withdrawApplication(app.id);
                                                            window.location.reload();
                                                        } catch (error) {
                                                            console.error("Error withdrawing:", error);
                                                            alert("Failed to withdraw application.");
                                                        }
                                                    }
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center">No applications found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerApplications;
