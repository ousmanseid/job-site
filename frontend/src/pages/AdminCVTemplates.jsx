import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AdminCVTemplates = () => {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Professional Modern', status: 'Active', color: '#2c3e50', layouts: '2-Column' },
        { id: 2, name: 'Clean Minimalist', status: 'Active', color: '#1abc9c', layouts: '1-Column' },
        { id: 3, name: 'Executive Blue', status: 'Inactive', color: '#3498db', layouts: '2-Column' },
    ]);

    const toggleStatus = (id) => {
        setTemplates(templates.map(t =>
            t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t
        ));
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">CV Templates</h3>
                <button className="btn btn-teal">+ Add New Template</button>
            </div>

            <div className="row g-4">
                {templates.map(template => (
                    <div className="col-md-4" key={template.id}>
                        <div className="content-card h-100 p-0 overflow-hidden">
                            <div style={{ height: '150px', backgroundColor: template.color }} className="d-flex align-items-center justify-content-center text-white p-3">
                                <i className="bi bi-file-earmark-person display-4"></i>
                            </div>
                            <div className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold mb-0">{template.name}</h5>
                                    <span className={`badge rounded-pill ${template.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                        {template.status}
                                    </span>
                                </div>
                                <p className="text-muted small mb-4">Structure: Personal Info, Education, Skills, Work Exp, Certifications.</p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary flex-grow-1">Edit Sections</button>
                                    <button
                                        className={`btn btn-sm ${template.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'} flex-grow-1`}
                                        onClick={() => toggleStatus(template.id)}
                                    >
                                        {template.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="content-card mt-5">
                <h5 className="content-title">Global CV Sections Configuration</h5>
                <p className="text-muted small mb-4">Manage which sections are mandatory across all templates.</p>
                <div className="row g-2">
                    {['Personal Information', 'Education', 'Skills', 'Work Experience', 'Certifications', 'Languages', 'Projects'].map(section => (
                        <div className="col-md-4" key={section}>
                            <div className="p-2 border rounded d-flex justify-content-between align-items-center">
                                <span>{section}</span>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" defaultChecked />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-teal mt-4">Save Global Structure</button>
            </div>
        </DashboardLayout>
    );
};

export default AdminCVTemplates;
