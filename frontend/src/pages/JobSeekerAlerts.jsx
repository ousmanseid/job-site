import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const JobSeekerAlerts = () => {
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [preferences, setPreferences] = useState({
        keywords: 'React, Node.js, Remote',
        location: 'Nairobi',
        type: 'Full-time'
    });

    return (
        <DashboardLayout role="jobseeker">
            <h3 className="fw-bold mb-4">Job Alert Settings</h3>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="content-card">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h5 className="fw-bold mb-0">Preferences</h5>
                            <div className="form-check form-switch">
                                <label className="form-check-label small text-muted me-2" htmlFor="alertToggle">
                                    {alertsEnabled ? 'ON' : 'OFF'}
                                </label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="alertToggle"
                                    checked={alertsEnabled}
                                    onChange={() => setAlertsEnabled(!alertsEnabled)}
                                />
                            </div>
                        </div>

                        <form className={!alertsEnabled ? 'opacity-50' : ''}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Keywords / Job Titles</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={preferences.keywords}
                                    onChange={(e) => setPreferences({ ...preferences, keywords: e.target.value })}
                                    disabled={!alertsEnabled}
                                />
                                <div className="form-text small">Enter comma separated roles (e.g., UI Designer, Project Manager)</div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Preferred Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={preferences.location}
                                        onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                                        disabled={!alertsEnabled}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Job type</label>
                                    <select
                                        className="form-select"
                                        value={preferences.type}
                                        onChange={(e) => setPreferences({ ...preferences, type: e.target.value })}
                                        disabled={!alertsEnabled}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 pt-2">
                                <label className="form-label small fw-bold">Notification Method</label>
                                <div className="d-flex gap-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" defaultChecked id="emailAlert" disabled={!alertsEnabled} />
                                        <label className="form-check-label small" htmlFor="emailAlert">Email</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="pushAlert" disabled={!alertsEnabled} />
                                        <label className="form-check-label small" htmlFor="pushAlert">In-app Notification</label>
                                    </div>
                                </div>
                            </div>

                            <button type="button" className="btn btn-teal text-white w-100 py-2" disabled={!alertsEnabled} onClick={() => alert('Alert settings saved!')}>
                                Update Alert Preferences
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="content-card mb-4 border-0" style={{ backgroundColor: '#fffbeb' }}>
                        <h6 className="fw-bold mb-2 text-warning-emphasis"><i className="bi bi-info-circle me-2"></i> How alerts work</h6>
                        <p className="small text-muted mb-0">We scan new job listings every hour. If a match is found based on your keywords and location, we'll notify you immediately so you can be the first to apply.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobSeekerAlerts;
