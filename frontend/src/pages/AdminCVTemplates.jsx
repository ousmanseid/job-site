import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminService from '../services/AdminService';

const AdminCVTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        status: 'Active',
        color: '#2c3e50',
        layouts: '2-Column',
        description: ''
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await AdminService.getAllCVTemplates();
            if (res && Array.isArray(res.data)) {
                setTemplates(res.data);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (template) => {
        try {
            const updated = { ...template, status: template.status === 'Active' ? 'Inactive' : 'Active' };
            await AdminService.updateCVTemplate(template.id, updated);
            fetchTemplates();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this template?')) {
            try {
                await AdminService.deleteCVTemplate(id);
                fetchTemplates();
            } catch (error) {
                console.error("Error deleting template:", error);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTemplate) {
                await AdminService.updateCVTemplate(editingTemplate.id, formData);
            } else {
                await AdminService.createCVTemplate(formData);
            }
            setShowModal(false);
            setEditingTemplate(null);
            setFormData({ name: '', status: 'Active', color: '#2c3e50', layouts: '2-Column', description: '' });
            fetchTemplates();
        } catch (error) {
            console.error("Error saving template:", error);
        }
    };

    const openEditModal = (template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            status: template.status,
            color: template.color,
            layouts: template.layouts,
            description: template.description || ''
        });
        setShowModal(true);
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">CV Templates</h3>
                <button className="btn btn-teal" onClick={() => { setEditingTemplate(null); setShowModal(true); }}>+ Add New Template</button>
            </div>

            {loading ? (
                <div className="text-center py-5">Loading...</div>
            ) : (
                <div className="row g-4">
                    {templates.map(template => (
                        <div className="col-md-4" key={template.id}>
                            <div className="content-card h-100 p-0 overflow-hidden shadow-sm border-0">
                                <div style={{ height: '120px', backgroundColor: template.color }} className="d-flex align-items-center justify-content-center text-white">
                                    <i className="bi bi-file-earmark-person fs-1"></i>
                                </div>
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="fw-bold mb-0">{template.name}</h5>
                                        <span className={`badge rounded-pill ${template.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                            {template.status}
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>{template.description || 'No description provided.'}</p>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button className="btn btn-sm btn-outline-primary flex-grow-1" onClick={() => openEditModal(template)}>Edit</button>
                                        <button
                                            className={`btn btn-sm ${template.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'} flex-grow-1`}
                                            onClick={() => handleToggleStatus(template)}
                                        >
                                            {template.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(template.id)}><i className="bi bi-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">{editingTemplate ? 'Edit Template' : 'Add New Template'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Template Name</label>
                                        <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Theme Color</label>
                                            <input type="color" className="form-control form-control-color w-100" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Layout</label>
                                            <select className="form-select" value={formData.layouts} onChange={e => setFormData({ ...formData, layouts: e.target.value })}>
                                                <option>1-Column</option>
                                                <option>2-Column</option>
                                                <option>Hybrid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Description / Structure</label>
                                        <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Status</label>
                                        <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-teal">Save Template</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminCVTemplates;
