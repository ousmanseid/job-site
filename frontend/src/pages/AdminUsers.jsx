import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminService from '../services/AdminService';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await AdminService.getAllUsers();
            if (res && Array.isArray(res.data)) {
                setUsers(res.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, action) => {
        try {
            if (action === 'Suspend') {
                await AdminService.deactivateUser(id);
            } else if (action === 'Delete') {
                if (window.confirm('Are you sure you want to delete this user?')) {
                    await AdminService.deleteUser(id);
                } else return;
            } else if (action === 'Activate') {
                await AdminService.activateUser(id);
            }
            fetchUsers();
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const isEmployer = user.roles.some(r => r.name === 'ROLE_EMPLOYER');
        const isJobSeeker = user.roles.some(r => r.name === 'ROLE_JOBSEEKER');

        let matchesRole = true;
        if (roleFilter === 'Employer') matchesRole = isEmployer;
        if (roleFilter === 'Job Seeker') matchesRole = isJobSeeker;

        return matchesSearch && matchesRole;
    });

    return (
        <DashboardLayout role="admin">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Manage Users</h3>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search by name or email..."
                        style={{ width: '250px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '150px' }}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
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
                            {loading ? (
                                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2 text-primary fw-bold" style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '24px' }}>
                                                    {user.firstName ? user.firstName[0] : ''}{user.lastName ? user.lastName[0] : ''}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{user.firstName} {user.lastName}</div>
                                                    <div className="text-muted small">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {user.roles.some(r => r.name === 'ROLE_EMPLOYER') ? (
                                                <div>
                                                    <div className="fw-bold text-teal">Employer</div>
                                                    <div className="small text-muted">{user.company ? user.company.name : 'No Company Profile'}</div>
                                                </div>
                                            ) : 'Job Seeker'}
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${user.isActive ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {user.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td>
                                            {!user.isActive ? (
                                                <button className="btn btn-sm btn-link text-success p-0 me-2" onClick={() => handleStatus(user.id, 'Activate')}>Activate</button>
                                            ) : (
                                                <button className="btn btn-sm btn-link text-warning p-0 me-2" onClick={() => handleStatus(user.id, 'Suspend')}>Suspend</button>
                                            )}
                                            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleStatus(user.id, 'Delete')}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center">No users found.</td></tr>
                            )}
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
