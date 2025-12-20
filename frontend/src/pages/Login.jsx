import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleLabel, setRoleLabel] = useState('jobseeker'); // UI label: jobseeker, employer, employer_pending
    const { login } = useAuth();
    const navigate = useNavigate();

    // Mock Credentials for Demo
    const MOCK_USERS = {
        admin: { email: 'admin@sjp.com', password: 'admin123', role: 'admin', name: 'System Admin' },
        employer: { email: 'hr@techcorp.com', password: 'employer123', role: 'employer', name: 'TechCorp HR', status: 'Active' },
        seeker: { email: 'john@example.com', password: 'seeker123', role: 'jobseeker', name: 'John Doe', status: 'Active' }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Check for Admin first (Hidden role)
        if (email === MOCK_USERS.admin.email && password === MOCK_USERS.admin.password) {
            login(MOCK_USERS.admin);
            navigate('/dashboard/admin');
            return;
        }

        // 2. Check for Employer or Job Seeker
        let authenticatedUser = null;

        if (roleLabel === 'jobseeker') {
            if (email === MOCK_USERS.seeker.email && password === MOCK_USERS.seeker.password) {
                authenticatedUser = MOCK_USERS.seeker;
            }
        } else if (roleLabel === 'employer') {
            if (email === MOCK_USERS.employer.email && password === MOCK_USERS.employer.password) {
                authenticatedUser = MOCK_USERS.employer;
            } else if (email === 'new@startup.com' && password === 'startup123') {
                // This email simulates a real user that isn't approved yet in the database
                alert('Your account is waiting for admin approval. You cannot log in yet.');
                return;
            }
        }

        if (authenticatedUser) {
            login(authenticatedUser);
            if (authenticatedUser.role === 'employer') navigate('/dashboard/employer');
            else navigate('/');
        } else {
            alert('Invalid email or password. Please use the demo credentials provided below.');
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 shadow p-4 rounded-4">
                        <h3 className="fw-bold text-center mb-4">Welcome Back</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    placeholder="e.g. john@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Login As</label>
                                <select
                                    className="form-select"
                                    value={roleLabel}
                                    onChange={(e) => setRoleLabel(e.target.value)}
                                >
                                    <option value="jobseeker">Job Seeker</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 btn-lg mb-4 mt-2">Login</button>

                            {/* Demo Credentials Box */}
                            <div className="bg-light p-3 rounded-4 mb-3" style={{ fontSize: '0.85rem' }}>
                                <p className="fw-bold mb-2 text-primary">Demo Credentials:</p>
                                <div className="mb-1"><strong>Admin:</strong> admin@sjp.com / admin123</div>
                                <div className="mb-1"><strong>Employer:</strong> hr@techcorp.com / employer123</div>
                                <div className="mb-1"><strong>Job Seeker:</strong> john@example.com / seeker123</div>
                                <div className="mt-2 text-muted italic">Note: To test the "Pending Approval" restriction, try logging in as an Employer with 'new@startup.com' / 'startup123'.</div>
                            </div>

                            <p className="text-center text-muted">Don't have an account? <a href="/register" className='text-decoration-none fw-bold'>Sign up</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
