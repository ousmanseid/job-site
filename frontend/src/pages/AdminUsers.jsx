import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AdminUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Job Seeker', status: 'Active', joined: 'Oct 20, 2024' },
        { id: 2, name: 'TechCorp Admin', email: 'hr@techcorp.com', role: 'Employer', status: 'Active', joined: 'Oct 18, 2024' },
        { id: 3, name: 'Alice Smith', email: 'alice@web.com', role: 'Job Seeker', status: 'Suspended', joined: 'Oct 15, 2024' },
        { id: 4, name: 'Global Sol', email: 'contact@globalsol.com', role: 'Employer', status: 'Active', joined: 'Oct 12, 2024' },
    ]);

    const handleStatus = (id, newStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    };

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Manage Users</h3>
                <div className="d-flex gap-2">
                    <input type="text" className="form-control form-control-sm" placeholder="Search by name or email..." style={{ width: '250px' }} />
                    <select className="form-select form-select-sm" style={{ width: '150px' }}>
                        <option>All Roles</option>
                        <option>Employer</option>
                        <option>Job Seeker</option>
                    </select>
                </div>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Date Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold" style={{ width: '40px', height: '40px', textAlign: 'center' }}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{user.name}</div>
                                                <div className="text-muted small">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.role}</td>
                                    <td>{user.joined}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success' :
                                                user.status === 'Suspended' ? 'bg-warning text-dark' : 'bg-danger'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        {user.status !== 'Active' ? (
                                            <button className="btn btn-sm btn-link text-success p-0 me-2" onClick={() => handleStatus(user.id, 'Active')}>Activate</button>
                                        ) : (
                                            <button className="btn btn-sm btn-link text-warning p-0 me-2" onClick={() => handleStatus(user.id, 'Suspended')}>Suspend</button>
                                        )}
                                        <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleStatus(user.id, 'Deleted')}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="alert alert-info mt-4" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> Admin cannot create or register new employer or job seeker accounts. Users must self-register.
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
